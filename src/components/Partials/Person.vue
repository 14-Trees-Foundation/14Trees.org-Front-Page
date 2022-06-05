<template>
<section>
    <!-- Large Variant -->
    <div v-if="variant == 'large'">
        <div class="flex items-center md:ml-4">
            <g-image :src="imgSrc(image)" class="object-contain md:h-32 h-24 content-right" />
            <div class="ml-6 md:w-full">
                <div class="inline flex w-full justify-start">
                    <p class="text-gray-900 dark:text-gray-200 lg:text-xl text-lg  mr-1">{{name}}</p>
                    <div v-if="linkedIn" class="flex items-center">
                        <a :href="linkedIn" target="_blank" rel="noopener noreferrer"><svg
                                xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                <path
                                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg></a>
                    </div>
                </div>
                <div class="text-gray-500 text-md dark:text-gray-400" v-html="toMultiLine(title)"></div>
            </div>
        </div>
    </div>
    
    <!-- Profile Variant -->
    <div v-else-if="variant == 'profile'">
        <div class="flex flex-wrap justify-center">
            <div class="px-4 flex justify-center relative">
                <g-image :src="imgSrc(image)"
                    class="shadow-md rounded-full h-auto align-middle border-none absolute -top-1/2 max-w-40 w-full"/>
                <div class="text-center mt-20">
                    <h3 class="md:text-4xl font-semibold leading-normal mb-2 dark:text-gray-200 text-gray-800 mb-2">
                        {{name}}
                    </h3>
                    <div class="mb-2 text-gray-700 dark:text-gray-400">
                        {{title}}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Extra Small Variant -->
    <div v-else-if="variant == 'extra-small'">
        <div class="flex items-center md:pl-2">
        <g-image :src="imgSrc(image)" class="object-contain h-12"/>
        <div class="pl-2">
            <div class="inline flex w-full justify-start">
                <p class="text-gray-900 dark:text-gray-200 font-medium title-font tracking-wider text-sm mr-1">{{name}}</p>
                <div v-if="linkedIn">
                    <a :href="linkedIn" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
                </div>
            </div>
                <div class="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap" v-html="toSingleLine(title)"></div>
            </div>
        </div>
    </div>

    <!-- Default Small Variant -->
    <div v-else>
        <div class="flex items-center md:pl-4">
        <g-image :src="imgSrc(image)" class="object-contain h-16 content-right" />
        <div class="pl-4">
        <div class="inline flex w-full justify-start">
            <p class="text-gray-900 dark:text-gray-200 font-medium title-font tracking-wider text-sm mr-1">{{name}}</p>
            <div v-if="linkedIn">
                <a :href="linkedIn" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
            </div>
        </div>
            <div class="text-gray-500 dark:text-gray-400" v-html="toMultiLine(title)"></div>
        </div>
        </div>
    </div>
</section>
</template>

<script>
import {imgSrc} from "~/utils";

export default {
    props: {
        image: Object,
        name: String,
        linkedIn: String,
        title: String,
        variant: {
            type: String,
            default: () => {return 'large'}
        } 
    },
    methods: {
        imgSrc(img) {
            return imgSrc(img, 128);
        },
        toMultiLine(txt) {
            const split = txt.replace(';', "<br/>");
            return "<p>" + split + "</p>";
        },
        toSingleLine(txt) {
            const split = txt.replace(';', " ");
            return "<p>" + split + "</p>";
        }
    }
};
</script>