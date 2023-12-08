<template>
  <!-- Main Sidebar -->

  <div style="height: 50px; width: 100vw;display:flex;justify-content:space-between;align-items:center;padding: 0 20px;">
    <div style="width: 80%;"><a-menu theme="light" mode="horizontal" v-model:selectedKeys="current" :items="menuList" @click="handleClick"  subMenuCloseDelay=".5" >
     
    </a-menu></div>
    <DashboardHeader ></DashboardHeader>

     <!-- <a-menu-item v-for="(item, index) in menuList" class="menu-item">
        <router-link :to="item.url">
          <span class="icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z"
                fill="#111827"
              />
              <path
                d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z"
                fill="#111827"
              />
              <path
                d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z"
                fill="#111827"
              />
            </svg>
          </span>
          <span class="label">{{ item.label }}</span>
        </router-link>
      </a-menu-item> -->
  </div>

  <!-- / Main Sidebar -->
</template>

<script setup>
import { h,ref } from 'vue'
import { useRouter } from 'vue-router'
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue'
import DashboardHeader from '../Headers/DashboardHeader.vue'
// import type { MenuProps, ItemType } from 'ant-design-vue'

const router = useRouter()

const current = ref(['mail']);

const menuList = [
  {
    key: 'mail',
    icon: () => h(MailOutlined),
    label: 'Home',
    title: 'Home',
    url:"/home"
  },
  {
    key: 'app',
    icon: () => h(AppstoreOutlined),
    label: 'Basic',
    title: 'Basic',
    children: [
      {
        type: 'group',
        label: '基础',
        children: [
          { label: '模型对象-F', url: '/sevenF', desc: '2222222222',key:"basic-1" },
          { label: '层级模型-B', url: '/sevenB', desc: '2222222222',key:"basic-2" },
          { label: '纹理贴图-A', url: '/sevenA', desc: '2222222222' ,key:"basic-3"},
          { label: '灯光阴影 - gui', url: '/lightShadow', desc: '灯光 + 阴影' ,key:"basic-4"},
          {
            label: '渲染器和前端UI-E',
            url: '/sevenE',
            desc: 'canvas导出图片、模型进度条、渲染部分配置、GLTF模型加载 ',key:"basic-5"
          },
          { label: '曲线几何体-C', url: '/sevenC', desc: '2222222222',key:"basic-6"},
          { label: 'sprite-H', url: '/sevenH', desc: '精灵模型' ,key:"basic-7"},
          { label: '射线Ray-I', url: '/sevenI', desc: '射线Ray、后处理(发光描边)',key:"basic-8" },
          { label: '关键帧动画-G', url: '/sevenG', desc: '场景标注标签信息' ,key:"basic-9"}
        ]
      }
    ]
  },
  {
    key: 'sub1',
    icon: () => h(SettingOutlined),
    label: 'Advanced',
    title: 'Advanced',
    children: [
      {
        type: 'group',
        label: '进阶',
        children: [
          // {
          //   label: 'Option 2',
          //   key: 'setting:2'
          // },
          { label: '八月-C', url: '/eightC', desc: '相机模型' ,key:"advanced-1"},
          { label: '八月-A', url: '/eightA', desc: 'tween.js',key:"advanced-2" },
          { label: '八月-B', url: '/eightB', desc: 'tween.js',key:"advanced-3" }
        ]
      }
    ]
  }
  // {
  //   key: 'alipay',
  //   label: h('a', { href: 'https://antdv.com', target: '_blank' }, 'Link'),
  //   title: 'Link',
  // },
  // { label: "Home", url: "/home", desc: "2222222222" },
]

const props = defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false
  },

  // Main sidebar color.
  sidebarColor: {
    type: String,
    default: 'primary'
  },

  // Main sidebar theme : light, white, dark.
  sidebarTheme: {
    type: String,
    default: 'light'
  }
})

const handleClick = (e) => {
  console.log()
  let url = e.item.url
  if(url) router.push(url)
}
</script>

<style scoped>
.menu-item {
  margin-bottom: 10px;
}
</style>

<style  >
  .ant-menu-horizontal > .ant-menu-submenu-selected{
    border-bottom: none;
  }
</style>
