<template>
  <div>
    <div v-if="showModal" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex ">
      <div class="relative w-auto my-2 mx-auto max-w-6xl">
        <!--content-->
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-700 outline-none focus:outline-none">
          <!--header-->
          <div v-if="title" class="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
            <h3 class="text-3xl font-semibold">
                {{title}}
            </h3>
            <button class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" v-on:click="toggleModal()">
              <span class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <!--body-->
          <div class="relative pt-3 px-3 flex-auto">
              <div class="max-h-3/4-screen overflow-y-auto">
                <slot></slot>
              </div>
          </div>
          <!--footer-->
          <div class="flex items-center justify-end p-1 md:p-2 dark:bg-gray-600 bg-gray-100 rounded-b">
            <p v-if="footerContent" class="my-4 text-gray-600 text-lg leading-relaxed">
                {{footerContent}}
            </p>
            <button class="bg-red-400 dark:bg-red-500 bg-transparent text-white hover:bg-red-500 dark:hover:bg-red-400 hover:text-white 
                            uppercase text-sm px-3 py-1 md:py-2 rounded outline-none focus:outline-none mr-1 mb-1" 
                    type="button" style="transition: all .15s ease" v-on:click="toggleModal()">
              Close
            </button>
            <!-- <button class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1" type="button" style="transition: all .15s ease" v-on:click="toggleModal()"> -->
              <!-- Save Changes -->
            <!-- </button> -->
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script>
export default {
    name: "large-modal",
    props: {
        title: String,
        footerContent: String
    },
    data() {
        return {
            showModal: false
        }
    },
    methods: {
        toggleModal: function () {
            this.showModal = !this.showModal;
        }
    }
}
</script>