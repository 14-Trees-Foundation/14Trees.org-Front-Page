<template>
    <Layout>
        <section v-if="post">
            <article class="container mx-auto">
                <!-- <div class="bg-center bg-cover rounded-lg" :style="bgImg(imgSrc(image))"> -->
                    <!-- <span id="blackOverlay" class="w-full h-full absolute opacity-25 bg-black rounded-lg"></span> -->
                <!-- </div> -->
                <div class="flex flex-wrap justify-center">
                    <div class="pt-1/4 w-screen-md">
                        <Person class="w-full" v-bind="getAuthor" variant="profile"/>
                        <h1 class="xl:(mt-12 text-5xl) mt-4 text-2xl dark:text-gray-200 font-light ">{{post.title}}</h1>
                        <p class="text-gray-400 text-sm font-bold pt-4">{{toDate(post.date)}}</p>
                        <div class="mb-12 mt-4 md:text-lg lg:text-xl text-md leading-relaxed dark:text-gray-200 text-gray-800">
                            <div class="font-light font-sans" v-html="post.content"></div>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    </Layout>
</template>

<script>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import Person from '~/components/Partials/Person';

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
        post() {
            return this.$page.blogPost;
        },
        getAuthor() {
            const author = this.post?.author?.fields ? this.post?.author.fields : this.post?.author;
            author.variant = 'small';
            return author; 
        },
        image() {
            this.post?.heroImage;
        },
    },
    methods: {
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
    blogPost: contentfulBlogPost(id: $id) {
        title
        link: path
        heroImage {
            file {
                url
            }
        }
        slug
        date
        content: body
        author {
            name
            title
            image {
                file {
                    url
                }
            }
            linkedIn
        }
    }
}
</page-query>