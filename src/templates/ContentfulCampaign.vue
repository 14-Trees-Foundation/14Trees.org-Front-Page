<template>
    <Layout>
            <div class="container sm:pxi-0 mx-auto my-10 overflow-x-hidden text-gray-800 dark:text-gray-300">
                <div class="md:mx-32 mx-6 md:px-4 md:pt-16">
                    <content-header :title="$page.campaign.heading" :sub="$page.campaign.subtitle"></content-header>
                    <div class="self-center w-full">
                        <div v-if="$page.campaign.videoUrl">
                            <div class="md:self-center md:place-self-end w-full md:px-16 video-container">
                                <iframe id="player" type="text/html" width="100%" height="100%"
                                    :src="getVideoUrl($page.campaign.videoUrl)" frameborder="0"></iframe>
                            </div>
                        </div>
                        <div v-if="imgSrc" class="flex items-center justify-center pb-4">
                            <div class="self-center w-full">
                                <g-image :src="imgSrc" class="self-center w-full" />
                            </div>
                        </div>
                        <section class="post-content container mt-12 md:mx-12 relative dark:text-gray-400">
                            <div v-html="withBreaks($page.campaign.content)"></div>
                        </section>
                    </div>
                </div>
            </div>
            <div class="mx-auto container md:py-12" v-for='(presentation, index) in $page.campaign.presentations' :key='index'>
                <SlideShow :headline="presentation.headline" :slides="presentation.slides" :showHeadline="true" class="h-full"/>
            </div>
            <div v-if="$page.campaign.action" class="my-12">
                <ActionModal :link="$page.campaign.action" :showFloat="true" :modalHeight="modalClass" :scrollPosition="3100" ref="actionModal"> 
                    <template #inline>
                        <div v-if='$page.campaign.showCounter'><progress-track :waitForScroll='true' class="md:pt-24 pt-12"/></div>
                        <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-12 lg:px-8 lg:flex lg:items-center lg:justify-between">
                            <h2 class="text-3xl font-extrabold tracking-tight dark:text-gray-200 text-gray-900 sm:text-4xl">
                                <!-- <span class="block">Ready to dive in?</span> -->
                                <span class="block text-green-500">Pledge your contribution today.</span>
                            </h2>
                            <div class="mt-8 lex lg:mt-0 lg:flex-shrink-0">
                                <div class="inline-flex rounded-md shadow">
                                    <button @click="goToAction"
                                        class="btn-action text-white bg-green-500 dark:bg-green-600 hover:bg-green-600 duration-500">
                                        Contribute Now
                                    </button>
                                </div>
                                <div class="ml-4 inline-flex rounded-md shadow">
                                    <a href="#" class="w-32 btn-action text-green-500 bg-white hover:bg-green-50 duration-500" @click="viewMore = !viewMore">
                                        Guide 
                                        <span class="ml-2">{{viewMore ? '&#10005;' : '&#9662;'}}</span> 
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div v-if="$page.campaign.contriGuide && viewMore" class="mx-auto container pb-12">
                            <SlideShow :headline="$page.campaign.contriGuide.headline" :slides="$page.campaign.contriGuide.slides" class="h-full"/>
                        </div>
                    </template>
                    <template #expandButton>
                        <section class="inline-flex items-center justify-center h-full w-full text-lg font-medium rounded-md text-white bg-green-500 dark:bg-green-600">
                            Contribute
                        </section>
                    </template>
                    <template #expand>
                        <section class="dark:bg-gray-600 bg-gray-200 w-screen md:w-full inline-block align-bottom" :class="modalClass">
                            <button class="w-full h-2 mx-auto text-gray-400 pt-4 text-center" @click="closeModal">
                                <svg width="100%" height="12px"
                                    viewBox="0 0 22 12" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <title>down</title>
                                    <desc>Created with Sketch.</desc>
                                    <defs></defs>
                                    <g id="icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g id="Artboard" transform="translate(-422.000000, -107.000000)"
                                            fill-rule="nonzero" fill="#A0A0A0">
                                            <polygon id="down"
                                                transform="translate(433.250000, 108.250000) rotate(45.000000) translate(-433.250000, -108.250000) "
                                                points="425.928932 114.571068 425.928932 115.571068 440.571068 115.571068 440.571068 100.928932 439.571068 100.928932 439.571068 114.571068">
                                            </polygon>
                                        </g>
                                    </g>
                                </svg>
                            </button>
                            <div v-if='$page.campaign.showCounter'><progress-track :waitForScroll='false' class="w-full"/></div>
                            <div class="max-w-4xl md:mx-auto px-4 py-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
                                <h2 class="text-3xl font-extrabold tracking-tight dark:text-gray-200 text-gray-900 sm:text-4xl">
                                    <span class="block text-green-500 text-3xl lg:mr-24">Pledge your contribution today.</span>
                                </h2>
                                <div class="mt-8 lex lg:mt-0 lg:flex-shrink-0">
                                    <div class="inline-flex rounded-md shadow">
                                        <button @click="goToAction"
                                            class="btn-action text-white bg-green-500 hover:bg-green-600 duration-500">
                                            Contribute Now
                                        </button>
                                    </div>
                                    <div class="ml-4 inline-flex rounded-md shadow">
                                        <g-link :to="'/contribute'" tag="button"
                                            class="btn-action text-green-500 bg-white hover:bg-green-50 duration-500">
                                            Learn More
                                        </g-link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </template>
                </ActionModal>
            </div>
            <div class="container sm:pxi-0 mx-auto my-10 overflow-x-hidden text-gray-800 dark:text-gray-400">
                <div class="flex justify-center md:mt-20 mt-10">
                    <span class="w-1/3 pb-4 mb-4 border-b-2 border-gray-300"></span>
                </div>
                <div v-for="tm in $page.campaign.testimonials" :key="tm.id">
                    <testimonial v-bind="tm" />
                    <div class="flex justify-center">
                        <span class="w-1/3 pb-4 mb-4 border-b-2 border-gray-300"></span>
                    </div>
                </div>
            </div>
            <div class="container w-full sm:pxi-0 mx-auto my-10 overflow-x-hidden text-gray-800 dark:text-gray-400">
                <section class="post-content mx-8 px-4 md:pt-16 dark:text-gray-400">
                    <ContentfulRichText :content="$page.campaign.footerContent" />
                </section>
            </div>
    </Layout>
</template>

<script>
import ContentHeader from "~/components/Partials/ContentHeader.vue";
import ContentfulRichText from "~/components/Partials/ContentfulRichText.vue";
import Testimonial from "~/components/Partials/Testimonial.vue";
import SlideShow from "~/components/Partials/SlideShow.vue";
import ActionModal from "~/components/Modal/ActionModal.vue";
import ProgressTrack from "~/components/Partials/ProgressTrack.vue";
import mediumZoom from "medium-zoom";
import { withLineBreaks, videoUrl, imgSrc } from '~/utils';
 
export default {
  components: {
    ContentHeader,
    ContentfulRichText,
    Testimonial,
    ActionModal,
    SlideShow, 
    ProgressTrack
  },
  metaInfo() {
    return {
      title: this.$page.campaign.heading
    };
  },
  mounted() {
    mediumZoom(".post-content img")
    console.log(this.$id)
  },
  data: function() {
      return {
          viewMore: false,
      }
  },
  computed: {
    imgSrc() {
      return this.$page.campaign.headerMedia ? imgSrc(this.$page.campaign.headerMedia, 1024) : false;
    },
    slides() {
      return ["test"]
    },
    modalClass() {
        return this.$page.campaign.showCounter ? 'md:h-80 h-96' : 'h-36'
    }
  },
  methods : {
    closeModal() {
       this.$refs?.actionModal.close()
    },
    goToAction() {
            window.location.href = this.link;
    },
    getVideoUrl(url) {
        return videoUrl(url) ;
    },
    goToAction() {
        window.location.href = this.$page.campaign.action;
    },
    withBreaks(a) {
        return withLineBreaks(a);
    }
  }
};
</script>

<page-query>
    query($id: ID!) { 
        campaign: contentfulCampaign(id: $id) {
            title
            heading
            subtitle
            videoUrl
            action
            showCounter
            presentations {
                headline
                slides { file { url } }
            }
            contriGuide: guide{
                headline
                slides { file { url } }
            }
            fromDate
            toDate
            content(html: true)
            footerContent
            location { lat lon }
            testimonials {
                id
                content(html: true)
                person {
                    name
                    title
                    image { file { url } }
                    linkedIn
                }
                pictures { file { url } }
            }
        }
    }

</page-query>