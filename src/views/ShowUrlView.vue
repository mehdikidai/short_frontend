<script setup>
import { useAxios } from "@/api";
import Layout from "@/components/Layout.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import CardUrl from "@/components/CardUrl.vue";

const rotate = useRoute();
const rotater = useRouter();
const store = useUserStore();

const Url = ref(null);
const loaded = ref(false);

const { id } = rotate.params;

onMounted(async () => {
    try {
        const response = await useAxios(`/api/urls/${id}`, {
            ...store.configApi,
        });

        Url.value = response.data;
        loaded.value = true;
    } catch (error) {
        console.log(error.message);
    }
});
</script>
<template>
    <Layout>
        <div class="bx bx_1">
            <button @click="rotater.back()" class="back_btn">
                <Icon name="chevron_left" />
                back
            </button>
        </div>

        <div class="yy" v-if="loaded">
            <CardUrl :url="Url" />
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
                transition: transform 0.3s ease;
            }

            &:hover i {
                transform: translateX(-8px);
            }
        }
    }
}
</style>
