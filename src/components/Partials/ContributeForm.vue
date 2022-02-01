<template>
	<div v-if="loaded">
		<div v-if="contribution_type != 'foreign'" class="md:mb-24 mb-4">
			<ProgressCheckPoints :keys="['Select Type', 'Contribution', 'Information', 'Communication', 'Payment']" :activeIndex="form_stage"/>
		</div>

		<div v-show="!contribution_type">
			<contribution-type v-on:select="selectType"/>
		</div>

		<div v-show="contribution_type">
 		<ClientOnly>
			<form action="#" method="POST" id="pledgeForm" @submit="checkAndSubmitForm" class="mt-10 md:ml-12 md:mb-32 mb-12">
			<div v-if="message" class="max-w-screen-sm mx-auto">
				<div class="my-12 relative px-4 py-3 leading-normal text-gray-700 bg-gray-300 rounded-lg" role="alert">
					<span class="absolute inset-y-0 left-0 flex items-center mx-4">
						<font-awesome :icon="['fas', 'exclamation-triangle']" class="text-gray-500" />
					</span>
					<p class="ml-8" v-html="message">
					</p>
				</div>
			</div>
			<div v-if="contribution_type === 'foreign'" class="max-w-screen-sm mx-auto">
				<label for="first_name" class="block text-sm font-medium text-gray-700">Campaign</label>
				<select v-model="formData.contribution.campaign" required class="input-field">
					<option v-for="(c,i) in campaigns" :key="i" :value="c.title">{{c.name}}
					</option>
				</select>
				<div class="border rounded-md mt-2" v-if="selectedCampaign && selectedCampaign.description">
					<p class="text-gray-600 text-sm font-light p-4">{{selectedCampaign.description}}</p>
				</div>
				<!-- <div class="my-4 h-56 md:h-96 w-full border border-gray-300"> <div class="text-center mt-25 md:mt-48">IMAGE here?</div> </div> -->
			</div>
			<div v-else>
				<div id="contribution" class=" h-full transition-height duration-500 ease-in-out">
					<!-- ******************************************************** -->
					<!-- ****************** Contribution ************************-->
					<!-- ******************************************************** -->
					<div class="mt-6 sm:mt-0" v-if="contributionExpand">
						<div class="md:grid md:grid-cols-3 md:gap-6">
							<div class="md:col-span-1">
								<div class="px-4 sm:px-0">
									<h3 class="text-lg font-medium leading-6 text-gray-900">Contribution</h3>
									<p class="mt-1 text-sm text-gray-600">
										Start your journey towards planting 14 Trees for the environment
									</p>
								</div>
							</div>
							<div class="mt-5 md:mt-0 col-span-2 lg:col-span-1">
								<div class="shadow overflow-hidden sm:rounded-md">
									<div class="px-4 py-3 bg-white dark:bg-dark-grey sm:p-3">
										<div class="grid grid-cols-4 gap-6">
											<div class="col-span-4">
												<label for="first_name" class="block text-sm font-medium text-gray-700">Campaign</label>
												<select v-model="formData.contribution.campaign" required class="input-field">
													<option v-for="(c,i) in campaigns" :key="i" :value="c.title">{{c.name}}
													</option>
												</select>
														<div class="border rounded-md mt-2" v-if="selectedCampaign && selectedCampaign.description">
															<p class="text-gray-600 text-sm font-light p-4">{{selectedCampaign.description}}</p>
														</div>
											</div>
											<div class="col-span-4" v-if="contribution_type==='india'">
												<label for="last_name" class="block text-sm font-medium text-gray-700">Number of Trees</label>
												<div v-if="orderId == null" class="flex flex-row w-full h-11 border-gray-300 border rounded">
													<button type="button" @click="formData.contribution.trees--" class="mr-0.5 border-r transition-colors duration-200 ease-in-out flex-grow bg-gray-100 text-gray-600  hover:bg-red-300 h-full rounded-l cursor-pointer  focus:outline-none">
														<span class="m-auto text-2xl font-thin">−</span>
													</button>
													<input type="number" :disabled="orderId !== null" v-model.number="formData.contribution.trees" min="1" class="w-2/3 flex-grow appearance-none input-field border-none rounded-none"/>
													<button type="button" @click="formData.contribution.trees++" class="ml-1 border-l transition-colors duration-200 ease-in-out flex-grow bg-gray-100 text-gray-600  hover:bg-green-400 h-full rounded-r cursor-pointer focus:outline-none">
														<span class="m-auto text-2xl font-thin">+</span>
													</button>
												</div>
													<span v-else class="input-field text-gray-500 inline-flex items-center">
														<span class="pl-1 pr-4 border-r"> {{formData.contribution.trees}} </span>
														<font-awesome class="text-gray-300 mx-4" :icon="['fas', 'lock']"></font-awesome>
														<span class="text-xs text-gray-400"> Please make a separate contribution to edit this field</span>
													</span>
													<div class="text-xl text-right mt-2"> 
														<span class="text-sm font-light">Contribution Amount: </span>₹ {{3000*formData.contribution.trees}}
													</div>
											</div>
		
													<!-- Names to add -->
											<!-- <div v-if="trees > 0" class="col-span-4">
												<label for="name-add" class="block text-sm font-medium text-gray-700">Add upto {{trees}} names</label>
												<div class="flex flex-row w-full h-11 border-gray-300 border rounded">
													<input type="text" v-model="addName" name="name-add" id="name-add" autocomplete="off" class="input-field flex-grow max-w-2/3 border-none rounded-none rounded-l"/>
													<button :disabled="names.length >= trees" type="button" @click="addCurrentName()" class="ml-0.5 border-l rounded-r transition-colors duration-200 ease-in-out bg-gray-100 text-gray-600  hover:bg-green-400 h-full cursor-pointer focus:outline-none">
														<span class="mx-4 text-md font-thin">Add</span>
													</button>
												</div>
														<table v-if="names.length" class="bg-gray-50 dark:bg-gray-800 shadow-md w-full grid grid-cols-1 divide-y divide-gray-200 dark:divide-black px-4 py-1 mt-1">
															<tr v-for="(n,i) in names" :key="i">
																<td class="flex flex-row items-center py-2 w-full">
																	<span class="h-full w-full flex-grow text-sm font-medium text-gray-500 align-center align-text-bottom">{{names[i]}}</span>
																	<button type="button" @click="names.splice(i, 1)" class="block ml-4 w-5 h-5 hover:bg-gray-300 rounded-md transition-colors duration-200 ease-in-out">
																		<svg xmlns="http://www.w3.org/2000/svg" class="fill-current text-gray-500" viewBox="0 0 20 20">
																			<path fill-rule="evenodd"
																				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
																				clip-rule="evenodd"/>
																		</svg></button>
																</td>
															</tr>
														</table>
											</div> -->
		
													<!-- Campaign Questions here -->
													<!-- {{ campaignQuestions }} -->
													<div v-if="campaignQuestions" class="col-span-4">
														<FormulateForm class="col-span-4" v-model="values" :schema="campaignQuestions"/>
													</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="md:grid md:grid-cols-3 md:gap-6">
							<div class="md:col-span-1">
								<div class="px-4 sm:px-0">
									<p class="text-sm text-gray-600 mt-6">
										Besides making a monetary contribution, I am also interested in these opportunities. 
									</p>
								</div>
							</div>
							<div class="md:col-span-2">
								<div class="shadow overflow-hidden sm:rounded-md">
									<div class="px-4 py-3 bg-white dark:bg-dark-grey space-y-6 sm:p-3">
										<fieldset>
											<div class="mt-4 space-y-4">
												<div class="flex items-start">
													<div class="flex items-center h-5">
														<input id="visit" name="visit" v-model="formData.donor.interest.visit" type="checkbox" class="input-checkbox" />
													</div>
													<div class="ml-3 text-sm">
														<label for="visit" class="font-medium text-gray-700">
															Site Visit</label>
														<p class="text-gray-500">Plan a visit to the project site and
															plant trees by my own hands</p>
													</div>
												</div>
												<div class="flex items-start">
													<div class="flex items-center h-5">
														<input id="csr" name="csr" v-model="formData.donor.interest.csr" type="checkbox" class="input-checkbox"/>
													</div>
													<div class="ml-3 text-sm">
														<label for="csr" class="font-medium text-gray-700">CSR
															Contributions</label>
														<p class="text-gray-500">Explore future possibilities of CSR
															contribution through my company or my
															employer</p>
													</div>
												</div>
												<div class="flex items-start">
													<div class="flex items-center h-5">
														<input id="volunteer" name="volunteer" v-model="formData.donor.interest.volunteer"
															type="checkbox" class="input-checkbox"/>
													</div>
													<div class="ml-3 text-sm">
														<label for="candidates"
															class="font-medium text-gray-700">Volunteer</label>
														<p class="text-gray-500">Volunteer my time, energy and
															expertise to grow this initiative
															further</p>
													</div>
												</div>
											</div>
										</fieldset>
									</div>
								</div>
							</div>
						</div>
						<button v-if="personal_infoExpand == false" class="focus:outline-none block w-24 h-12 mx-auto rounded-full" @click="checkSection">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-bounce mx-auto" fill="none"
								viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
							</svg>
						</button>
					</div>
					<div v-else @click="contributionExpand = true" class=" hover:bg-gray-50 transition-colors duration-500 
					text-2xl font-extralight text-gray-800 dark:text-gray-400 pl-4 py-4 rounded-lg">
						Your Contribution
					</div>
					<!-- Border -->
					<div class="hidden sm:block" aria-hidden="true">
						<div class="py-4 mx-auto">
							<div class="border-t border-gray-200" />
						</div>
					</div>
				</div>
				<div id="personal_info" class="transition-height">
					<!-- ******************************************************** -->
					<!-- ***************** Personal Info ************************ -->
					<!-- ******************************************************** -->
					<div class="mt-10 sm:mt-0" v-if="personal_infoExpand">
						<div class="md:grid md:grid-cols-3 md:gap-6">
							<div class="md:col-span-1">
								<div class="px-4 sm:px-0">
									<h3 class="text-lg font-medium leading-6 text-gray-900">Contact Information</h3>
									<p class="mt-1 text-sm text-gray-600">
										Choose an email address where you would like to receive correspondence.
										<br/>
										Indian taxpayers must submit their PAN details for income tax deductions.
									</p>
								</div>
							</div>
							<div class="mt-5 md:mt-0 md:col-span-2">
								<div class="shadow overflow-hidden sm:rounded-md">
									<div class="px-4 py-3 bg-white dark:bg-dark-grey sm:p-3">
										<div class="grid grid-cols-6 gap-6">
											<input-wrapper placeholder="First Name" class="col-span-6 sm:col-span-3" type="text" v-model="formData.donor.first_name" 
											name="first_name" required id="first_name" autocomplete="given-name"/>
											<input-wrapper class="col-span-6 sm:col-span-3" type="text" v-model="formData.donor.last_name"
											name="last_name" id="last_name" autocomplete="family-name" placeholder="Last Name" required/>
											<input-wrapper class="col-span-6 sm:col-span-3" v-model="formData.donor.email_id" 
											name="email_address" type="email" id="email_address" placeholder="Email address" required />
											<input-wrapper class="col-span-6 sm:col-span-3" v-model="formData.donor.pan" 
											name="pan" type="text" id="pan" placeholder="PAN Number" />
											<input-wrapper placeholder="Phone Number" class="col-span-6 sm:col-span-3" type="tel" v-model.number="formData.donor.phone"
											name="phone_number" id="phone_number" autocomplete="tel" required min="999999999" max="9999999999" />
											<div class="col-span-6 sm:col-span-3">
												<label for="country"
													class="block text-sm font-medium text-gray-700">Country/Currency</label>
												<select id="country" v-model="formData.contribution.currency" name="country" autocomplete="country" class="input-field">
													<option v-for="c in currencies" :value="c.value" :key="c.value" :selected="c.value === formData.contribution.currency">
																{{c.label}} {{c.value}}
															</option>
												</select>
											</div>
											<!-- Street Addreess -->
													<!-- <div class="col-span-6">
														<label for="street_address" class="block text-sm font-medium text-gray-700">Street address</label>
														<input type="text" name="street_address" id="street_address" autocomplete="street-address" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
														</div>
		
														<div class="col-span-6 sm:col-span-6 lg:col-span-2">
														<label for="city" class="block text-sm font-medium text-gray-700">City</label>
														<input type="text" name="city" id="city" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
														</div>
		
														<div class="col-span-6 sm:col-span-3 lg:col-span-2">
														<label for="state" class="block text-sm font-medium text-gray-700">State / Province</label>
														<input type="text" name="state" id="state" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
														</div>
		
														<div class="col-span-6 sm:col-span-3 lg:col-span-2">
														<label for="postal_code" class="block text-sm font-medium text-gray-700">ZIP / Postal</label>
														<input type="text" name="postal_code" id="postal_code" autocomplete="postal-code" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
													</div> -->
										</div>
									</div>
								</div>
							</div>
						</div>
						<button v-if="communicationExpand == false" class="block w-24 h-12 mx-auto rounded-full" @click="checkSection">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-bounce mx-auto" fill="none"
								viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
							</svg>
						</button>
					</div>
					<div v-else @click="personal_infoExpand = true" class=" hover:bg-gray-50 transition-colors duration-500 
					text-2xl font-extralight text-gray-800 dark:text-gray-400 pl-4 py-4 rounded-lg">
						Personal Info
					</div>
					<!-- Border -->
					<div class="hidden sm:block" aria-hidden="true">
						<div class="py-4 mx-auto">
							<div class="border-t border-gray-200" />
						</div>
					</div>
				</div>
				<div id="communication" class="transition-height">
					<!-- ******************************************************** -->
					<!-- ****************** Communication ************************-->
					<!-- ******************************************************** -->
					<div class="my-10" v-if="communicationExpand">
						<div class="md:grid md:grid-cols-3 md:gap-6">
							<div class="md:col-span-1">
								<div class="px-4 sm:px-0">
									<h3 class="text-lg font-medium leading-6 text-gray-900">Communication</h3>
									<p class="mt-1 text-sm text-gray-600">
										Decide which communications you'd like to receive and how.
										<br/>
										14 Trees Foundation does not share your personal information with any third parties.
									</p>
								</div>
							</div>
							<div class="md:col-span-2">
								<div class="shadow overflow-hidden sm:rounded-md">
									<div class="px-4 bg-white dark:bg-dark-grey space-y-6 sm:p-3">
										<fieldset>
											<div class="mt-4 space-y-4">
												<div class="flex items-start">
													<div class="flex items-center h-5">
														<input id="updates" name="updates" v-model="formData.donor.notifications.updates"
															type="checkbox" class="input-checkbox" />
													</div>
													<div class="ml-3 text-sm">
														<label for="comments" class="font-medium text-gray-700">14
															Trees Milestones</label>
														<p class="text-gray-500">Receive updates on the 14
															Trees Foundation's progress in your Inbox (once a quarter)</p>
													</div>
												</div>
												<div class="flex items-start">
													<div class="flex items-center h-5">
														<input id="newsletter" name="newsletter" v-model="formData.donor.notifications.newsletter"
															type="checkbox" class="input-checkbox" />
													</div>
													<div class="ml-3 text-sm">
														<label for="candidates"
															class="font-medium text-gray-700">Newsletter</label>
														<p class="text-gray-500">Subscribe to our newsletter for frequent updates and more contribution opportunities.</p>
													</div>
												</div>
											</div>
										</fieldset>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div v-else @click="communicationExpand = true" class=" hover:bg-gray-50 transition-colors duration-500 
					text-2xl font-extralight text-gray-800 dark:text-gray-400 pl-4 py-4 rounded-lg">
						Communication
					</div>
				</div>

			<!-- Border -->
			<div class="hidden sm:block" aria-hidden="true">
					<div class="py-4 mx-auto">
						<div class="border-t border-gray-200" />
					</div>
			</div>

			</div>
				<!-- Contribute Button -->
			<button type="submit" class="my-10 flex flex-row btn-action mx-auto text-white w-full md:w-72
								bg-green-500 dark:bg-green-600 hover:bg-green-600 duration-500" :class="{'bg-green-700': processing}">
					<svg v-if="processing" class="h-6 w-8 mr-2 animate animate-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
						<circle cx="50" cy="50" r="45" fill="transparent"
							stroke="currentColor" stroke-width="10px" stroke-linecap='round'
							stroke-dasharray='170' stroke-dashoffset='120'/>
					</svg>
				<span v-if="contribution_type=== 'foreign'" class="text-xl">
					Contribute via TERRE 
					<font-awesome :icon="['fas', 'long-arrow-alt-right']" class="mx-2" />
				</span>
				<span v-else class="text-xl">Contribute</span>
			</button>
			</form>
			<modal :showModal="openConfirmation" @close="openConfirmation = false" :showCloseButton="true">
				<div class="mx-auto">
					<order-summary :orderId="orderId" rounded/>
				</div>
			</modal>
		</ClientOnly>
		</div>
 	</div>
</template>

<script>

import Repository from "@/repository/RepositoryFactory";
import Modal from '../Modal/Modal.vue';
import OrderSummary from './OrderSummary.vue';
import ProgressCheckPoints from './ProgressCheckPoints.vue';
import ContributionType from './ContributionType.vue';
import Glide from '../Utilities/Glide.vue';
import InputWrapper from '../Utilities/InputWrapper.vue';

export default {
    components: { Modal, OrderSummary, ProgressCheckPoints, ContributionType, Glide, InputWrapper },
	props: {
		fromCampaign : {
			type: String,
			default: "" 
		},
		formOrderId : {
			type: String,
			default: null
		}
	},
	data: function () {
		return {
			currencies: [
				{ label: 'India (INR)', value: 'INR' },
				{ label: 'United Stated (USD)', value: 'USD' },
				{ label: 'Other (USD)', value: 'other' }
			],
			loaded: false,
			contribution_type: "",
			contributionExpand: true,
			communicationExpand: true,
			personal_infoExpand: true,
			formData: {},
			addName: "",
			campaigns: null,
			processing: false,
			values: {},
			// error: {},
			message: "",
			openConfirmation: false,
			orderId: null, 
		}
	},
	async mounted() {
		this.loaded = false;
		this.formData = Repository.donation.emptyFormData();
		this.campaigns = this.$static.campaigns.edges.map(e => e.node)
		this.formData.contribution.campaign = this.fromCampaign?.length > 0 ? this.fromCampaign.title : this.campaigns[0].title;
		if (this.formOrderId) {
			this.orderId = this.formOrderId;
			console.log("Setting orderId from props: ", this.orderId);
		}
		if (this.orderId) await this.loadOrder()
		this.loaded = true;
		// let rzp_script = document.createElement('script');
		// rzp_script.setAttribute('src','https://checkout.razorpay.com/v1/payment-button.js')
		// rzp_script.setAttribute('data-payment_button_id', "pl_IW7McPOXaYhPSm")
		// rzp_script.setAttribute('async', true)
		// this.$refs.rzp_btn.appendChild(rzp_script)
	},
	watch: {
		// trees: function(newVal, oldVal) {
		// 	// CASE: trees negative 
		// 	if (newVal < 0) {
		// 		this.formData.contribution.trees = 0
		// 		return
		// 	}
			
		// 	const change = newVal - oldVal
		// 	while(this.names.length > newVal) {
		// 		this.names.pop()
		// 	}
		// },
	},
	methods: {
		selectType(type) {
			this.contribution_type = type
			if (type === "foreign") {
				this.formData.contribution.currency = "usd"
				this.message = `For overseas transcations, we have partnered with 
					<a class="text-slate-500" href="https://terrepolicycentre.com/">
					TERRE Policy Centre</a> to collect payments on our behalf.
					<br/>Please go through our Terms and Conditions for more info.
				`
			}
			if (type === "india") this.formData.contribution.currency = "INR"
			this.$refs.glideAnimate?.trigger()
		},
		async loadOrder() {
			this.formData = await Repository.donation.get(this.orderId)
			this.contribution_type = this.formData.contribution.currency === "usd" ? "foreign" : "india"
			console.log(this.formData, this.contribution_type)
			console.log(this.formData.donor)
		},
		// addCurrentName: function() {
		// 	if(this.addName) {
		// 		this.names.push(this.addName)
		// 		this.addName = ''
		// 	}
		// },
		checkAndSubmitForm: async function (e) {
			e.preventDefault()
			if (this.contribution_type === "foreign") {
				// test mode
				window.location.href="https://pages.razorpay.com/pl_IXfRBUyyqf3N0E/view"
				// prod 
				// window.location.href="https://pages.razorpay.com/..."
				return
			}
		
			if (! this.personalInfoFilled || ! this.contributionFilled) {
				this.contributionExpand = true
				this.communicationExpand = true
				this.personal_infoExpand = true
				this.message = "Please complete all the fields"
				return
			}

			this.processing = true
			try {
				const formObj = JSON.parse(JSON.stringify(this.formData))
				// console.log("Form", formObj);
				this.orderId = await Repository.donation.createOrder(formObj, this.orderId)
			} catch (err) {
				console.error(err)
				// this.error = err
				this.message = err.message
			}

			this.openConfirmation = true
			this.processing = false 
		},
		checkSection: function (e) {
			if (!process.isClient) {
				this.contributionExpand = true;
			} else if (this.contributionFilled && this.personalInfoFilled) {
				this.communicationExpand = true
			} else if (this.contributionFilled && !this.personalInfoFilled) {
				this.personal_infoExpand = true
			} else {
				// default
				this.contributionExpand = true
			}
			e.preventDefault()
		},
	},
	computed: {
		selectedCampaign: function () {
			return this.campaigns?.find(c => c.title === this.formData.contribution.campaign)
		},
		form_stage: function() {
			if(this.contribution_type && this.orderId !== null && this.orderId.length && this.contributionFilled && this.personal_infoExpand && this.personalInfoFilled && this.communicationExpand)
				return 4;
			if(this.contribution_type && this.contributionFilled && this.personal_infoExpand && this.personalInfoFilled)
				return 3;
			if(this.contribution_type && this.contributionFilled && this.personal_infoExpand && !this.personalInfoFilled)
				return 2;
			if(this.contribution_type)
				return 1;
			return 0;
		},
		contributionFilled: function () {
			return typeof this.formData.contribution.trees === 'number' &&
				this.formData.contribution.trees > 0 &&
				this.formData.contribution.campaign?.length > 0
		},
		personalInfoFilled: function () {
			return this.formData.donor.first_name.length > 0 &&
				this.formData.donor.last_name.length > 0 &&
				typeof this.formData.donor.phone === "number" &&
				this.formData.donor.email_id.length > 0
		},
		campaignQuestions: function() {
			return this.formData?.contribution?.campaign?.campaignQuestions?.map(question => {
				return {
					type: question.type.toLowerCase(),
					name: question.name,
					label: question.label,
					help: question.help || null,
				}
			})
		}
	}
}
</script>

<static-query>
query {
  campaigns: allContentfulCampaign {
    edges {
      node {
        title
        name:heading
		description:subtitle
		campaignQuestions {
          label:text
          type:inputType
          help:description
          name:questionName
        }
      }
    }
  }
}
</static-query>