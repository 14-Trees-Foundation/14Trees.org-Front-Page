<template>
	<Layout>
		<div class="container text-gray-400 dark:text-gray-600 body-font min-w-screen dark:bg-gray-800 mx-auto h-full">
			<order-summary class="h-full sm:shadow-xl sm:border mx-auto sm:m-6 lg:m-24 min-h-1/2-screen" v-if="orderId" :orderId="orderId" />
		</div>
	</Layout>
</template>

<script>
import OrderSummary from '../../components/Partials/OrderSummary.vue';

export default {
	components: {
		OrderSummary
	},
	data() {
		return  {
			orderId: null
		}
	},
	metaInfo() {
		return {
			title: "Checkout"
		};
	},
	mounted() {
		this.orderId = this.$route.params.orderId
	},
};
</script>