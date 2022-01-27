<template>
<div class="mx-auto md:h-full h-screen md:max-w-screen-lg max-w-screen-sm">
    <div v-if="loaded" class="flex flex-wrap min-h-1/2-screen h-full sm:h-auto sm:max-w-11/12 mx-auto">
        <div class="flex-grow sm:mt-0 mx-auto md:w-2/3 w-full py-8 px-8 dark:bg-black bg-white flex flex-col" :class="{'md:rounded-l-2xl': rounded, 'md:rounded-r-2xl': rounded && order.paymentCaptured}">
			<div>
				<template v-if="order.paymentCaptured">
					<div class="text-2xl md:text-3xl font-normal text-gray-800 flex">
						<span class="mr-4">Your Order Confirmation</span>
						<font-awesome :icon="['fas', 'check']" class="text-green-500 border-2 rounded-full p-1 animate-pulse h-10 w-10 my-auto"></font-awesome>
					</div>
					<p class="w-full text-md md:text-xl font-thin">Reference ID : <a class="text-blue-700" :href="orderLink">{{orderId.replace('order_', '')}}</a></p>
				</template>
				<div v-else class="flex">
					<div class="block">
						<p class="block w-full text-2xl md:text-3xl font-normal text-gray-800">Confirm Your Order</p>
						<p class="w-full text-md md:text-xl font-thin">Reference ID : <a class="text-blue-700" :href="orderLink">{{orderId.replace('order_', '')}}</a></p>
					</div>
					<button @click="edit" class="block md:text-xl items-center rounded ml-auto md:pl-4 border hover:shadow-md transition-shadow duration-200 ease-in-out">
						<span class="md:contents hidden text-lg md:font-medium text-gray-700">Edit</span>
						<font-awesome class="text-gray-500 mx-4" :icon="['fas', 'edit']"></font-awesome>
					</button>
				</div>

				<!-- Border -->
				<div class="my-6 mx-auto">
					<div class="border-t border-gray-300" />
				</div>
			</div>
            <div class="flex-grow block sm:(grid grid-cols-3)">
                <template v-for="key in orderMap.keys()">
                    <p class="capitalize text-lg font-normal col-span-1 text-gray-700 dark:text-gray-400" :key="key">
                        {{sanitize(key)}}
                    </p>
                    <div class="mb-2 md:mb-0 col-span-2 text-gray-800 dark:text-gray-
						400 text-2xl sm:(text-lg font-normal) font-light"
                        :key="orderMap.get(key)+ '_value'">
                        <input type="checkbox" v-if="typeof orderMap.get(key) === 'boolean'" class="input-checkbox"
                            :checked="orderMap.get(key)" disabled/>
                        <span v-else>{{sanitize(orderMap.get(key))}}</span>
                    </div>
                </template>
            </div>
			<!-- Border -->
			<div class="my-6 mx-auto w-full">
				<div class="border-t border-gray-300" />
			</div>
			<div v-if="order.paymentCaptured">
				<span class="text-lg italic text-dark-500">
					Thank you for your contribution.
				</span><br/>
				<span class="text-lg italic text-dark-500">
					The receipt for this transaction has been sent to 
					<span class="text-blue-700">{{order.donor.email_id}}.</span> 
				</span>
				<div class="px-12 mt-12">
					<g-image src="~/assets/images/logo.png" class="w-2/3 max-w-64 mx-auto object-fit"></g-image>
				</div>
			</div>
        </div>
        <div v-if="!order.paymentCaptured" class="md:w-1/3 w-full text-gray-300 bg-gray-700 dark:bg-gray-900 flex flex-col pb-4 p-8" :class="{'md:rounded-r-2xl': rounded}">
            <div class="flex-grow">
                <h2 class="text-white text-lg mb-1 font-medium title-font">Order Summary</h2>
                <p class="leading-relaxed mb-5">Please make sure that the details mentioned here are correct.</p>
            </div>
			<div class="grid grid-cols-2 gap-2 mr-2 mb-2 mt-12">
				<div class="text-lg col-span-1">
					<div class="inline-block align-middle">Trees:</div>
				</div>
				<div class="text-3xl font-light flex-grow text-right col-span-1">{{order.contribution.trees}}</div>
				<div class="text-lg col-span-1"> Amount: </div>
				<div class="text-3xl font-light flex-grow text-right col-span-1"> 
					<span v-if="order.contribution.currency === 'INR'">₹</span>
					<span v-if="order.contribution.currency === 'USD'">$</span>
					<span>{{order.contribution.amount/100}}</span>
				</div>
			</div>
            <!-- <div class="relative mb-4">
                Currency: {{currency}}
            </div> -->
            <button @click="collect"
                class="block w-full flex flex-row btn-action mx-auto text-white bg-green-500 dark:bg-green-600 hover:bg-green-600 duration-500"
                :class="{'bg-green-700': processing}">
                <svg v-if="processing" class="h-6 w-8 mr-2 animate animate-spin" viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" stroke-width="10px"
                        stroke-linecap='round' stroke-dasharray='170' stroke-dashoffset='120' />
                </svg>
                <span class="text-md">Proceed to Payment</span>
            </button>
            <p class="text-xs text-gray-400 text-opacity-90 mt-3">
                All payments are processed securely via Razorpay.
            </p>
        </div>
    </div>
	<div v-else>
		<svg class="mx-auto h-6 w-8 mr-2 animate animate-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle cx="50" cy="50" r="45" fill="transparent"
				stroke="currentColor" stroke-width="10px" stroke-linecap='round'
				stroke-dasharray='170' stroke-dashoffset='120'/>
		</svg>
	</div>
</div>
</template>

<script>
import Repository from "@/repository/RepositoryFactory";
const RAZORPAY_CHECKOUT_URI="https://checkout.razorpay.com/v1/checkout.js"
const SHOW_KEYS = ["email_id", "first_name", "last_name", "campaign", "trees", "amount", "currency"];

export default {
    props: {
        orderId: String,
		rounded: Boolean
    },
    data() {
		return {
			order: {},
			loaded: false,
			processing: false,
			orderLink: "#"
		}
	},
	async mounted() {
		if (this.orderId) {
			await this.loadOrder()

			let razorpayCheckout = document.createElement('script')
			razorpayCheckout.setAttribute('src', RAZORPAY_CHECKOUT_URI)
			// razorpayCheckout.async = true
			document.head.appendChild(razorpayCheckout)
			this.orderLink = window.location.origin + '/checkout/' + this.orderId
		}
	},
	computed: {
		orderMap() {
			const showMap = new Map()
			const { donor, contribution, campaign } = this.order
			showMap.set('Email ID', donor.email_id)
			showMap.set('Name', donor.first_name + ' ' + donor.last_name)
			showMap.set('Campaign', campaign)
			showMap.set('Date', new Date(contribution.date.seconds * 1000).toLocaleDateString())
			return showMap
		}
	},
	methods: {
		async loadOrder() {
			this.loaded = false
			this.order = await Repository.donation.get(this.orderId)
			this.loaded = true
		},
		sanitize: function (data) {
			if (data instanceof Array) {
				if (data.length)
					return data.reduce((res, cur) => res + ", " + this.sanitize(cur))
				else return "-"
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
				amount: this.order.contribution.amount,
				currency: this.order.contribution.currency,
				donorDetails: {
					name: this.order.donor.first_name + " " +  this.order.donor.last_name,
					email: this.order.donor.email_id, 
					contact: this.order.donor.phone
				}
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
		},
		edit: function() {
			this.$router.push({
				path: "/contribute",
				query: {
					id: this.orderId,
					mode: "edit"
				}
			})

		},
	}
}
</script>