<script setup>
import Layout from "@/components/Layout.vue";
import Chart from "chart.js/auto";
import { ref, onMounted } from "vue";
import { useCssVar } from "@vueuse/core";
import Title from "@/components/Title.vue";
import swal from "sweetalert";

const mainColor = useCssVar("--main");

const chartA = ref(null);
const chartB = ref(null);

const data = [
    { year: 10, count: 10 },
    { year: 11, count: 20 },
    { year: 12, count: 15 },
    { year: 13, count: 22 },
    { year: 14, count: 12 },
    { year: 14, count: 14 },
];

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
                    backgroundColor: "#3fdd78",
                    borderColor: "#3fdd78", // mainColor.value
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
    new Chart(chartB.value, {
        type: "bar",
        data: {
            labels: data.map((row) => row.year),
            datasets: [
                {
                    label: "Acquisitions by year",
                    data: data.map((row) => row.count),
                    backgroundColor: "#fcac56",
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
});
</script>

<template>
    <Layout>
        <Title tit="welcome back" />
        <div class="boxs">
            <div class="box">
                <div class="icon">
                    <icon name="favorite" />
                </div>
                <div class="content">
                    <h2>Lorem, ipsum.</h2>
                    <h3>100k</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
            <div class="box">
                <div class="icon">
                    <icon name="sentiment_satisfied" />
                </div>
                <div class="content">
                    <h2>Lorem, ipsum.</h2>
                    <h3>300</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
            <div class="box">
                <div class="icon">
                    <icon name="qr_code_2" />
                </div>
                <div class="content">
                    <h2>Lorem, ipsum.</h2>
                    <h3>5500</h3>
                    <span>Lorem ipsum dolor sit.</span>
                </div>
            </div>
            <div class="box">
                <div class="icon">
                    <icon name="qr_code_2" />
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
        .icon {
            width: 36px;
            height: 36px;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            i {
                color: var(--main);
                font-size: 24px;
                color: var(--white-fix);
            }
        }
        &:nth-last-of-type(1) {
            .icon {
                background: #0084ff;
            }
        }
        &:nth-last-of-type(2) {
            
            .icon {
                background: #8e55ea;
            }
        }
        &:nth-last-of-type(3) {
            .icon {
                background: #3fdd78;
            }
            
        }
        &:nth-last-of-type(4) {
            
            .icon {
                background: #fcac56;
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
