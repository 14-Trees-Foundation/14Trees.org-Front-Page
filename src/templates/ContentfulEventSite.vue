<template>
    <micro-site>
        <div class="w-full bg-cover bg-center relative"
                :style="'background-image: url(' + header + '); height: ' +imageHeight+ 'px;'">
            <header class="z-1000 fixed top-0 left-0 flex min-h-12 bg-white m-4">
                <a href="/">
                    <g-image src="~/assets/images/logo.png" height="40em" width="40em" class="p-1 shadow hover:shadow-lg transition-shadow ease-in-out duration-200"></g-image>
                </a>
                <!-- <p class="flex-grow text-center">14 Trees Foundation</p> -->
            </header> 
            <div class="h-full w-full absolute top-0 z-100"
                :style="'background: rgba(0,0,0, ' + bgOpacity + '); height: ' +imageHeight+ 'px;'">
                <div class="flex items-end justify-center w-full h-full bg-gradient-to-t from-dark-green">
                    <div class="text-center drop-shadow-xl w-2/3 md:mb-4">
                        <h1 class="text-white text-2xl font-semibold capitalize md:text-4xl md:w-1/2 mx-auto my-4">
                            {{event.title}}
                        </h1>
                        <h3 class="text-light-green text-xl md:text-3xl uppercase font-semibold md:mb-6">{{event.subtitle}}</h3>
                        <h3 class="text-white text-sm md:text-lg">{{event.tagline}}</h3>
                    </div>
                </div>
            </div>
    </div>
    <main v-if="event" class="mx-auto">
        <div class="min-h-1/2-screen p-2 bg-warm-light-grey mx-auto">
            <div class="container mx-auto font-light font-sans text-sm lg:w-2/3">
                <article class="md:p-20 p-4" v-html="content"/>
            </div>
        </div>

        <div class="min-h-1/2-screen bg-dark-green text-white">
        <div class="container  mx-auto p-12 text-center">
            <h2> Image Carousel</h2>
            <slide-show :slides="images"/>
        </div>
        </div>

        <div v-if="trees" class="p-2 bg-warm-light-grey">
            <div class="container lg:w-2/3 mx-auto p-12 text-center">
                <h2> Trees planted</h2>
                <DonorList :trees="trees"></DonorList>
            </div>
        </div>

    </main>
    </micro-site>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import MicroSite from '../layouts/MicroSite.vue';
import DonorList from '../components/Partials/DonorList.vue'
import SlideShow from '../components/Partials/SlideShow.vue';

const INITIAL_OPACITY = 0.3

export default {
    props: {
    },
    components: {
        MicroSite,
        DonorList,
        SlideShow
    },
    data() {
        return {
            bgOpacity: INITIAL_OPACITY,
            imageHeight: 600
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    },
    computed: {
        event() {
            return this.$page?.event
        },
        header() {
            return this.event?.headerImage?.file?.url || this.event?.headerImageLink
        },
        content() {
            return documentToHtmlString(this.event?.content)
        },
        images() {
            let imgs = []
            if (this.event?.headerImage?.file?.url)
                imgs.push(this.event?.headerImage?.file?.url)
            if (this.event?.headerImageLink)
                imgs.push(this.event?.headerImageLink)
            console.table(imgs)
            return imgs
        },
        trees() {
            return [...Array(10).keys()].map(a => ({ 
                name: Math.random().toString(36).substring(2,7) + ' ' + Math.random().toString(36).substring(2,9), 
                tree: "Mango", 
                saplingId: 324234234,
                gutId: 2*a%3 + 2,
                date: new Date() 
            }))
        }
    },
    methods: {
        handleScroll(e) {
            const currentScroll = window.pageYOffset;
            if (currentScroll <= this.imageHeight) {
                this.bgOpacity = INITIAL_OPACITY + (1-INITIAL_OPACITY) * (currentScroll / this.imageHeight);
            } else {
                this.bgOpacity = 0;
            }
        },
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