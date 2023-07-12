<template>
  <div class="header-nav">
    <router-link class="li" :class="activeIndex === index ? 'nav-actived' : ''" v-for="(item, index) in navList"
      :to="item.url" :key="index" @click="handleClickNav(index)">{{ item.label }}</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navList = [
  { label: "Home", url: "/home" },
  { label: "几何体E", url: "/sevenE" },
  { label: "模型对象F", url: "/sevenF" },
  { label: "层级模型B", url: "/sevenB" },
  { label: "纹理贴图A", url: "/sevenA" },
  { label: "GLTF C", url: "/sevenC" },
  { label: "Gui D", url: "/sevenD" },
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

  .li {
    margin-right: 20px;
    cursor: pointer;
  }

  .nav-actived {
    color: pink;
  }
}
</style>
