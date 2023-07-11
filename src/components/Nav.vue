<template>
    <div class="header-nav">
        <router-link class="li" :class="activeIndex===index?'nav-actived':''" v-for="(item, index) in navList" :to="item.url" :key="index" @click="handleClickNav(index)">{{ item.label }}</router-link>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';


const navList = [
  { label: "Home", url: "/home" },
  { label: "SevenA", url: "/sevenA" },
  { label: "层级模型B", url: "/sevenB" },
  { label: "SevenC", url: "/sevenC" },
  { label: "SevenD", url: "/sevenD" },
  { label: "几何体E", url: "/sevenE" },
  { label: "模型对象F", url: "/sevenF" },
];

const activeIndex = ref(0);

const handleClickNav = (index:number)=>{
  activeIndex.value = index;
};


</script>
  
<style lang="scss">

.header-nav {
  height: 100px;
  background-color: #FFF;
  font-size: 14px;
  display: flex;
  padding: 20px;
  .li {
    margin-right: 20px;
    cursor: pointer;
  }

  .nav-actived{
    color: pink;
  }
}

</style>
