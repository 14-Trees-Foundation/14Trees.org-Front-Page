<template>
    <MicroSite>
        <div class="w-full bg-cover bg-center relative"
                :style="'background-image: url(' + header + '); height: ' +imageHeight+ 'px;'">
            <header class="z-1000 md:fixed absolute top-0 left-0 flex min-h-1 mt-2 ml-4">
                <a href="/">
                    <g-image src="~/assets/images/LogoAndName.png" class="px-2 py-4 rounded drop-shadow-lg filter transition-shadow ease-in-out duration-200"></g-image>
                </a>
                <!-- <p class="flex-grow text-center">14 Trees Foundation</p> -->
            </header> 

            <div class="h-full w-full absolute top-0 z-100"
                :style="'background: rgba(0,0,0, ' + bgOpacity + '); height: ' +imageHeight+ 'px;'">
                <div class="flex items-end justify-center w-full h-full from-dark-green via-dark-green bg-gradient-to-t">
                    <div class="text-center drop-shadow-xl w-2/3 md:mb-4">
                        <g-image src="~/assets/images/14TreesEvent.png" class="mx-auto px-8"/>
                        <h1 class="text-white text-2xl font-semibold capitalize md:text-4xl 2xl:text-6xl  md:w-1/2 mx-auto my-4">
                            {{event.title}}
                        </h1>
                        <h3 class="text-light-green text-xl md:text-3xl uppercase font-semibold md:mb-6">{{event.subtitle}}</h3>
                        <h3 class="text-white text-sm md:text-lg">{{event.tagline}}</h3>
                    </div>
                </div>
                <g-image src="~/assets/images/landscape_1.png" class="w-full"></g-image>
            </div>
        </div>

        <main v-if="event" class="mx-auto">
            <div class="min-h-1/2-screen p-2 md:pt-32 pt-12 bg-warm-light-grey mx-auto">
                <div class="container mx-auto font-light font-sans text-sm lg:w-2/3">
                    <article class="p-4" v-html="content"/>
                </div>

                <div class="container mx-auto p-12 text-center">
                    <slide-show :slides="images"/>
                </div>
            </div>

            <section v-if="trees">
                <div class="bg-warm-light-grey w-full md:pt-20">
                    <div class="mx-auto text-center text-gray-800">
                        <g-image src="~/assets/images/GAT-Icon.png" class="w-20 2xl:w-48 mx-auto"></g-image>
                        <h2 class="font-semibold text-3xl 2xl:text-6xl">Site of Plantation : Gat 456</h2>
                        <p>kldsfsadklf sdfksldj flsdkf sdlkf slkjf laskfj ksldafj sldkfj sdl</p>
                        <p>sdfksldj flsdkf sdlkf sdalkfj sdalkjf lksdjf slkjf laskfj ksldafj sldkfj sdl</p>
                        <p>kldsfsadklf sdfksldj flsdkf sdlkf slkjf laskfj ksldafj sldkfj sdl</p>
                    </div>
                </div>
                <div class="relative w-full">
                    <g-image :src="gat" class="object-cover h-full w-full"/>
                    <div class="absolute top-0 w-full h-full flex flex-col">
                        <div class="flex-grow bg-warm-light-grey"/>
                        <div class="flex-grow-2 from-warm-light-grey bg-gradient-to-b"/>
                        <div class="flex-grow bg-transparent"/>
                        <div class="flex-grow from-transparent to-mud-brown bg-gradient-to-b"/>
                    </div>
                </div>

                <div class="bg-mud-brown py-24">
                    <div class="container lg:w-2/3 mx-auto text-center px-4">
                        <g-image src="~/assets/images/Person.svg" class="md:w-20 2xl:w-48 w-12 mx-auto"></g-image>
                        <h2 class="text-white font-semibold text-3xl 2xl:text-6xl">People who Planted</h2>
                        <DonorList :trees="trees" class="overflow-x-auto"></DonorList>
                    </div>
                </div>
            </section>
        </main>

        <footer class="max-h-3/4-screen relative bg-mud-grey">
            <g-image src="~/assets/images/Landscape_2.svg" class="w-full"></g-image>
            <div class="text-center text-white flex flex-col pt-8">
                <g-image src="~/assets/images/14TreesLogo.svg" class="w-24 2xl:w-48 mx-auto font-bold"></g-image>
                <h2 class="font-semibold text-3xl">14 Trees Foundation</h2>
                <p class="font-thin md:text-xl leading-none">(A Section 8 Company)</p>
                <h1 class="font-semibold md:mt-8 text-xl md:text-4xl">We thank you for your contribution!</h1>
                <nav class="mx-auto text-xl font-semibold mt-8 flex justify-center pb-20">
                    <a class="md:px-8 px-2 text-sm md:text-lg">Photos</a>
                    <a class="md:px-8 px-2 text-sm md:text-lg">People</a>
                    <a class="md:px-8 px-2 text-sm md:text-lg">GAT 456</a>
                </nav>
                <g-image src="~/assets/images/EventFooter.png" class="bg-center bg-cover w-full"/>
            </div>
        </footer>
    </MicroSite>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import MicroSite from '../layouts/MicroSite.vue';
import DonorList from '../components/Partials/DonorList.vue'
import SlideShow from '../components/Partials/SlideShow.vue';
import footer from "~/assets/images/EventFooter.png";
import gat from "~/assets/images/GAT.png";

const INITIAL_OPACITY = 0.3;

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
            imageHeight: 700,
            footer: footer,
            gat: gat
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