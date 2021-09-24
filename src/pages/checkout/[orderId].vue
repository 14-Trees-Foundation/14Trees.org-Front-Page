<template>
	<Layout>
		<div class="md:m-32 mb-12 text-gray-400 dark:text-gray-600 body-font min-h-screen">
		<div v-if="loaded" class="container mx-auto flex sm:flex-nowrap flex-wrap md:rounded-2xl bg-gray-100 dark:bg-gray-800" :class="{'md:ring-2 ring-gray-300': paymentCaptured}">
			<div class="flex-grow sm:mt-0 px-4 md:px-16 pb-12 mx-auto">
				<div class="flex flex-row md:pt-16 pt-4 items-center align-middle gap-4">
					<div>
					<p class="block w-full text-2xl md:text-4xl font-thin">Confirm Your Order</p>
					<p class="w-full text-md md:text-xl font-thin">[ Reference ID : <a class="text-blue-700" :href="orderLink">{{orderId.replace('order_', '')}}</a> ]</p>
					</div>
					<svg v-if="paymentCaptured" xmlns="http://www.w3.org/2000/svg" class="animate-pulse h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
					</svg>
				</div>
				<div class="grid grid-cols-2 md:grid-cols-3 p-8 md:gap-6">
					<template v-for="(value, name) in details">
						<p class="capitalize mt-1 text-sm col-span-1" :key="name">
							{{sanitize(name)}}
						</p>
						<div class="mt-1 md:mt-0 col-span-1 md:col-span-2 text-gray-600 dark:text-gray-400" :key="name + '_value'" >
							<input type="checkbox" v-if="typeof value === 'boolean'" class="input-checkbox" :checked="value"/>
							<span v-else>{{sanitize(value)}}</span>
						</div>
					</template>
				</div>
			</div>
			<div v-if="!paymentCaptured"
				class="md:w-1/3 text-gray-300 bg-gray-700 dark:bg-gray-900 flex flex-col pb-4 pt-8 px-8 md:rounded-r-2xl">
					<div class="flex-grow">
						<h2 class="text-white text-lg mb-1 font-medium title-font">Order Summary</h2>
						<p class="leading-relaxed mb-5">Please make sure that the details mentioned here are correct.</p>
					</div>
					<div class="relative mb-4">
						Trees: {{trees}}
					</div>
					<div class="relative mb-4">
						Amount: {{amount/100}}
					</div>
					<div class="relative mb-4"> 
						Currency: {{currency}}
					</div>
					<button @click="collect"
						class="block mt-6 w-full flex flex-row btn-action mx-auto text-white bg-green-500 dark:bg-green-600 hover:bg-green-600 duration-500" 
						:class="{'bg-green-700': processing}">
						<svg v-if="processing" class="h-6 w-8 mr-2 animate animate-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
							<circle cx="50" cy="50" r="45" fill="transparent"
								stroke="currentColor" stroke-width="10px" stroke-linecap='round'
								stroke-dasharray='170' stroke-dashoffset='120'/>
						</svg>
						<span class="text-md">Proceed to Payment</span>
					</button>	
					<p class="text-xs text-gray-400 text-opacity-90 mt-3">
						All payments are processed securely via Razorpay.
					</p>
			</div>
		</div>
		</div>
			

	</Layout>
</template>

<script>
import Repository from "@/repository/RepositoryFactory";
const RAZORPAY_CHECKOUT_URI="https://checkout.razorpay.com/v1/checkout.js"

export default {
	components: {},
	metaInfo() {
		return {
			title: "Checkout"
		};
	},
	data() {
		return {
			orderId: null,
			details: {},
			trees: 0,
			paymentCaptured: true,
			loaded: false,
			processing: false,
			orderLink: "#"
		}
	},
	async mounted() {
		this.orderId = this.$route.params.orderId
		await this.loadOrder()

		let razorpayCheckout = document.createElement('script')
		razorpayCheckout.setAttribute('src', RAZORPAY_CHECKOUT_URI)
		// razorpayCheckout.async = true
		document.head.appendChild(razorpayCheckout)
		this.orderLink = window.location.href
	},
	methods: {
		async loadOrder() {
			this.loaded = false
			let orderDetails = await Repository.donation.get(this.orderId)

			const {
				first_name, last_name, phone, email_id,
				campaign, trees, names, interest,
				paymentCaptured, amount, location, currency
			} = orderDetails

			this.trees = trees
			this.paymentCaptured = paymentCaptured
			this.amount = amount
			this.currency = currency

			const name = first_name + " " + last_name
			this.details = {
				name, phone, email_id, campaign,
				names, ...interest, location
			}
			this.loaded = true
		},
		sanitize: function (data) {
			if (data instanceof Array) {
				if (data.length)
					return data.reduce((res, cur) => res + ", " + this.sanitize(cur))
			}
			if (typeof data === "string" || data instanceof String) {
				return data.split('_').join(' ')
			}
			return data
		},
		collect: async function() {
			this.processing = true
			const paymentDetails = {
				orderId: this.orderId,
				amount: this.amount,
				currency: this.currency,
				name: this.details.name,
				phone: this.details.phone,
				email_id: this.details.email_id
			}
			try {
				await Repository.donation.collectPayment( paymentDetails,
					() => { // On Success
						console.log("Payment Successful")
						this.loadOrder()
					},
					(reason) => { // On Failure
						console.log("Payment Failed", reason)
						alert(reason)
					 },
				)
			} catch(err) {
				console.error(err)
				alert("Something went wrong.")
			}
			this.processing = false
		}
	}
};
</script>