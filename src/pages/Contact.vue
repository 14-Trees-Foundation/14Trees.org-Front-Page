<template>
	<Layout>
		<SEO :title="'Contact'" :description="'Contact 14 Trees Foundation'" />
		<div class="container full-page-generic min-h-screen">
			<h1 class="title-text">Contact Us</h1>

			<section class="m-12 bg-gray-900 min-h-1/2-screen rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
				<iframe width="100%" height="100%" title="map" class="absolute inset-0" frameborder="0"
					marginheight="0" marginwidth="0" scrolling="no"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.943269077001!2d73.77400595031932!3d18.933905061281134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU2JzAyLjAiTiA3M8KwNDYnMzQuMyJF!5e0!3m2!1sen!2sin!4v1622636460367!5m2!1sen!2sin"
					style="filter: grayscale(1) contrast(1.2) opacity(0.4);"></iframe>
				<div class="bg-white relative flex flex-wrap py-6 rounded shadow-md mx-auto">
					<div class="lg:w-1/2 px-6">
						<h2 class="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
						<p class="mt-1">
							14 Trees Foundation, Sayagaon, Near Chas Kaman Hydroelectric Plant, Village Vetale, Maharashtra 412404
							</p>
					</div>
					<div class="lg:w-1/2 px-6 mt-4 lg:mt-0">
						<h2 class="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
						<a class="text-blue-500 leading-relaxed" href="mailto:project14trees@gmail.com">project14trees@gmail.com</a>
						<h2 class="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
						<a class="text-blue-500 leading-relaxed" href="tel:+916362-819-073">(+91) 6362 819 073</a>
					</div>
				</div>
			</section>
		</div>
	</Layout>
</template>


<script>
import ActionModal from '@/components/Modal/ActionModal.vue';
import SEO from "~/components/Partials/SEO.vue";

export default {
  components: {
    SEO,
    ActionModal
  },
  metaInfo() {
    return {
      title: "Contact" 
    };
  },
  mounted() {
  }
};
</script>