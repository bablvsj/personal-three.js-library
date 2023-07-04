<template>
  <div class="header-nav">
    <router-link class="li" to="/home">Home</router-link>
    <router-link class="li" to="/sevenA">SevenA</router-link>
    <router-link class="li" to="/sevenB">SevenB</router-link>
  </div>
  <router-view />
</template>

<style lang="scss">
body,
html {
  background-color: #000;
}

body {
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 10px; */
  /* box-sizing: border-box; */
  /* width: 100%; */
}

.main {
  /* width: 100vw; */
  /* height: 100%; */
  /* background-image: linear-gradient(90deg, rgba(1, 53, 80, 0.3490196078) 1px, transparent 1px), linear-gradient(0deg, rgba(1, 53, 80, 0.3490196078) 1px, transparent 1px);
  background-size: 30px 30px, 30px 30px; */
  /* min-width: 850px; */
  /* box-sizing: border-box; */
}

.header-nav {
  height: 100px;
  background-color: #FFF;
  font-size: 14px;
  display: flex;
  padding: 20px;

  .li{
    margin-right: 20px;
    cursor: pointer;
  }
}</style>
