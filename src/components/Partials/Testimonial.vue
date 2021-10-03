<template>
    <section class="text-gray-700 body-font">
        <div class="md:py-24 py-16 mx-4">
            <div class="grid grid-cols-8">
                <div v-if="hasImgs" class="md:col-span-4 col-span-8 flex md:justify-end">
                    <div class="md:ml-4 md:p-8 md:w-10/12 w-full flex content-center h-full">
                        <div class="contents">
                            <div class="md:flex md:flex-wrap content-center w-full">
                                <!-- First image, to be shown in mobile-->
                                <div class="md:hidden md:p-2 mb-4 md:mb-1 w-full">
                                    <div v-if="imgSrcInd(0)" v-lazy-container="{ selector: 'img' }">
                                        <img :data-src="imgSrcInd(0)" class="object-contain w-full md:object-right object-center" />
                                    </div>
                                </div>
                                <!-- First image in desktop, when only 1 image -->
                                <div class="md:contents hidden md:p-2 mb-4 md:mb-1 w-full">
                                    <div v-if="imgSrcInd(0) && !imgSrcInd(1)" v-lazy-container="{ selector: 'img' }">
                                        <img :data-src="imgSrcInd(0)" class="object-contain w-full md:object-right object-center" />
                                    </div>
                                </div>
                                <!-- When only two images, then 1 and 2 are stacked vertically-->
                                <div class="md:contents hidden m-4" v-if="imgSrcInd(1) && !imgSrcInd(2)" v-lazy-container="{ selector: 'img' }">
                                    <img :data-src="imgSrcInd(0)" class="object-contain md:p-2 p-4 w-full object-right" />
                                    <img :data-src="imgSrcInd(1)" class="object-contain md:p-2 p-4 w-full object-right" />
                                </div>
                                <!-- When three images, then 1 is full and 2 & 3 are stacked horizontally -->
                                <div class="md:contents hidden" v-if="imgSrcInd(0) && imgSrcInd(1) && imgSrcInd(2)" v-lazy-container="{ selector: 'img' }">
                                    <div class="md:p-2 mb-4 md:mb-1 w-full">
                                        <img :data-src="imgSrcInd(0)" class="object-contain w-full md:object-right object-center" />
                                    </div>
                                    <img :data-src="imgSrcInd(1)" class="object-contain md:p-2 p-1 w-1/2 object-right" />
                                </div>
                                <div class="md:contents hidden" v-if="imgSrcInd(2)" v-lazy-container="{ selector: 'img' }">
                                    <img :data-src="imgSrcInd(2)" class="object-contain md:p-2 p-1 w-1/2 object-right" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <span class="md:w-1 bg-green-300"></span>
                </div>
                <div class="col-span-8" :class="{ 'md:col-span-4 w-full' : hasImgs, 'md:col-span-7 md:col-start-2' : !hasImgs}">
                    <div class="md:w-3/4 md:pl-12 pb-4 flex flex-col justify-center w-full h-full text-left">
                        <div class="md:contents hidden">
                            <svg  xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                class="inline-block w-8 h-8 text-gray-400 mb-8" viewBox="0 0 975.036 975.036">
                                <path
                                    d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z">
                                </path>
                            </svg>
                        </div>
                        <p class="md:hidden dark:text-gray-400 leading-relaxed text-md" v-html="truncatedSmall"></p>
                        <p class="hidden dark:text-gray-400 md:contents leading-relaxed text-md" v-html="truncatedLarge"></p>
                        <div class="flex justify-center mt-4">
                            <div v-if="viewMoreSmall" class="contents md:hidden">
                                <button class="border-2 border-gray-600 text-gray-700 dark:text-gray-300
                                                active:bg-gray-600 text-xs px-6 py-1 rounded shadow 
                                                hover:shadow-md outline-none focus:outline-none mr-1 mb-1" 
                                        type="button" style="transition: all .15s ease" 
                                        v-on:click="openFullTestimonial()">
                                    Read 
                                </button>
                            </div>
                            <div v-if="viewMoreLarge" class="hidden md:contents">
                                <button class="border-2 border-gray-600 text-gray-700  dark:text-gray-300
                                                active:bg-gray-600 text-xs px-6 py-1 rounded shadow 
                                                hover:shadow-md outline-none focus:outline-none mr-1 mb-1" 
                                        type="button" style="transition: all .15s ease" 
                                        v-on:click="openFullTestimonial()">
                                    Read 
                                </button>
                            </div>
                        </div>
                        <LargeModal ref="modal">
                            <FullTestimonial :title="title" :person="person" :content="content" :pictures="picturesToDisplay"/>
                        </LargeModal>
                        <div class="flex justify-center">
                        <span class="text-center inline-block h-1 w-10 rounded bg-green-500 mt-8 mb-6"></span>
                        </div>
                        <Person :image="person.image" :name="person.name" :linkedIn="person.linkedIn" :title="person.title" variant="small"/>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Person from './Person';
import LargeModal from '../Modal/LargeModal';
import FullTestimonial from './FullTestimonial';
import { imgSrc } from '@/utils';

export default {
    components: { 
        Person,
        LargeModal,
        FullTestimonial
    },
    props: {
        title: String,
        person: Object,
        content: String,
        pictures: Array
    },
    data: function() {
        return {
            picturesToDisplay : []
        }
    },
    created: function() {
        this.picturesToDisplay = []
        if (this.pictures?.length >= 0) {
            this.picturesToDisplay.push(...this.pictures);
        }
    },
    methods : {
		imgSrc(img) {
            imgSrc(img, 500);
        },
        imgSrcInd(ind) {
            if (ind < this.picturesToDisplay.length) {
                return imgSrc(this.picturesToDisplay[ind], 500);
            }
            return null;
        },
        openFullTestimonial() {
            this.$refs.modal.toggleModal();
        }
    },
    computed : {
        hasImgs() {
            return this.picturesToDisplay.length > 0 || false; 
        },
        truncatedLarge() {
            const size = 1200;
            const viewMore = this.content.length > size;
            return this.content.slice(0, size) + (viewMore ? "..." : "");
        },
        truncatedSmall() {
            const size = 400;
            const viewMore = this.content.length > size;
            return this.content.slice(0, size) + (viewMore ? "..." : "");
        },
        viewMoreSmall() {
            return this.content?.length > 400;
        },
        viewMoreLarge() {
            return this.content?.length > 1200;
        },
	}
};
</script>