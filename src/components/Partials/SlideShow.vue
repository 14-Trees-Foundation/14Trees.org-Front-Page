<template>
    <section>
        <h3 v-if="showHeadline" class="md:text-3xl text-center md:p-2 px-4 text-gray-600 font-light dark:text-gray-300">{{headline}}</h3>
        <div class="mx-auto grid md:grid-cols-6 grid-cols-8 md:gap-4 items-center">
            <!-- Prev Button -->
            <div class="col-span-1 flex justify-end">
                <button class="bg-gray-200 hover:shadow-lg rounded-full md:w-12 md:h-12 w-6 h-6 btn-action p-2 duration-300 focus:outline-none md:text-2xl text-center font-light text-gray-800"
                    @click="activeSlide = activeSlide === 1 ? slides.length : activeSlide - 1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <line x1="5" y1="12" x2="9" y2="16" />
                          <line x1="5" y1="12" x2="9" y2="8" />
                        </svg>
                    </button>
            </div>

            <!-- Active Slide -->
            <div class="md:col-span-4 col-span-6 relative overflow-hidden pb-3/4 bg-gray-300 rounded-2xl" v-lazy-container="{ selector: 'img' }">
                <!-- <div class="absolute w-full h-full flex items-center justify-center">
                    <svg class="animate-spin h-60 w-60 stroke-current stroke-3 text-green-600" viewBox="0 0 100 100">
                        <path d="M0,50 a1,1 0 0,0 97,0" fill="transparent" />
                    </svg> 
                </div>  -->
                <img :data-src="imgSrcInd(activeSlide - 1)" class="absolute object-fill w-full h-full md:object-right object-center" />
            </div>

            <!-- Next button -->
            <div class="col-span-1 flex justify-start">
                <button class="bg-gray-200 hover:shadow-lg rounded-full md:w-12 md:h-12 w-6 h-6 btn-action p-2 duration-300 focus:outline-none md:text-2xl text-center font-light text-gray-800"
                    @click="activeSlide = activeSlide === slides.length ? 1 : activeSlide + 1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <line x1="15" y1="16" x2="19" y2="12" />
                      <line x1="15" y1="8" x2="19" y2="12" />
                    </svg>
                </button>
            </div>

            <!-- Controls (bottom)-->
            <div class="md:col-span-4 md:col-start-2 col-start-2 col-span-6 w-full flex items-center text-center">
                <div class="flex mx-auto">
                <!-- <p class="text-xl w-full flex-grow dark:text-gray-400 font-extralight font-gray-400">{{activeSlide}} / {{slides.length}}</p> -->
                    <div class="mx-2" v-for="slide in slides.length" :key="slide">
                        <button class="w-3 h-3 mt-4 rounded-full overflow-hidden transition-colors duration-200 ease-out hover:bg-green-600 hover:shadow-lg focus:outline-none"
                            :class="{ 'bg-green-600': activeSlide === slide, 'bg-gray-200': activeSlide !== slide }"
                            @click="activeSlide = slide">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { imgSrc } from '~/utils';

export default {  
    data: function (){
        let activeSlide = 1 
        return { activeSlide }
    },
    mounted() {
    },
    props: {
        slides: Array,
        headline: String,
        showHeadline: {
            type: Boolean,
            default: false
        }
    },
	methods : {
		imgSrc(img) {
            return imgSrc(img, 1024);
        },
        imgSrcInd(ind) {
            if (ind < this.slides.length) {
                if (typeof this.slides[ind] === 'string') {
                    return this.slides[ind]
                }
                return imgSrc(this.slides[ind], 1024);
            }
            return null;
        },
        goToAction() {
            window.location.href = this.link;
        },
	}
}
</script>