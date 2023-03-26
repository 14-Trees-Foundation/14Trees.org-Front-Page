<template>
    <section>
        <div class="bg-gray-100 dark:bg-gray-700">
            <slot name="inline"/>
        </div>
        <div v-if="showFloatScroll" class="absolute z-50">
            <div v-click-outside="close" class="fixed md:bottom-4 md:right-6 flex flex-wrap content-center transition-height h-12 duration-500 ease-out shadow-2xl rounded-lg" :class='expandClass'>
                    <div v-if="expandModal" :class="modalHeight" class="inline-flex align-bottom">
                        <slot name="expand"/>
                    </div>
                    <div v-else>
                        <button @click="open" class="md:h-12 md:w-40 h-10 w-32 inline-flex items-center justify-center">
                            <slot name="expandButton" />
                        </button>
                    </div>
            </div>
        </div>
    </section>
</template>

<script>
import { imgSrc, withLineBreaks } from '~/utils';

export default {  
    data: function (){
        return { showFloatScroll: false, expandModal: false }
    },
    mounted() {
        window.addEventListener('scroll', this.updateScroll);
    },
    props: {
        link: String,
        modalHeight: String,
        showFloat: Boolean,
        scrollPosition: Number
    },
    computed: {
        expandClass() {
            return { 
                [this.modalHeight]: this.expandModal,
                'right-0 bottom-0': this.expandModal,
                'bottom-2 right-2 ': !this.expandModal
            }
        }
    },
	methods : {
        updateScroll() {
            if (this.showFloat) {
                this.showFloatScroll = window.scrollY > this.scrollPosition;
            }
        },
        open() {
            this.expandModal = true 
        },
        close() {
            this.expandModal = false 
        }
	}
}
</script>