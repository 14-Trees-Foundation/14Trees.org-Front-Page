<template>
  <div class="bg-fixed bg-cover" style="background-image: url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80')">
    <div class="relative">
      <g-link :to="'/'" class="absolute flex flex-row left-0 top-0 text-green-500 pt-2 pl-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
        </svg> <span> Back </span>
      </g-link>
    </div>

    <div class="full-page-nomargin md:p-12">
      <section class="xl:max-w-5xl md:max-w-3xl  text-gray-600 body-font mx-auto md:mt-40 pt-4 shadow-xl md:rounded-3xl bg-gray-900 bg-opacity-90">
        <h1 class="text-center mx-auto md:text-4xl text-gray-200 p-4">14 Trees Volunteers' Corner</h1>
        <div
          class="container  px-5 md:px-10 md:pb-10 mx-auto flex flex-col-reverse md:flex-wrap md:flex-row items-center">
          <div class="md:w-1/2 md:pr-16 lg:pr-0 pr-0">
            <div class="p-5">
              <div class="lg:w-4/5 mx-auto">
                <h2 class="md:text-xl xl:text-2xl font-medium title-font text-white">14 Trees Foundation is a non-profit
                  run by a team of volunteers who contribute time, energy and expertise to make this project a success.
                </h2>
                <p class="text-md font-medium title-font text-white">
                  If you would like to volunteer with 14 Trees Foundation, please reach out to us here.
                </p>
                <button
                  class="mt-8 w-full lg:w-64 btn-action btn-animate bg-green-500 hover:bg-green-600">Volunteer</button>
              </div>
            </div>
          </div>
          <div class="shadow-2xl md:w-5/12 bg-gray-800 md:rounded-lg p-6 flex flex-col md:ml-auto w-full md:mt-1">
            <h2 class="text-white text-lg font-medium title-font mb-5">Login</h2>
            <div class="relative mb-4">
              <label for="email" class="leading-7 text-sm text-gray-400">Email</label>
              <input type="email" id="email" name="email" v-model="email"
                class="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-green-900 rounded border border-gray-600 focus:border-green-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
            </div>
            <div class="relative mb-4">
              <label for="password" class="leading-7 text-sm text-gray-400">Password</label>
              <input type="password" id="password" name="password" v-model="password"
                class="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-green-900 rounded border border-gray-600 focus:border-green-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
            </div>
            <button @click="signin" class="btn-action btn-animate bg-green-500 hover:bg-green-600">Log In</button>
            <p class="text-xs text-red-400 mt-3" v-if="pageError.hasError">{{pageError.message}}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Repository from '@/repository/RepositoryFactory';

export default {
  components: {
  },
  data() {
    return {
      email: "",
      password: "",
      pageError: { hasError: false, message: "" },
    }
  },
  metaInfo() {
    return {
      title: "Volunteer" 
    };
  },
  mounted() {
  },
  methods: {
    async signin(e) {
      const authResult = await Repository.auth.signIn(this.email, this.password)
      console.log(authResult)
      if(authResult.error) {
        this.setError(authResult.error.code)
      }
      e.preventDefault()
    },
    setError(code) {
      switch(code) {
        case 'auth/wrong-password':
          this.pageError.message = "Wrong Username/Password"
          break;
        case 'auth/user-not-found':
          this.pageError.message = "No user with this email address"
          break;
      }
      this.pageError.hasError = true
    }
  }
};
</script>