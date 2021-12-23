 <template>
     <Layout>
        <div class="container full-page-generic">
            <h1 class="title-text mt-0">Contribute Now</h1>
            <div class="mx-4 md:pt-4">
				<contribute-form/>
			</div>
        </div>
    </Layout>
</template>

<script>
import ContributeForm from '../components/Partials/ContributeForm.vue';
export default {
    components: { ContributeForm },
	metaInfo() {
		return {
			title: "Contribute"
		};
	},
}
</script>