<template>
  <div id="app" class="dark:bg-dark-grey min-h-screen flex flex-col">
    <navbar @setTheme="setTheme" :theme="this.theme"></navbar>
    <div class="flex-grow">
      <slot/>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<script>
import Navbar from "~/components/Navbar/Navbar.vue";
import VFooter from "~/components/Partials/Footer.vue";
export default {
  data: function() {
    return {
      theme: 0 
    };
  },
  components: {
    Navbar,
    VFooter
  },
  methods: {
    setTheme(mode) {
      this.theme = mode;
    }
  }
};
</script>