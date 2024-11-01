<template>
    <span>
        <select
            name="cars"
            id="cars"
            v-model="selectedOption"
            @change="onSelectChange"
            v-bind="$attrs"
            :disabled="disabled"
        >
            <option v-for="(item, i) in options" :key="i" :value="item">
                {{ item.replace("_", " ") }}
            </option>
        </select>
        <Icon :name="icon" />
    </span>
</template>

<script setup>

import { ref, watch } from "vue";

const emit = defineEmits(["selectedValue"]);

const props = defineProps({
    options: {
        type: Array,
    },
    value: {
        type: String,
        required: false,
        default: "",
    },
    fontSize: {
        type: String,
        required: false,
        default: "14px",
    },
    icon: {
        type: String,
        default: "tune",
    },
    disabled:{
        type:Boolean,
        default:false
    }
});

const selectedOption = ref(props.value);

watch(
    () => props.value,
    (newValue) => {
        selectedOption.value = newValue;
    }
);

const onSelectChange = () => {
    emit("selectedValue", selectedOption.value);
};
</script>

<style lang="scss" scoped>
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
        font-size: v-bind(fontSize);
        text-transform: capitalize;
        cursor: pointer;
        &:disabled{
            opacity: 0.4 !important;
        }
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
</style>
