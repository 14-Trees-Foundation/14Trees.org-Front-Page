<template>
    <div class="md:p-12 lg:p-0 lg:w-3/4 mx-auto flex gap-6 flex-col sm:flex-row">
        <div v-for="(type, i) in types" :key="type.key" class="sm:w-1/3 w-full flex-grow-0 gap-3">
        <glide :delay="i">
            <button class="text-left card md:p-6 p-3 w-full flex sm:flex-col flex-row" @click="$emit('select', type.key)"> 
                <div class="rounded-full aspect-1 w-1/5 sm:w-2/3 relative bg-green-600 my-5 mx-auto">
                    <div class="absolute w-full h-full flex items-center justify-center">
                        <g-image src="~/assets/images/Planting.svg" alt="donation" class="w-1/2"/>
                    </div>
                </div>
                <div class="sm:mb-2 w-2/3 sm:w-full my-auto">
                    <h3 class="font-light m-0">{{type.header}}</h3>
                    <p class="font-light">{{type.info}}</p>
                </div>
            </button>
        </glide>
        </div>
    </div>
</template>

<script>
import { imgSrc } from '@/utils';
import Glide from '../Utilities/Glide.vue';

export default {
    props: {
    },
    components: { Glide },
    data() {
        const types = [
            {
                key: 'india',
                header: 'Individual (India)',
                info: "info for this, desc desc desc.................",
            },
            {
                key: 'foreign',
                header: 'Individial (Overseas)',
                info: "info for that, desc desc desc.................",
            },
            {
                key: 'csr',
                header: 'CSR',
                info: "info for csr, desc desc desc.................",
            },
        ]
        return { types };
    },
    methods: {
        imgSrc(img) {
            return imgSrc(img, 500);
        },
    }
};
</script>