<script setup>
import { useAxios } from "@/api";
import Layout from "@/components/Layout.vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import CardUrl from "@/components/CardUrl.vue";
import { getColorBrowser, calculatePercentage } from "@/helper";
import Chart from "chart.js/auto";
import { format } from "numerable";
import { useDark } from "@vueuse/core";

const rotate = useRoute();
const rotater = useRouter();
const store = useUserStore();

const Url = ref(null);
const loaded = ref(false);

const ID = ref(rotate.params.id);

const clicks = ref([]);

const browsers = ref([]);

const clicksCount = ref(0);

const isDark = useDark();

const devices = ref(
  Array(3).fill({
    device: "-",
    total: 0,
  })
);

const chartBrowsers = ref(null);

const chartVisits = ref(null);

watch(
  ID,
  async () => {
    try {
      const response = await useAxios(`/api/urls/${ID.value}`, {
        ...store.configApi,
      });

      Url.value = response.data;

      clicks.value = response.data.clicks;

      browsers.value = response.data.top_browsers;

      clicksCount.value = response.data.clicks_count;

      devices.value = [...response.data.top_devices, ...devices.value]
        .slice(0, 3)
        .reverse();

      loaded.value = true;

      //console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  },
  { immediate: true }
);

watch(browsers, () => {
  new Chart(chartBrowsers.value, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: browsers.value.map((el) => el.total),
          backgroundColor: browsers.value.map((el) =>
            getColorBrowser(el.browser)
          ),
          hoverOffset: 0,
          spacing: 4,
        },
      ],
    },
    options: {
      borderWidth: 0,
      borderRadius: 4,
      weight: 2,
      cutout: "90%",
      hover: {
        mode: null,
      },
    },
  });
});

const optionsChart = {
  responsive: true,
  maintainAspectRatio: false,
  borderRadius: 0,
  plugins: {
    legend: {
      display: false,
    },
  },
  indexAxis: "y",
  scales: {
    x: {
      grid: {
        display: true,
        color: "rgba(255, 255, 255, 0.03)",
      },
      ticks: {
        beginAtZero: true,
        font: {
          size: 14,
        },
        color: "#777",
      },
      border: {
        color: "#0000",
      },
    },
    y: {
      grid: {
        display: true,
        color: "rgba(255, 255, 255, 0.03)",
      },
      ticks: {
        beginAtZero: true,
        font: {
          size: 16,
        },
        color: "#777",
      },
      border: {
        color: "#0000",
      },
    },
  },
  barThickness: 10,
  maxBarThickness: 15,
};

watch(devices, () => {
  new Chart(chartVisits.value, {
    type: "bar",
    data: {
      labels: devices.value.map((el) => el.device),
      datasets: [
        {
          label: null,
          data: devices.value.map((el) => el.total),
          fill: false,
          backgroundColor: ["#ff7421", "#0076e1", "#e76f51"],
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: optionsChart,
  });
});

watch(isDark, (c) => {
  console.log(c);
});
</script>
<template>
  <Layout>
    <div class="bx bx_1">
      <button @click="rotater.back()" class="back_btn" v-kidai>
        <Icon name="keyboard_backspace" />
        back
      </button>
    </div>

    <div class="card" v-if="loaded" v-kidai>
      <CardUrl :url="Url" :showBtnDelete="false" />
    </div>

    <div class="boxs" v-kidai>
      <div class="box box_1">
        <h2>Most Browsers</h2>
        <canvas ref="chartBrowsers"></canvas>
        <div class="el">
          <ul>
            <li v-for="(el, i) in browsers" :key="i">
              <Icon name="dialogs" :color="getColorBrowser(el.browser)" />
              {{ el.browser }}
              <small>
                {{ `${calculatePercentage(el.total, browsers)}%` }}
              </small>
            </li>
          </ul>
        </div>
      </div>

      <div class="box box_2">
        <h2>Most devices</h2>
        <canvas ref="chartVisits"></canvas>
      </div>

      <div class="box box_3">
        <h2>Number of visits</h2>
        <h3>{{ format(clicksCount, "0 a") }}</h3>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" scoped>
.bx {
  margin-bottom: 20px;
  &_1 {
    .back_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px 16px;
      background-color: var(--white);
      border: none;
      border-radius: 4px;
      font-size: 14px;
      border: var(--border);
      cursor: pointer;
      color: var(--black);
      text-transform: capitalize;
      i {
        font-size: 18px;
        transform: translateX(-4px);
        color: var(--black);
        transition: transform 0.3s ease;
      }

      &:hover i {
        transform: translateX(-8px);
      }
    }
  }
}

.card {
  margin-bottom: 20px;
}

.boxs {
  display: flex;
  gap: 20px;
  align-items: stretch;
  flex-wrap: wrap;
  .box {
    background: var(--white);
    padding: 30px 20px;
    border-radius: 12px;
    box-shadow: var(--box-shadow);
    border: var(--border);
    h2 {
      font-size: 16px;
      font-weight: 500;
      color: var(--black);
      opacity: 0.7;
      text-transform: capitalize;
    }

    .el {
      //width: 150px;
      //background: red;
      display: flex;
      justify-content: stretch;
      flex-wrap: wrap;
      ul {
        display: flex;
        flex-direction: column;
        width: 100%;
        li {
          all: unset;
          height: 32px;
          line-height: 32px;
          color: var(--black);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          text-transform: capitalize;
          i {
            font-size: 20px;
          }

          small {
            color: var(--black);
            margin-left: auto;
            opacity: 0.7;
          }
        }
      }
    }

    &_1 {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 20px;

      canvas {
        width: 200px !important;
        height: 200px !important;
      }
    }
    &_2 {
      flex: 2 1 500px;
      display: flex;
      gap: 20px;
      flex-direction: column;

      canvas {
        height: 300px !important;
        width: 100% !important;
      }
    }
    &_3 {
      flex: 1 1 400px;
      display: flex;
      gap: 20px;
      flex-direction: column;
      height: 160px;
      h3 {
        font-size: 30px;
        color: var(--black);
      }
    }
  }
}
</style>
