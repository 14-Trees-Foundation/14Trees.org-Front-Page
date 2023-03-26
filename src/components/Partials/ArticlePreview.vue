<template>
    <div class="max-h-120 card rounded-md hover:-translate-y-1 dark:text-gray-300 text-gray-700 flex flex-col" @click="goToAction">
        <div class="overflow-hidden max-h-40 mb-3 rounded-t-md">
            <div v-if="previewImage" v-lazy-container="{ selector: 'img' }">
                <img alt="content" class="object-cover object-center h-full w-full" :data-src="imgSrc(previewImage)"/>
            </div>
        </div>
        <div class="overflow-y-hidden px-4 flex-grow">
            <h2 class="text-xl font-medium text-gray-700 dark:text-gray-300 my-1">{{headline}}</h2>
            <p class="nested md:contents hidden font-light font-sans text-sm">{{content}}</p>
        </div>
        <div v-if="getAuthor" class="">
            <Person class="md:p-1 m-2 overflow-hidden" v-bind="getAuthor" variant="extra-small"/>
        </div>
    </div>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import Person from './Person';
import { imgSrc } from '@/utils';

export default {
    props: {
        headline: String,
        link: String,
        slug: String,
        author: Object,
        previewImage: Object,
        content: String 
    },
    components: {
        Person
    },
    computed: {
        getAuthor() {
            const author = this.author?.fields ? this.author.fields : this.author;
            if (author) author.variant = 'small';
            return author; 
        },
    },
    methods: {
        imgSrc(img) {
            return imgSrc(img, 500);
        },
        goToAction() {
            window.open(this.link, '_blank').focus();
        },
        textFromObj(o) {
            return documentToHtmlString(o);
        }
    }
};
</script>