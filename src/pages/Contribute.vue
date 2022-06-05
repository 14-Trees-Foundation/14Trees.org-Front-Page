 <template>
     <Layout>
        <div class="container full-page-generic">
            <div class="lg:(py-32 mb-12 rounded-md)">
                <h1 class="title-text mt-0">Contribute Now</h1>
                <div class="mx-4 md:pt-4">
                    <div v-if="newOrder">
                        <contribute-form/>
                    </div>
                    <div v-else-if="orderId">
                        <contribute-form :formOrderId="orderId"/>
                    </div>
                    <div v-else> Loading </div>
                </div>
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
    data() {
        return {
            orderId: null,
            newOrder: false
        }
    },
    mounted() {
        console.log(window.location.search)
        const params = new URLSearchParams(window.location.search)
        if (params.get("id")) this.orderId = params.get("id")
        else this.newOrder = true
    }
}
</script>