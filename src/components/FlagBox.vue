<template>
	<div class="box_flag">
		<span class="img">
			<Icon :icon="`flag:${ props.code ? props.code.toLowerCase() : 'fr' }-4x3`" />
		</span>
		<h4>{{ props.country }}</h4>
		<small> {{ Format(props.visits, '0 a') }} </small>
	</div>
</template>

<script setup>

import { Icon } from "@iconify/vue";
import { format as Format } from 'numerable';

const props = defineProps({
	country:String,
	code:String,
	visits:Number

})

</script>

<style lang="scss" scoped>
.box_flag {
	display: flex;
	flex-direction: column;
	align-items: start;
	gap: 10px;
	border: 1px solid var(--gray-2);
	padding: 20px;
	border-radius: 12px;
	position: relative;
	span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		svg {
			font-size: 20px;
			clip-path: inset(0% round 2px);
		}
	}
	h4 {
		font-size: toRem(14);
		font-weight: 500;
		color: var(--black);
		text-transform: capitalize;
	}
	small {
		font-size: toRem(18);
		font-weight: 400;
		color: var(--black);
		opacity: 0.7;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 20px;
	}
}
</style>
