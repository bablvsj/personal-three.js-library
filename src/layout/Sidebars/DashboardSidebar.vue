<template>
	<!-- Main Sidebar -->
	<a-layout-sider collapsible class="sider-primary" breakpoint="lg" collapsed-width="0" width="250px"
		:collapsed="sidebarCollapsed" @collapse="$emit('toggleSidebar', !sidebarCollapsed)" :trigger="null"
		:class="['ant-layout-sider-' + sidebarColor, 'ant-layout-sider-' + sidebarTheme]" theme="light"
		:style="{ backgroundColor: 'transparent', }">
		<div class="brand cursor-point" @click="router.push('/home')"><img src="images/logo-ct-black.png" alt=""> <span>Muse Dashboard</span></div>
		<hr>

		<!-- Sidebar Navigation Menu -->
		<a-menu theme="light" mode="inline">
			<a-menu-item v-for="(item, index) in menuList" class="menu-item">
				<router-link :to="item.url">
					<span class="icon">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
								fill="#111827" />
							<path
								d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
								fill="#111827" />
							<path
								d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
								fill="#111827" />
						</svg>
					</span>
					<span class="label">{{ item.label }}</span>
				</router-link>
			</a-menu-item>
		</a-menu>
	</a-layout-sider>
	<!-- / Main Sidebar -->
</template>

<script setup>

import { useRouter } from "vue-router"

const router = useRouter()

const menuList = [
	// { label: "Home", url: "/home", desc: "2222222222" },
{ label: "模型对象-F", url: "/sevenF", desc: "2222222222" },
{ label: "层级模型-B", url: "/sevenB", desc: "2222222222" },
{ label: "纹理贴图-A", url: "/sevenA", desc: "2222222222" },
{ label: "Gui-D", url: "/sevenD", desc: "2222222222" },
{ label: "渲染器和前端UI-E", url: "/sevenE", desc: "canvas导出图片、模型进度条、渲染部分配置、GLTF模型加载 " },
{ label: "曲线几何体-C", url: "/sevenC", desc: "2222222222" },
{ label: "sprite-H", url: "/sevenH", desc: "精灵模型" },
{ label: "射线Ray-I", url: "/sevenI", desc: "射线Ray、后处理(发光描边)" },
{ label: "关键帧动画-G", url: "/sevenG", desc: "场景标注标签信息" },]

const props = defineProps({
	sidebarCollapsed: {
		type: Boolean,
		default: false,
	},

	// Main sidebar color.
	sidebarColor: {
		type: String,
		default: "primary",
	},

	// Main sidebar theme : light, white, dark.
	sidebarTheme: {
		type: String,
		default: "light",
	},
})
</script>

<style scoped>
	.menu-item{
		margin-bottom: 10px;
	}
</style>
