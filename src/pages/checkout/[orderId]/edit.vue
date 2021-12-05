 <template>
     <Layout>
        <div class="container full-page-generic">
            <h1 class="title-text">Edit Your Details</h1>
            <div class="mx-4 md:pt-16">
				<contribute-form :orderIdEdit="orderId"/>
			</div>
        </div>
    </Layout>
			
				
</template>

<script>
import ContributeForm from '@/components/Partials/ContributeForm.vue';
export default {
    components: { ContributeForm },
	metaInfo() {
		return {
			title: "Contribute"
		};
	},
	data() {
		return  {
			orderId: null
		}
	},
	mounted() {
		this.orderId = this.$route.params.orderId
	},
}
</script>