<script setup>
import Layout from "@/components/Layout.vue";
import Chart from "chart.js/auto";
import { ref, onMounted } from "vue";
import { useCssVar } from "@vueuse/core";

const mainColor = useCssVar("--main");
const blackColor = useCssVar("--black");

const chartA = ref(null);
const chartB = ref(null);

const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
];

const gridChart = {
    x: {
        display: true,
        grid: {
            display: false,
        },
    },
    y: {
        display: true,
        grid: {
            display: false,
        },
    },
};

onMounted(() => {
    console.log(mainColor.value);
    new Chart(chartA.value, {
        type: "line",
        data: {
            labels: data.map((row) => row.year),
            datasets: [
                {
                    label: "Acquisitions by year",
                    data: data.map((row) => row.count),
                    backgroundColor: mainColor.value,
                    borderColor: mainColor.value,
                    tension: 0.3,
                },
            ],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Custom Chart Title",
                    color: mainColor.value,
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
    new Chart(chartB.value, {
        type: "bar",
        data: {
            labels: data.map((row) => row.year),
            datasets: [
                {
                    label: "Acquisitions by year",
                    data: data.map((row) => row.count),
                    backgroundColor: "#aac9ff",
                    borderColor: "#36A2EB",
                    barPercentage: 0.2,
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
                    color: mainColor.value,
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
});
</script>

<template>
    <Layout>
        <div class="addUrl">
            <RouterLink to="/about" class="add_url">Create link</RouterLink>
            <h3>Explore technical topics and other</h3>
        </div>
        <div class="boxs">
            <div class="box">
                <div class="icon">
                    <i class="material-symbols-rounded">favorite</i>
                </div>
                <div class="content">
                    <h2>Lorem, ipsum.</h2>
                    <h3>100k</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
            <div class="box">
                <div class="icon">
                    <i class="material-symbols-rounded">sentiment_satisfied</i>
                </div>
                <div class="content">
                    <h2>Lorem, ipsum.</h2>
                    <h3>300</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
            <div class="box">
                <div class="icon">
                    <i class="material-symbols-rounded"
                        >local_fire_department</i
                    >
                </div>
                <div class="content">
                    <h2>Lorem, ipsum.</h2>
                    <h3>1500</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
            <div class="box">
                <div class="icon">
                    <i class="material-symbols-rounded">qr_code_2</i>
                </div>
                <div class="content">
                    <h2>Lorem, ipsum.</h2>
                    <h3>5500</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
        </div>
        <div class="chart_boxs">
            <div class="box_1">
                <canvas ref="chartA"></canvas>
            </div>
            <div class="box_2">
                <canvas ref="chartB"></canvas>
            </div>
        </div>
    </Layout>
</template>

<style lang="scss" scoped>
@import "./../assets/scss/_var";

.addUrl {
    min-height: 40px;
    //background: red;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    @include for-phone-only {
        & {
            flex-direction: column-reverse;
            gap: 10px;
            a.add_url {
                max-width: 100%;
                height: 40px;
                text-align: center;
                
            }
        }
    }
    a.add_url {
        padding-inline: 20px;
        background: var(--main);
        display: flex;
        align-items: center;
        border-radius: 6px;
        color: var(--white);
        font-size: 14px;
    }
    h3 {
        line-height: 40px;
        color: var(--black);
        font-weight: 500;
        font-size: 18px;
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
        .icon {
            width: 40px;
            height: 40px;
            background: var(--gray);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            i {
                color: var(--main);
                font-size: 30px;
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
            }
            h3 {
                color: var(--black);
                font-size: 22px;
                font-weight: 600;
            }
            span {
                font-size: 14px;
                color: var(--black);
                opacity: 0.3;
                margin-top: auto;
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
    }
}
</style>
