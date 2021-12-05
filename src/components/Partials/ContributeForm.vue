<template>
 		<div>
    		<div class="mb-24">
			<ProgressCheckPoints :keys="['Contribution', 'Information', 'Communication', 'Payment']" :activeIndex="form_stage"/>
		</div>

 		<ClientOnly>
 			<form action="#" method="POST" id="pledgeForm" @submit="checkAndSubmitForm" class="mt-18 md:ml-12 md:mb-32 mb-12">
 				<div id="contribution" class=" h-full transition-height duration-500 ease-in-out">
 					<!-- ******************************************************** -->
 					<!-- ****************** Contribution ************************-->
 					<!-- ******************************************************** -->
 					<div class="mt-10 sm:mt-0" v-if="contributionExpand">

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
 									<div class="px-4 py-5 bg-white dark:bg-dark-grey sm:p-6">
 										<div class="grid grid-cols-4 gap-6">
 											<div class="col-span-4">
 												<label for="first_name" class="block text-sm font-medium text-gray-700">Campaign</label>
 												<select v-model="campaign" required class="input-field">
 													<option v-for="(c,i) in campaigns" :key="i" :value="c">{{c.name}}
 													</option>
 												</select>
												 <div class="border rounded-md mt-2" v-if="campaign.description">
													 <p class="text-gray-600 text-sm font-light p-4">{{campaign.description}}</p>
												 </div>
 											</div>

 											<div class="col-span-4">
 												<label for="last_name" class="block text-sm font-medium text-gray-700">Number of Trees</label>
 												<div v-if="orderId == null" class="flex flex-row w-full h-11 border-gray-300 border rounded">
 													<button type="button" @click="trees--" class="mr-0.5 border-r transition-colors duration-200 ease-in-out flex-grow bg-gray-100 text-gray-600  hover:bg-red-300 h-full rounded-l cursor-pointer  focus:outline-none">
 														<span class="m-auto text-2xl font-thin">−</span>
 													</button>
 													<input type="number" :disabled="orderId !== null" v-model.number="trees" min="1" class="w-2/3 flex-grow appearance-none input-field border-none rounded-none"/>
 													<button type="button" @click="trees++" class="ml-1 border-l transition-colors duration-200 ease-in-out flex-grow bg-gray-100 text-gray-600  hover:bg-green-400 h-full rounded-r cursor-pointer focus:outline-none">
 														<span class="m-auto text-2xl font-thin">+</span>
 													</button>
 												</div>
												 <span v-else class="input-field text-gray-500 inline-flex items-center">
													<span class="pl-1 pr-4 border-r"> {{trees}} </span>
          											<font-awesome class="text-gray-300 mx-4" :icon="['fas', 'lock']"></font-awesome>
													<span class="text-xs text-gray-400"> Please make a separate contribution to edit this field</span>
												 </span>
 											</div>

 											<div v-if="trees > 0" class="col-span-4">
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
 											</div>
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
 								<div class="px-4 sm:px-0 md:mt-0 mt-5">
 									<p class="mt-4 text-sm text-gray-600 py-6">
 										Besides making a monetary contribution, I'd also like to:
 									</p>
 								</div>
 							</div>

 							<div class="mt-5 md:mt-0 md:col-span-2">
 								<div class="shadow overflow-hidden sm:rounded-md">
 									<div class="px-4 py-5 bg-white dark:bg-dark-grey space-y-6 sm:p-6">
 										<fieldset>
 											<div class="mt-4 space-y-4">
 												<div class="flex items-start">
 													<div class="flex items-center h-5">
 														<input id="visit" name="visit" v-model="visit" type="checkbox" class="input-checkbox" />
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
 														<input id="csr" name="csr" v-model="csr" type="checkbox" class="input-checkbox"/>
 													</div>
 													<div class="ml-3 text-sm">
 														<label for="csr" class="font-medium text-gray-700">CSR
 															Contributions</label>
 														<p class="text-gray-500">Explore possibility of CSR
 															contribution through my company or my
 															employer</p>
 													</div>
 												</div>
 												<div class="flex items-start">
 													<div class="flex items-center h-5">
 														<input id="volunteer" name="volunteer" v-model="volunteer"
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
 									</p>
 								</div>
 							</div>
 							<div class="mt-5 md:mt-0 md:col-span-2">
 								<div class="shadow overflow-hidden sm:rounded-md">
 									<div class="px-4 py-5 bg-white dark:bg-dark-grey sm:p-6">
 										<div class="grid grid-cols-6 gap-6">
 											<div class="col-span-6 sm:col-span-3">
 												<label for="first_name"
 													class="block text-sm font-medium text-gray-700">First name</label>
 												<input type="text" v-model="first_name" name="first_name" required
 													id="first_name" autocomplete="given-name"
 													class="input-field" />
 											</div>

 											<div class="col-span-6 sm:col-span-3">
 												<label for="last_name"
 													class="block text-sm font-medium text-gray-700">Last name</label>
 												<input type="text" v-model="last_name" name="last_name" id="last_name"
 													autocomplete="family-name" required
 													class="input-field" />
 											</div>

 											<div class="col-span-6 sm:col-span-4">
 												<label for="email_address"
 													class="block text-sm font-medium text-gray-700">Email
 													Address</label>
 												<input type="email" v-model="email_address" name="email_address"
 													id="email_address" autocomplete="email" required
 													class="input-field" />
 											</div>

 											<div class="col-span-6 sm:col-span-3">
 												<label for="phone_number"
 													class="block text-sm font-medium text-gray-700">Phone</label>
 												<input type="tel" v-model.number="phone" name="phone_number"
 													id="phone_number" autocomplete="tel" required min="999999999" max="9999999999"
 													class="input-field" />
 											</div>

 											<div class="col-span-6 sm:col-span-3">
 												<label for="country"
 													class="block text-sm font-medium text-gray-700">Country / Region (Currency)</label>
 												<select id="country" v-model="location" name="country"
 													autocomplete="country"
 													class="input-field">
 													<option>India (INR)</option>
 													<option>United States (USD)</option>
 													<option>Other</option>
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
 					<div class="mt-10 sm:mt-0" v-if="communicationExpand">
 						<div class="md:grid md:grid-cols-3 md:gap-6">
 							<div class="md:col-span-1">
 								<div class="px-4 sm:px-0">
 									<h3 class="text-lg font-medium leading-6 text-gray-900">Communication</h3>
 									<p class="mt-1 text-sm text-gray-600">
 										Decide which communications you'd like to receive and how.
 									</p>
 								</div>
 							</div>
 							<div class="mt-5 md:mt-0 md:col-span-2">
 								<div class="shadow overflow-hidden sm:rounded-md">
 									<div class="px-4 py-5 bg-white dark:bg-dark-grey space-y-6 sm:p-6">
 										<fieldset>
 											<div class="mt-4 space-y-4">
 												<div class="flex items-start">
 													<div class="flex items-center h-5">
 														<input id="updates" name="updates" v-model="updates"
 															type="checkbox" class="input-checkbox" />
 													</div>
 													<div class="ml-3 text-sm">
 														<label for="comments" class="font-medium text-gray-700">14
 															Trees Milestones</label>
 														<p class="text-gray-500">Receive regular updates on the 14
 															Trees Foundation's progress in
 															your Inbox</p>
 													</div>
 												</div>
 												<div class="flex items-start">
 													<div class="flex items-center h-5">
 														<input id="newsletter" name="newsletter" v-model="newsletter"
 															type="checkbox" class="input-checkbox" />
 													</div>
 													<div class="ml-3 text-sm">
 														<label for="candidates"
 															class="font-medium text-gray-700">Newsletter</label>
 														<p class="text-gray-500">Subscribe to our annual report</p>
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

 				<!-- Contribute Button -->
 				<button type="submit" class="flex flex-row btn-action mx-auto text-white w-64
				 		bg-green-500 dark:bg-green-600 hover:bg-green-600 duration-500" :class="{'bg-green-700': processing}">
						<svg v-if="processing" class="h-6 w-8 mr-2 animate animate-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
							<circle cx="50" cy="50" r="45" fill="transparent"
								stroke="currentColor" stroke-width="10px" stroke-linecap='round'
  								stroke-dasharray='170' stroke-dashoffset='120'/>
						</svg>
 						<span class="text-xl">Contribute</span>
 				</button>

 			</form>
			 <modal :showModal="openConfirmation" @close="openConfirmation = false">
				 <div class="mx-auto">
					<order-summary :orderId="orderId" rounded/>
				 </div>
			 </modal>
 		</ClientOnly>
 		<form ref="payButton"> </form>
 	</div>
</template>

<script>

import Repository from "@/repository/RepositoryFactory";
import Modal from '../Modal/Modal.vue';
import OrderSummary from './OrderSummary.vue';
import ProgressCheckPoints from './ProgressCheckPoints.vue';

export default {
    components: { Modal, OrderSummary, ProgressCheckPoints },
	props: {
		fromCampaign: ""
	},
	data: function () {
		return {
			loaded: false,
			contributionExpand: true,
			communicationExpand: false,
			personal_infoExpand: false,
			first_name: "",
			last_name: "",
			email_address: "",
			location: "",
			campaign: "",
			trees: 1,
			names: [],
			addName: "",
			csr: false,
			visit: false,
			phone: "",
			volunteer: false,
			updates: false,
			newsletter: false,
			campaigns: null,
			processing: false,
			values: {},
			error: {},
			openConfirmation: false,
			orderId: null, // for testing only. init as null
			// orderId: "order_I1YE0GASVEQAfD" // for testing only. init as null
		}
	},
	mounted() {
		this.loaded = false;
		this.campaigns = this.$static.campaigns.edges.map(e => e.node)
		// this.campaigns = this.$static.campaigns.edges.map(edge=> {
		// 	return {
		// 		name: edge.node.heading,
		// 		description: edge.node.subtitle,
		// 	}
		// })
		if (this.fromCampaign?.length > 0) {
			this.campaign = this.fromCampaign
		} else {
			this.campaign = this.campaigns[0]
		}
		if (this.orderId) {
			this.loadOrder()
		}
		this.loaded = true;
	},
	watch: {
		trees: function(newVal, oldVal) {
			// CASE: trees negative 
			if (newVal < 0) {
				this.trees = 0
				return
			}
			
			const change = newVal - oldVal
			while(this.names.length > newVal) {
				this.names.pop()
			}
		},
	},
	methods: {
		async loadOrder() {
			let orderDetails = await Repository.donation.get(this.orderId)
			console.log(orderDetails)
			this.first_name = orderDetails.first_name;
			this.last_name = orderDetails.last_name;
			this.phone = orderDetails.phone;
			this.email_address = orderDetails.email_id;
			this.campaign = orderDetails.campaign;
			this.names = orderDetails.names;

			this.volunteer = orderDetails.interest.volunteer;
			this.csr = orderDetails.interest.csr;
			this.visit = orderDetails.interest.visit;

			this.newsletter = orderDetails.notifications.newsletter;
			this.updates = orderDetails.notifications.updates;

			this.location = orderDetails.location
			this.trees = orderDetails.trees
		},
		addCurrentName: function() {
			if(this.addName) {
				this.names.push(this.addName)
				this.addName = ''
			}
		},
		checkAndSubmitForm: async function (e) {
			e.preventDefault()

			if (! this.personalInfoFilled || ! this.contributionFilled) {
				this.contributionExpand = true
				this.communicationExpand = true
				this.personal_infoExpand = true
				return
			}

			const formData = {
				first_name: this.first_name,
				last_name: this.last_name,
				email_id: this.email_address,
				phone: this.phone,
				location: this.location,
				campaign: this.campaign.name,
				trees: this.trees,
				names: this.names,
				interest: {
					csr: this.csr,
					visit: this.visit,
					volunteer: this.volunteer,
				},
				notifications: {
					updates: this.updates,
					newsletter: this.newsletter
				}
			}
			this.processing = true
			try {
				this.orderId = await Repository.donation.createOrder(formData, this.orderId)
			} catch (err) {
				console.error(err)
				this.error = err
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
		form_stage: function() {
			if(this.orderId !== null && this.orderId.length && this.contributionFilled && this.personal_infoExpand && this.personalInfoFilled && this.communicationExpand)
				return 3;
			if(this.contributionFilled && this.personal_infoExpand && this.personalInfoFilled)
				return 2;
			if(this.contributionFilled && this.personal_infoExpand && !this.personalInfoFilled)
				return 1;
			return 0;
		},
		contributionFilled: function () {
			return typeof this.trees === 'number' &&
				this.trees > 0 &&
				this.campaign?.name?.length > 0
		},
		personalInfoFilled: function () {
			return this.first_name.length > 0 &&
				this.last_name.length > 0 &&
				typeof this.phone === "number" &&
				this.email_address.length > 0
		},
		campaignQuestions: function() {
			return this.campaign?.campaignQuestions?.map(question => {
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