<template>
    <main v-if="event" class="container mx-auto m-12">
        <div class="flex flex-col mx-auto text-center min-h-1/2-screen p-12">
            <g-image v-if="header" :src="header" class="w-1/2 mx-auto"/>
            <h2>{{event.title}}</h2>
            <h3>{{event.subtitle}}</h3>
            <h3>{{event.tagline}}</h3>
        </div>

        <!-- Border -->
        <div class="hidden sm:block" aria-hidden="true">
            <div class="py-4 mx-auto">
                <div class="border-t border-gray-200" />
            </div>
        </div>

        <div class="flex flex-col mx-auto text-center min-h-1/2-screen p-12">
            <div class="font-light font-sans" v-html="content"></div>
        </div>
        
        <!-- Border -->
        <div class="hidden sm:block" aria-hidden="true">
            <div class="py-4 mx-auto">
                <div class="border-t border-gray-200" />
            </div>
        </div>


    </main>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

export default {
    props: {
    },
    components: {
    },
    computed: {
        event() {
            return this.$page.event
        },
        header() {
            // if (this.event.headerImage && this.event.headerImage?.file) {
            //     return this.event.headerImage.file.url
            // }
            // if (this.event.headerImageLink) return this.event.headerImageLink
            return null 
        },
        content() {
            return documentToHtmlString(this.event.content)
        }
    },
    methods: {
        toDate(date) {
            return new Date(date).toDateString();
        },
        imgSrc(img) {
            if(img?.fields)
                return "https:" + img?.fields?.file.url;
            if(img?.file)
                return "https:" + img?.file.url;
        },
        textFromObj(o) {
            return documentToHtmlString(o);
        },
        bgImg(img) {
            return `background-image: url("${img}");`
        },
    }
};
</script>

<page-query>
query($id: ID!) {
    event: contentfulEventSite(id: $id) {
        title
        subtitle
        tagline
        slug
        headerImage {
            file {
                url
            }
        }
        headerImageLink
        content
    }
}
</page-query>