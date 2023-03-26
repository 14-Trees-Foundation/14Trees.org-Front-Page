<template>
    <section class="block transform transition-all ease-in duration-500" 
        :class="{'translate-y-0 opacity-100' : loaded, 'translate-y-5 opacity-0': !loaded}">
        <slot></slot>
    </section>
</template>

<script>
export default {
    mounted() {
        if (this.triggerOnMount) { this.trigger() }
    },
    props: {
        triggerOnMount: {
            type: Boolean,
            default: true,
        },
        delay: {
            type: Number,
            default: 0 
        },
    },
    data() {
        return {
            loaded: false
        }
    },
    methods: {
        trigger() {
            setTimeout(() => {
                this.loaded = true;
            }, 100 * this.delay);
        }
    }
}
</script>

<style>

</style>