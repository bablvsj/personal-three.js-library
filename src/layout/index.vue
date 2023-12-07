<template>
	<div>
		<a-layout class="layout-dashboard" id="layout-dashboard"
			:class="[navbarFixed ? 'navbar-fixed' : '', !sidebarCollapsed ? 'has-sidebar' : '', layoutClass]">
			<DashboardSidebar :sidebarCollapsed="sidebarCollapsed" :sidebarColor="sidebarColor" :sidebarTheme="sidebarTheme"
				@toggleSidebar="toggleSidebar"></DashboardSidebar>
			<!-- <a-layout>
				

			</a-layout> -->

			<!-- <DashboardHeader :sidebarCollapsed="sidebarCollapsed" :navbarFixed="navbarFixed"
					@toggleSettingsDrawer="toggleSettingsDrawer" @toggleSidebar="toggleSidebar"></DashboardHeader> -->
				<a-layout-content>
					<div style="height: calc(100vh - 60px);overflow: hidden;">
						<router-view />
					</div>
				</a-layout-content>

		</a-layout>
	</div>
</template>

<script setup lang="ts">

import DashboardSidebar from './Sidebars/DashboardSidebar.vue'

import DashboardFooter from './/Footers/DashboardFooter.vue'
import { ref } from 'vue'
// import DashboardSettingsDrawer from '@/components/Sidebars/DashboardSettingsDrawer';
const sidebarCollapsed = ref(false)
const sidebarColor = ref("primary")
const sidebarTheme = ref("light")
const navbarFixed = ref(false)
const showSettingsDrawer = ref(false)


const toggleSidebar = (value) => {
	sidebarCollapsed.value = value;
}
const toggleSettingsDrawer = (value) => {
	showSettingsDrawer.value = value;
}
const toggleNavbarPosition = (value) => {
	navbarFixed.value = value;
}
const updateSidebarTheme = (value) => {
	sidebarTheme.value = value;
}
const updateSidebarColor = (value) => {
	sidebarColor.value = value;
}

</script>


