<template>
  <component :is="navbarFixed ? 'a-affix' : 'div'" :offset-top="top">
    <a-breadcrumb>
      <a-breadcrumb-item><router-link to="/"> Pages</router-link></a-breadcrumb-item>
      <a-breadcrumb-item>{{ this.$route.name }}</a-breadcrumb-item>
    </a-breadcrumb>
  </component>
</template>

<script></script>
