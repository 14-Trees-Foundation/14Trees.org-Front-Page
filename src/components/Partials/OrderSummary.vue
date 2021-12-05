<template>
    <div v-if="loaded" class="flex flex-wrap">
        <div class="flex-grow sm:mt-0 mx-auto md:w-2/3 w-full py-8 px-8 dark:bg-black bg-white flex flex-col" :class="{'md:rounded-l-2xl': rounded, 'md:rounded-r-2xl': rounded && paymentCaptured}">
			<div class="">
				<template v-if="paymentCaptured">
					<div class="text-2xl md:text-3xl font-normal text-gray-800 flex">
						<span class="mr-4">Your Order Confirmation</span>
						<font-awesome :icon="['fas', 'check']" class="text-green-500 border-2 rounded-full p-1 animate-pulse h-10 w-10 my-auto"></font-awesome>
						<!-- <svg  xmlns="http://www.w3.org/2000/svg" class=" text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
						</svg> -->
					</div>
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
				<div class="py-6 mx-auto">
					<div class="border-t border-gray-300" />
				</div>
			</div>
            <div class="flex-grow grid grid-cols-2 md:grid-cols-3 md:gap-2">
                <template v-for="(value, name) in details">
                    <p class="capitalize text-md font-normal col-span-1 text-gray-700 dark:text-gray-400" :key="name">
                        {{sanitize(name)}}
                    </p>
                    <div class="mt-1 md:mt-0 col-span-1 md:col-span-2 text-gray-800 dark:text-gray-400 text-lg"
                        :key="name + '_value'">
                        <input type="checkbox" v-if="typeof value === 'boolean'" class="input-checkbox"
                            :checked="value" disabled/>
                        <span v-else>{{sanitize(value)}}</span>
                    </div>
                </template>
            </div>
        </div>
        <div v-if="!paymentCaptured" class="md:w-1/3 w-full text-gray-300 bg-gray-700 dark:bg-gray-900 flex flex-col pb-4 p-8" :class="{'md:rounded-r-2xl': rounded}">
            <div class="flex-grow">
                <h2 class="text-white text-lg mb-1 font-medium title-font">Order Summary</h2>
                <p class="leading-relaxed mb-5">Please make sure that the details mentioned here are correct.</p>
            </div>
			<div class="grid grid-cols-2 gap-2 mr-2 mb-2 mt-12">
				<div class="text-lg col-span-1">
					<div class="inline-block align-middle">Trees:</div>
				</div>
				<div class="text-3xl font-light flex-grow text-right col-span-1">{{trees}}</div>
				<div class="text-lg col-span-1"> Amount: </div>
				<div class="text-3xl font-light flex-grow text-right col-span-1"> 
					<span v-if="currency === 'INR'">₹</span>
					<span v-if="currency === 'USD'">$</span>
					<span>{{amount/100}}</span>
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
</template>

<script>
import Repository from "@/repository/RepositoryFactory";
const RAZORPAY_CHECKOUT_URI="https://checkout.razorpay.com/v1/checkout.js"

export default {
    props: {
        orderId: String,
		rounded: Boolean
    },
    data() {
		return {
			details: {},
			trees: 0,
			paymentCaptured: true,
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
			console.log(this.orderLink)
		}
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
		},
		edit: function() {
			this.$router.push({
				name: 'donation-edit',
				params: {
					id: this.orderId
				}
			})

		}
	}
}
</script>