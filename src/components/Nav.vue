<template>
  <div class="header-nav">
    <router-link class="li" :class="activeIndex === index ? 'nav-actived' : ''" v-for="(item, index) in navList"
      :to="item.url" :key="index" @click="handleClickNav(index)">{{ item.label }}
      <p class="nav-desc" v-if="activeIndex === index">{{ item.desc || '' }}</p>
    </router-link>


  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navList = [
  { label: "Home", url: "/home", desc: "2222222222" },
  { label: "模型对象-F", url: "/basicF", desc: "2222222222" },
  { label: "层级模型-B", url: "/basicB", desc: "2222222222" },
  { label: "纹理贴图-A", url: "/basicA", desc: "2222222222" },
  { label: "Gui-D", url: "/basicD", desc: "2222222222" },
  { label: "渲染器和前端UI-E", url: "/basicE", desc: "canvas导出图片、模型进度条、渲染部分配置、GLTF模型加载 " },
  { label: "曲线几何体-C", url: "/basicC", desc: "2222222222" },
  { label: "sprite-H", url: "/basicH", desc: "精灵模型" },
  { label: "射线Ray-I", url: "/basicI", desc: "射线Ray、后处理(发光描边)" },
  { label: "关键帧动画-G", url: "/basicG", desc: "场景标注标签信息" },

];

const activeIndex = ref(0);

const handleClickNav = (index: number) => {
  activeIndex.value = index;
};

watch(() => router.currentRoute.value.path, (toPath) => {
  let index = navList.findIndex(m => m.url === toPath) || 0;
  activeIndex.value = index;
});
</script>
  
<style lang="scss">
.header-nav {
  height: 100px;
  background-color: #FFF;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  position: relative;

  .li {
    margin-right: 20px;
    cursor: pointer;
  }

  .nav-actived {
    color: pink;
  }

  .nav-desc {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: -20px;
    text-align: left;
    padding: 0 20px;
    color: #000;
    z-index: 999;
  }
}
</style>
