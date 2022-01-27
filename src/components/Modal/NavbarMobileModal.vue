<template>
	<div>
		<div class="overflow-x-hidden pt-5.5 px-4 dark:text-gray-400 bg-light-50 h-screen w-full">
			<h2 class="text-xl my-0">Navigation</h2>
			<div class="menu-links mt-4">
				<ul>
					<li v-for="navItem in getNavItems" :key="navItem.name" class="py-1">
						<g-link class="block py-1" :to="navItem.link" :title="navItem.name"
							v-if="navItem.external!=true && navItem.children.length <=0">
							{{ navItem.name}}
						</g-link>
						<a class="block" :href="navItem.link" :title="navItem.name"
							v-if="navItem.external==true && navItem.children.length <=0">
							{{ navItem.name}}
						</a>

						<ClientOnly>
							<popover-mobile placement="right" popoverClass="mobile-navbar-popover" offset="16"
								v-if="navItem.children.length > 0">
								<template slot="link">
								<a class="block py-1" style="cursor:pointer;">
									{{ navItem.name }}
									<font-awesome :icon="['fas', 'angle-right']"></font-awesome>
								</a>
								</template>
								<template slot="popover">
									<ul>
										<li v-for="subItem in navItem.children" :key="subItem.name"
											class="px-4 py-2 my-1 submenu-item bg-gray-50 dark:bg-darker-grey rounded-sm">
											<g-link class="block" :to="subItem.link" :title="subItem.name"
												v-if="subItem.external!=true">{{ subItem.name}}</g-link>
											<a class="block" :href="subItem.link" :title="subItem.name"
												v-if="subItem.external==true">{{ subItem.name}}</a>
										</li>
									</ul>
								</template>
							</popover-mobile>
						</ClientOnly>

					</li>
				</ul>
			</div>
		</div>
	</div>
</template>


<static-query>
query {
   metadata {
    siteName
    headerNavigation {
      name
      link
      external
      children : sub {
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
      }
    }
  }
}
</static-query>
<script>
import PopoverMobile from "~/components/Navbar/PopoverMobile.vue";

export default {
	components: {
		PopoverMobile
	},
	computed: {
		getNavItems() {
			const navItems = this.$static.metadata.headerNavigation;
			const dummy = navItems.findIndex(it => it.name === "Dummy");
			if (dummy != -1) {
				navItems.splice(dummy, 1);
			}
			const campaigns = this.$static.campaigns.edges.map(edge => {
				return {
					name: edge.node.heading,
					link: "/Projects/" + edge.node.title,
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

<style>
</style>