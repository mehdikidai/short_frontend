<script setup>
import Layout from "@/components/Layout.vue";
import Chart from "chart.js/auto";
import { ref, watch, computed } from "vue";
import { useCssVar } from "@vueuse/core";
import { useAxios } from "@/api";
import { useUserStore } from "@/stores/user";
import { z } from "zod";

const mainColor = useCssVar("--main");
const store = useUserStore();

const chartA = ref(null);
const chartB = ref(null);

const chartInstanceOne = ref(null);
const chartInstanceTwo = ref(null);

const updateAnalytics = ref(null);

const filter = ref("all");

//--------------------------------------------------------------------------

const listFilter = ref([
    "last_day",
    "last_week",
    "last_month",
    "last_year",
    "all",
]);

const FilterEnum = z.enum(listFilter.value);

//--------------------------------------------------------------------------

const totalUrls = ref(0);
const urls = ref([]);
const visits = computed(() =>
    urls.value.reduce((total, el) => total + el.clicks_count, 0)
);
const trash = ref(0);

const data_visits = computed(() => {
    let list = [];
    urls.value.forEach((el) => {
        list.push({
            id: el.id,
            visits: el.clicks_count,
        });
    });

    return [...list, ...new Array(5).fill({ id: "_", visits: "0" })].slice(
        0,
        5
    );
});

const numberOfVisits = ref([]);

//--------------------------------------------------------------------------

const gridChart = {
    x: {
        display: true,

        grid: {
            display: false,
        },
        border: {
            color: "#0000",
        },
    },
    y: {
        display: true,
        grid: {
            display: false,
        },
        border: {
            color: "#0000",
        },
    },
};

watch([data_visits], () => {
    chartVisits(data_visits.value);
    chartTwo(numberOfVisits.value);
});

watch(
    [updateAnalytics, filter],
    async () => {
        const { success } = FilterEnum.safeParse(filter.value);

        if (success) {
            try {
                const response = await useAxios(
                    `/api/analytics/${filter.value}`,
                    {
                        ...store.configApi,
                    }
                );

                console.log(response.data.total_urls)

                totalUrls.value = response.data.total_urls;
                urls.value = response.data.urls;
                trash.value = response.data.urls_trash;
                numberOfVisits.value = response.data.number_of_visits;
                console.log(response.data.number_of_visits);
            } catch (error) {
                console.log(error.message);
            }
        }
    },
    { immediate: true }
);

const chartVisits = (DATA) => {
    if (chartInstanceOne.value) {
        chartInstanceOne.value.destroy();
    }

    chartInstanceOne.value = new Chart(chartA.value, {
        type: "line",
        data: {
            labels: DATA.map((row) => row.id),
            datasets: [
                {
                    label: "Number of visits by id",
                    data: DATA.map((row) => row.visits),
                    backgroundColor: "#3fdd78",
                    borderColor: "rgba(63, 221, 121, 0.3)", // mainColor.value
                    tension: 0.4,
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Custom Chart Title",
                    color: "#3fdd78",
                    align: "start",
                    fullSize: true,
                    padding: {
                        top: 10,
                        bottom: 30,
                    },
                    font: {
                        size: 16,
                    },
                },
                legend: {
                    display: false,
                },
            },
            layout: {
                padding: 20,
            },
            scales: gridChart,
        },
    });
};

const chartTwo = (DATA) => {
    if (chartInstanceTwo.value) {
        chartInstanceTwo.value.destroy();
    }

    chartInstanceTwo.value = new Chart(chartB.value, {
        type: "bar",
        data: {
            labels: Object.keys(DATA),
            datasets: [
                {
                    label: "Visits",
                    data: Object.values(DATA),
                    backgroundColor: "rgba(252, 172, 86, 0.4)",
                    borderColor: "#36A2EB",
                    barPercentage: 0.1,
                    borderRadius: 6,
                    borderSkipped: false,
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Custom Chart Title",
                    color: "#fcac56",
                    align: "start",
                    fullSize: true,
                    padding: {
                        top: 10,
                        bottom: 30,
                    },
                    font: {
                        size: 16,
                    },
                },
                legend: {
                    display: false,
                },
            },
            layout: {
                padding: 20,
            },
            scales: gridChart,
        },
    });
};

</script>

<template>
    <Layout>
        <div class="filter_url_x">
            <span
                ><select name="cars" id="cars" v-model="filter">
                    <option
                        v-for="(item, i) in listFilter"
                        :key="i"
                        :value="item"
                    >
                        {{ item.replace("_", " ") }}
                    </option>
                </select>
                <Icon name="tune" />
            </span>
        </div>
        <div class="boxs">
            <div class="box" v-kidai>
                <div class="icon">
                    <icon name="link" />
                </div>
                <div class="content">
                    <h2>Number of links</h2>
                    <h3>{{ totalUrls }}</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>

            <div class="box" v-kidai>
                <div class="icon_filter">
                    <icon name="more_horiz" />
                </div>
                <div class="icon">
                    <icon name="visibility" />
                </div>
                <div class="content">
                    <h2>Number of visits</h2>
                    <h3>{{ visits }}</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
            <div class="box" v-kidai>
                <div class="icon">
                    <icon name="delete" />
                </div>
                <div class="content">
                    <h2>Deleted urls</h2>
                    <h3>{{ trash }}</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
        </div>
        <div class="chart_boxs">
            <div class="box_1" v-kidai>
                <canvas ref="chartA"></canvas>
            </div>
            <div class="box_2" v-kidai>
                <canvas ref="chartB"></canvas>
            </div>
        </div>
    </Layout>
</template>

<style lang="scss" scoped>
@import "./../assets/scss/_var";

.filter_url_x {
    height: 36px;
    //background: red;
    margin-bottom: 20px;
    span {
        float: right;
        position: relative;
        select {
            font-size: 0.9rem;
            padding: 6px 40px 6px 15px;
            border-radius: 4px;
            background: var(--white);
            color: var(--black);
            border: var(--border);
            appearance: none;
            font-size: 14px;
            text-transform: capitalize;
            cursor: pointer;
            option {
                background: transparent;
                color: var(--black);
                border: none;
            }
           
        }
        i {
            position: absolute;
            background: transparent;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 18px;
            color: var(--black);
            pointer-events: none;
        }
    }
}

.boxs {
    min-height: 100px;
    //background: red;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    .box {
        flex: 1 1 360px;
        background: var(--white);
        height: 150px;
        border-radius: 12px;
        display: flex;
        align-items: stretch;
        padding: 20px;
        gap: 20px;
        box-shadow: var(--box-shadow);
        border: var(--border);
        position: relative;
        .icon {
            width: 36px;
            height: 36px;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            &_filter {
                position: absolute;
                top: 20px;
                right: 20px;
                background: transparent;
                width: 24px;
                height: 24px;
                cursor: pointer;
                z-index: 10;
                i {
                    color: var(--black);
                }
            }
            i {
                color: var(--main);
                font-size: 24px;
                color: var(--white-fix);
            }
        }
        &:nth-last-of-type(1) {
            .icon {
                background: rgba(0, 132, 255, 0.3);
            }
        }
        &:nth-last-of-type(2) {
            .icon {
                background: rgba(142, 85, 234, 0.3);
            }
        }
        &:nth-last-of-type(3) {
            .icon {
                background: rgba(63, 221, 121, 0.3);
            }
        }
        &:nth-last-of-type(4) {
            .icon {
                background: rgba(252, 172, 86, 0.3);
            }
        }
        .content {
            flex: 1;
            //background: blue;
            display: flex;
            flex-direction: column;
            gap: 2px;
            h2 {
                font-size: 16px;
                font-weight: 500;
                line-height: 36px;
                color: var(--black);
                opacity: 0.8;
                text-transform: capitalize;
            }
            h3 {
                color: var(--black);
                font-size: 22px;
                font-weight: 600;
            }
            span {
                font-size: 14px;
                color: var(--black);
                opacity: 0.5;
                margin-top: auto;
                text-transform: capitalize;
            }
        }
    }
}

.chart_boxs {
    min-height: 100px;
    //background: red;
    margin-block: 20px;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;

    div {
        flex: 1 1 360px;
        background: var(--white);
        border-radius: 12px;
        box-shadow: var(--box-shadow);
        border: var(--border);
    }
}
</style>
