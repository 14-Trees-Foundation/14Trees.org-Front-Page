<template>
    <div class="md:p-12 lg:p-0 lg:w-3/4 mx-auto flex gap-6 flex-col sm:flex-row">
        <div v-for="(type, i) in types" :key="type.key" class="sm:w-1/3 w-full gap-3">
        <glide :delay="i" class="h-full">
            <button class="h-full text-left card hover:-translate-y-1 rounded-md md:p-6 p-3 w-full flex sm:flex-col flex-row" @click="$emit('select', type.key)"> 
                <div class="rounded-full aspect-1 w-1/5 sm:w-2/3 relative bg-green-600 my-5 mx-auto">
                    <div class="absolute w-full h-full flex items-center justify-center">
                        <g-image :src="type.img" alt="donation" class="w-1/2"/>
                    </div>
                    <div class="absolute w-1/2 h-1/2 -right-1/12 -top-1/12 translate-x-1/2 flex items-center justify-center">
                        <div class="rounded-full aspect-1 h-full w-full">
                            <div class="absolute w-full h-full flex items-center justify-center">
                                <g-image :src="type.currency" alt="donation" class="w-5/6 rounded-full"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sm:mb-2 w-2/3 sm:w-full text-center">
                    <h3 class="m-0">{{type.header}}</h3>
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
import Planting from "~/assets/images/Planting.svg";
import PlantingGroup from "~/assets/images/PlantingGroup.svg";
import INR from "~/assets/images/inr.png";
import USD from "~/assets/images/usd.png";
import EMAIL from "~/assets/images/contact.png"

export default {
    props: {
    },
    components: { Glide },
    data() {
        const types = [
            {
                key: 'india',
                header: 'Individual (India)',
                info: "Indian donors/account holders can donate in INR and avail 80G benefits on their PAN Number",
                img: Planting,
                currency: INR
            },
            {
                key: 'foreign',
                header: 'Individial (Overseas)',
                info: "Overseas donors can donate in multiple currencies through our parners.",
                img: Planting,
                currency: USD
            },
            {
                key: 'csr',
                header: 'CSR (Corporate)',
                info: "We encourage organisations to explore CSR opportunies with 14 Trees Foundation. Contact us here.",
                img: PlantingGroup,
                currency: EMAIL
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