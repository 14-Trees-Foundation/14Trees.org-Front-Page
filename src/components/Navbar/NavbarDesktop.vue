<template>
	<nav
		class="hidden md:block lg:block xl:block flex items-center justify-between flex-wrap container mx-auto py-3 z-20 dark:text-gray-400 dark:bg-dark-grey">
		<div class="block flex-grow flex items-center w-auto mx-4 py-1">
			<div class="block flex items-center w-auto mx-6">
				<div class="flex items-center flex-shrink-0 mr-3">
					<span class="font-semibold text-xl tracking-tight">{{ $static.metadata.siteName }}</span>
				</div>
				<div class="h-auto">
					<g-image src="~/assets/images/logo.png" height="40em" width="40em"></g-image>
				</div>
			</div>
			<div class="flex-grow pl-3 md:border-l md:border-gray-400 text-black dark:text-gray-400">
				<ul class="list-none flex justify-left">
					<li v-for="navItem in getNavItems" :key="navItem.name" class="px-4 py-1">
						<g-link class="block py-1" :to="navItem.link" :title="navItem.name"
							v-if="navItem.external!=true && navItem.children.length <=0">{{ navItem.name}}</g-link>
						<a class="block" :href="navItem.link" :title="navItem.name"
							v-if="navItem.external==true && navItem.children.length <=0">{{ navItem.name}}</a>
						<ClientOnly>
							<Popover placement="top" v-if="navItem.children.length > 0">
								<template slot="link">
									{{ navItem.name }}
									<font-awesome :icon="['fas', 'angle-down']"></font-awesome>
								</template>
								<template slot="popover">
									<ul>
										<li v-for="subItem in navItem.children" :key="subItem.name"
											class="px-4 py-2 submenu-item hover:text-white">
											<g-link class="block" :to="subItem.link" :title="subItem.name"
												v-if="subItem.external!=true">
												<div class="-m-3 p-4 flex items-start rounded hover:bg-gray-100 dark:hover:bg-darkish-grey transition duration-100 ease-in">
													<!-- Heroicon name: support -->
													<!-- <svg class="flex-shrink-0 h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
													</svg> -->
													<div class="ml-4">
														<div class="text-base text-md text-gray-900 dark:text-gray-300"> {{ subItem.name}} </div>
													<p v-if="subItem.description" class="mt-1 text-sm text-gray-500">
														{{subItem.description}}
													</p>
													</div>
												</div>
											</g-link>
											<a class="block" :href="subItem.link" :title="subItem.name"
												v-if="subItem.external==true">
												<div class="-m-3 p-4 flex items-start rounded hover:bg-gray-100 dark:hover:bg-darkish-grey transition duration-100 ease-in">
													<!-- Heroicon name: support -->
													<!-- <svg class="flex-shrink-0 h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
													</svg> -->
													<div class="ml-4">
														<div class="text-base text-md text-gray-900 dark:text-gray-300"> {{ subItem.name}} </div>
														<p v-if="subItem.description" class="mt-1 text-sm text-gray-500">
															{{subItem.description}}
														</p>
													</div>
												</div>
											</a>
										</li>
									</ul>
								</template>
							</Popover>
						</ClientOnly>
					</li>
					<li class="flex flex-grow justify-end">
						<button type="submit" class="flex flex-row btn-action text-white h-10
				 		bg-green-500 dark:bg-green-600 hover:bg-green-600 duration-500">
							<g-link to="/contribute" class="text-md flex">
								<div>
									<g-image src="~/assets/images/Planting.svg" class="w-4 mr-2 mt-1"></g-image>
								</div>
								<span>Contribute</span>
							</g-link>
						</button>
					</li>
				</ul>
			</div>

			<!-- <div class="inline-block">
				<ul class="list-none flex justify-center md:justify-end">
					<li class="mr-6">
              <search-button v-on="$listeners"></search-button>
            </li>
					<li>
						<theme-switcher v-on="$listeners" :theme="theme" />
					</li>
				</ul>
			</div> -->
		</div>
	</nav>
</template>

<static-query>
query {
  metadata {
    siteName
    headerNavigation {
      name
      link
      external
      children: sub {
        name
        link
        external
      }
    }
  }
  campaigns: allContentfulCampaign {
    edges {
      node {
        title
        heading
		subtitle
      }
    }
  }
}
</static-query>

<script>
import ThemeSwitcher from "~/components/Navbar/ThemeSwitcher.vue";
import SearchButton from "~/components/Navbar/SearchButton.vue";
import Popover from "~/components/Navbar/Popover.vue";

export default {
  data: function() {
    return {
      vcoConfig: {
        events: ["dblclick", "click"],
        isActive: true
	  },
    };
  },
  components: {
    ThemeSwitcher,
	SearchButton,
	Popover
  },
  props: {
    theme: {
      type: Number 
    },
    hideSubnav: {
      type: Boolean
    }
  },
  computed:{
	  getNavItems() {
			const navItems = this.$static.metadata.headerNavigation;
			const dummy = navItems.findIndex(it => it.name === "Dummy");
			if (dummy != -1) {
				navItems.splice(dummy, 1);
			}
			const campaigns = this.$static.campaigns.edges.map(edge=> {
				return {
					name: edge.node.heading,
					link: "/Projects/" + edge.node.title,
					description: edge.node.subtitle,
					external: false
				}
			})
			let ind = navItems.findIndex(it => it.name === "Projects");
			navItems[ind].children = campaigns;
			return navItems;
	  }
	}
};
</script>

