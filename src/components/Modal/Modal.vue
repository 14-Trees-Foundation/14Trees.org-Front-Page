<template>
  <Transition name="fade">
    <div v-if="showModal" class="fixed h-full inset-0 overflow-y-auto overflow-x-hidden flex items-center justify-center bg-black bg-opacity-30 z-1000" @click.self="close">
      <div class="relative h-full w-full mx-auto">
        <div class="fixed <sm:(top-0 bg-white) sm:top-1/6 w-full mx-auto overflow-y-auto h-full">
          <div class="relative mx-auto max-w-screen-lg h-16">
            <button v-if="showCloseButton" aria-label="close" 
                class="absolute top-2 right-4 text-xl border rounded-full dark:border-gray-600 border-gray-700 text-gray-700
              dark:text-gray-600 hover:bg-gray-700 dark-hover:bg-gray-600 hover:text-white dark-hover:text-black
                h-8 w-8 md:h-12 md:w-12 focus:outline-none"
                @click.prevent="close">
              <font-awesome :icon="['fas', 'times']"></font-awesome>
            </button>
          </div>
          <slot/>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    showModal: {
      required: true,
      type: Boolean
    },
    showCloseButton: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>