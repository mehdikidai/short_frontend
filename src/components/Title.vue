<template>
    <div :class="['addUrl']">
        <RouterLink
            :to="{ name: 'createLink' }"
            class="add_url"
            >{{ $t("pages.Create_link") }}</RouterLink
        >
        <h3>{{ tit }}</h3>
    </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
    tit: {
        type: String,
        required: true,
    },
});
</script>

<style lang="scss" scoped>


.addUrl {
    min-height: 36px;
    //background: red;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    &.onlyTitle {
        flex-direction: row;
    }
    @include phone {
        & {
            flex-direction: column-reverse;
            gap: 10px;
            a.add_url {
                max-width: 100%;
                height: 36px;
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
        color: var(--white-fix);
        font-size: 14px;
        text-transform: capitalize;
    }
    h3 {
        line-height: 36px;
        color: var(--black);
        font-weight: 500;
        font-size: 18px;
        text-transform: capitalize;
    }
}
</style>
