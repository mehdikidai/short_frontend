<template>
  <Layout>
    <Tit text="users" icon="group" />
    <div class="box_users" v-if="loading">
      <table>
        <thead>
          <tr>
            <th class="box_img">photo</th>
            <th class="box_name">Lastname</th>
            <th class="box_action">actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="td_box_img">
              <span>
                <img :src="user.photo || defaultImg" :alt="user.name" />
              </span>
            </td>
            <td>
              <span class="span_name_email">
                <p>
                  {{ user.name }}
                  <b :class="{ admin: user.is_admin }">{{
                    user.is_admin ? "admin" : null
                  }}</b>
                </p>
                <small>{{ user.email }}</small>
              </span>
            </td>
            <td>
                <button>hh</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="paginate" v-if="lastPage > 1">
        <button class="next" @click="handelPrev" :disabled="currentPage <= 1">
          <Icon name="arrow_back" />
        </button>
        <span>{{ currentPage }}</span>
        <button class="next" @click="handelNext" :disabled="currentPage >= lastPage">
          <Icon name="arrow_forward" />
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>

import Layout from "@/components/Layout.vue";
import Icon from "@/components/Icon.vue";
import Tit from "@/components/Tit.vue";

import { useUserStore } from "@/stores/user";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAxios } from "@/api";

const storeUser = useUserStore();
const router = useRouter();
const loading = ref(true);

const defaultImg = ref("https://avatar.iran.liara.run/public");

// users section

const users = ref([]);

const currentPage = ref(1);

const lastPage = ref(1);

// end users section

const getUsers = async () => {
  try {
    const res = await useAxios.get(`/api/users?page=${currentPage.value}`, {
      ...storeUser.configApi,
    });

    console.log(res.data);

    const { data , last_page } = res.data

    users.value = data;
    lastPage.value = last_page;

    loading.value = true;

  } catch (err) {

    router.push({ name: "home" });

  }
};

watch(
  currentPage,
  () => {
    getUsers();
    console.log(lastPage.value);
  },
  { immediate: true }
);

const handelPrev = () => {
  if (currentPage.value <= 1) {
    return;
  }
  currentPage.value--;
};

const handelNext = () => {

  if (currentPage.value >= lastPage.value) {
    return;
  }

  currentPage.value++;

};
</script>

<style lang="scss" scoped>
@import "./../assets/scss/var";

table {
  width: 100%;
  border-collapse: collapse;
  font-size: toRem(16);
  border: none;
  table-layout: auto;
  .box_img {
    width: 80px;
  }
  th,
  td {
    height: 60px;
    padding-inline: 15px;
    font-size: toRem(14);
    color: var(--black);
    border-bottom: 1px solid var(--border-color);
    text-transform: capitalize;
    text-align: start;
  }
  th {
    &.box_name {
      width: auto;
    }
    &.box_action{
        //background: red;
        width: 60px;
    }
  }
  td {
    &.td_box_img {
      position: relative;
      padding: 0;
      span {
        width: 40px;
        height: 40px;
        background: transparent;
        display: flex;
        position: absolute;
        inset: 50%;
        transform: translate(-50%, -50%);
        clip-path: circle();
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
    span {
      display: block;
      &.span_name_email {
        //background: blue;
        p {
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
          b {
            opacity: 0.8;
            &.admin {
              color: #2a9d8f;
            }
          }
        }
        small {
          opacity: 0.5;
        }
      }
    }

  }
}

.paginate {
  margin-block: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  button {
    cursor: pointer;
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--white);
    border: none;
    color: var(--black);
    border-radius: 4px;
    transform: scale(1);
    transition: all 0.3s ease-in-out;
    &:active {
      transform: scale(0.8);
    }
    &:disabled{
        opacity: 0.2;
        pointer-events: none;
    }
    i {
      font-size: toRem(18);
    }

  }
  span {
    background: transparent;
    display: flex;
    width: 50px;
    align-items: center;
    justify-content: center;
    font-size: toRem(14);
    height: 32px;
    color: var(--black);
    opacity: 0.7;
    user-select: none;
  }
}
</style>
