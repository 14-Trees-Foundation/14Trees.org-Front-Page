<template>
    <div class="h-full w-full py-12 px-12">
        <div class="container mx-auto">
            <div class="w-11/12 lg:w-2/3 mx-auto">
                <div class="bg-gray-200 h-1 flex items-center justify-between">
                    <div v-for="(key, i) in sections" :key="i" :class="stepDivisionClass">
                        <!-- Completed Step -->
                        <div v-if="i < activeIndex" class="bg-green-600 h-1 flex items-center justify-start relative">
                            <FloatingLabel>
                                <p class="text-green-600 text-xs font-bold">Step {{i + 1}}: {{key}}</p>
                            </FloatingLabel>
                            <div class="bg-green-600 h-6 w-6 rounded-full shadow flex items-center justify-center -ml-3">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFFFFF" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M5 12l5 5l10 -10" />
                                </svg>
                            </div>
                        </div>

                        <!-- activeIndex Step -->
                        <div v-if="i == activeIndex" class="flex justify-start h-1 items-center relative">
                            <!-- Label -->
                            <FloatingLabel>
                                <p class="text-green-600 text-xs font-bold">Step {{i + 1}}: {{key}}</p>
                            </FloatingLabel>

                            <!-- Current Step Marker -->
                            <div class="bg-gray-200 h-6 w-6 rounded-full shadow flex items-center justify-center -ml-3 relative">
                                <div class="h-3 w-3 bg-green-600 rounded-full"></div>
                            </div>
                        </div>

                        <!-- InactiveIndex Step -->
                        <div v-if="i > activeIndex" class="h-1 flex items-center justify-start relative">
                            <FloatingLabel>
                                <p class="text-gray-400 text-xs font-bold">Step {{i + 1}}: {{key}}</p>
                            </FloatingLabel>
                            <div class="bg-gray-100 h-6 w-6 rounded-full shadow flex items-center justify-center -ml-3 relative">
                                <div class="h-3 w-3 bg-gray-300 rounded-full"></div>
                            </div>
                        </div>
                    </div> 

                    <!-- Last item -->
                    <div class="flex justify-start h-1 items-center relative">
                        <template v-if="activeIndex === keys.length -1 ">
                            <FloatingLabel>
                                <p class="text-green-600 text-xs font-bold">Step {{keys.length}}: {{keys[keys.length - 1]}}</p>
                            </FloatingLabel>
                            <!-- Step Marker -->
                            <div class="bg-gray-200 h-6 w-6 rounded-full shadow flex items-center justify-center -ml-3 relative">
                                <div class="h-3 w-3 bg-green-600 rounded-full"></div>
                            </div>
                        </template>
                        <template v-else>
                            <FloatingLabel>
                                <p class="text-gray-400 text-xs font-bold">Step {{keys.length}}: {{keys[keys.length - 1]}}</p>
                            </FloatingLabel>
                            <div class="bg-gray-400 h-6 w-6 rounded-full shadow flex items-center justify-center -ml-3">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFFFFF" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M5 12l5 5l10 -10" />
                                </svg>
                           </div> 
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
 
import FloatingLabel from "./FloatingLabel.vue";

export default {
    components: {
        FloatingLabel
    },
    props: {
        keys: [],
        activeIndex: 0
    },
    computed: {
        // divide the steps into parts based on the number of keys
        stepDivisionClass() {
            if (this.sections.length === 1)
                return 'w-full';
            return `w-1/${this.sections.length}`;
        },
        sections() {
            return this.keys.slice(0, -1);
        },
        endSection() {
            return this.keys.splice(this.keys.length - 1, 1);
        }
    }
}
</script>
