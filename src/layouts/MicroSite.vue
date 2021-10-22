<template>
  <div id="app" class="dark:bg-dark-grey min-h-screen flex flex-col">
    <header class="relative">
    </header>
    <div class="flex-grow">
      <slot/>
    </div>
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
import VFooter from "~/components/Partials/Footer.vue";
export default {
  components: { VFooter },
};
</script>