<template>
  <Layout>
		<SEO :title="'Blogs'" :description="'Blogs about reforestation efforts by 14 Trees Foundation'"/>
    <section class="container full-page-generic">
      <h1 class="title-text">Sites</h1>
      <div class="w-full sm:pxi-0 mx-auto my-2 ">
        <template v-for="site in sites">
          <div :key="site.title" class="md:w-1/2 w-full mt-2 px-8 md:pt-16">
            <g-link :to="'/event/' + site.slug">{{site.title}}</g-link>
          </div>
        </template>
      </div>
    </section>
  </Layout>
</template>

<script>
import SEO from "~/components/Partials/SEO.vue";
import { imgSrc, withLineBreaks } from '~/utils';

export default {
	metaInfo: {
		descrition: "Home",
	},
	components: {
		SEO
	},
  computed: {
    sites() {
      return this.$page.sites?.edges?.map(e => e.node);
    }
  },
	methods: {
		withBreaks(a) {
			return withLineBreaks(a);
		},
		imgSrc(img) {
      return imgSrc(img, 200);
    },
	}
};
</script>

<page-query>
{
    sites:allContentfulEventSite {
      edges {
        node {
          title
          subtitle
          slug 
        }
      }
    }
}
</page-query>

