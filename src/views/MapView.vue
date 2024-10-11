<template>
    <Layout>
        <Tit text="maps" icon="map" />
        <div class="box_map">
            <SelectBox
                :options="listFilter"
                :value="filter"
                @selectedValue="handelFilter"
                class="btn_filter"
                fontSize="12px"
            />
            <div class="app" ref="MapRef"></div>
            <div class="btns_zoom">
                <button :disabled="CurrentZoom == 8" @click="zoomIn">+</button>
                <button :disabled="CurrentZoom == 3" @click="zoomOut">-</button>
            </div>
        </div>
    </Layout>
</template>

<script setup>
import Layout from "@/components/Layout.vue";
import Tit from "@/components/Tit.vue";
import { ref, watch, onMounted } from "vue";
import marker from "@/assets/imgs/marker.png";
import { useAxios } from "@/api";
import { useUserStore } from "@/stores/user";
import { z } from "zod";
import SelectBox from "@/components/SelectBox .vue";
import { useDark } from "@vueuse/core";

const waterColor = ref("#1a1d1f");
const colorMap = ref("#33393c");

const isDark = useDark();

watch(
    isDark,
    () => {
        waterColor.value = isDark.value ? "#1a1d1f" : "#ffffff";
        colorMap.value = isDark.value ? "#33393c" : "#dee0e0";
    },
    { immediate: true }
);

//--------------------------------------------------------------------------

const filter = ref("last_day");

const listFilter = ref([
    "last_day",
    "last_week",
    "last_month",
    "last_year",
    "all",
]);

const FilterEnum = z.enum(listFilter.value);

//--------------------------------------------------------------------------

const MapRef = ref(null);

const Data = ref([]);
const store = useUserStore();

let map;

const CurrentZoom = ref(4);

const initMap = () => {
    const mapOptions = {
        center: { lat: 34.25550069368564, lng: -6.596731436241026 },
        zoom: 4,
        minZoom: 3,
        maxZoom: 8, 
        zoomControl: false, 
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false, 

        styles: [
            {
                featureType: "all",
                elementType: "labels",
                stylers: [
                    {
                        visibility: "off", // إخفاء جميع التسميات
                    },
                ],
            },
            {
                featureType: "all",
                elementType: "geometry",
                stylers: [
                    {
                        //color: "#282c2f", // لون الخلفية
                        color: colorMap.value, // لون الخلفية
                    },
                ],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [
                    {
                        color: waterColor.value, // لون المسطحات المائية
                    },
                ],
            },

            {
                featureType: "landscape",
                elementType: "labels",
                stylers: [
                    {
                        visibility: "off", // إخفاء أسماء الجزر
                    },
                ],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                    {
                        visibility: "off",
                    },
                ],
            },
            {
                featureType: "administrative.locality",
                elementType: "labels",
                stylers: [
                    {
                        visibility: "off", // إخفاء أسماء المدن
                    },
                ],
            },
            {
                featureType: "administrative",
                elementType: "labels",
                stylers: [
                    {
                        visibility: "off", // إخفاء أسماء الحدود الإدارية الأخرى
                    },
                ],
            },
        ],
    };

    map = new google.maps.Map(MapRef.value, mapOptions);

    

    Data.value.forEach((location) => {
        new google.maps.Marker({
            position: { lat: location.lat, lng: location.lon },
            map: map,
            title: location.city ?? "city name",
            icon: {
                url: marker,
                scaledSize: new google.maps.Size(20, 20),
            },
        });

       
    });
};

watch(
    [filter, isDark],
    async () => {
        const { success } = FilterEnum.safeParse(filter.value);

        if (success) {
            try {
                const response = await useAxios(
                    `/api/locations/${filter.value}`,
                    {
                        ...store.configApi,
                    }
                );

                Data.value = response.data;

                console.log(response.data);
            } catch (error) {}

            initMap();
        }
    },
    { immediate: true }
);


const zoomIn = () => {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom + 1);
    console.log(currentZoom);
    CurrentZoom.value = currentZoom;
};


const zoomOut = () => {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom - 1);
    console.log(currentZoom);
    CurrentZoom.value = currentZoom;
};

const handelFilter = (v) => {
    console.log(v);
    filter.value = v;
};
</script>

<style lang="scss" scoped>
.box_map {
    background: var(--white);
    margin-bottom: 20px;
    border-radius: 12px;
    overflow: hidden;
    border: var(--border);
    position: relative;
    height: 478px;

    .btns_zoom {
        position: absolute;
        //background: red;
        z-index: 5;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 6px;
        button {
            width: 28px;
            height: 28px;
            cursor: pointer;
            border: none;
            background: var(--white);
            color: var(--black);
            border: var(--border);
            border-radius: 4px;
            &[disabled] {
                opacity: 0.2;
            }
        }
    }

    .btn_filter {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 4;
    }

    .app {
        height: 500px;
        clip-path: inset(6px 6px 30px round 6px);
        position: relative;
    }

    .gmnoprint {
        display: none !important;
    }
}
</style>
