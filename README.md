致敬 源地址： <https://stevenfeng.cn/threejs-demo/>

ant design template <https://www.creative-tim.com/product/muse-vue-ant-design-dashboard-pro>   <https://github.com/creativetimofficial/muse-vue-ant-design-dashboard>

图解webgl <https://www.cnblogs.com/wanbo/p/6754066.html>

<http://www.hewebgl.com/article/getarticle/50>

vite脚手架 SSG构建静态网站 virtual:generated-layouts

cron 表达式 定时任务

1206---

antd4  : <https://antdv.com/components/typography>
<https://store.antdv.com/home>

three.js <https://kwii.cc/threejs-basis/>

ui: <https://demos.creative-tim.com/muse-vue-ant-design-dashboard-pro/documentation/layout/grid/>

tabler

shader 库: <https://www.shadertoy.com/view/XstGWn>

###### 模板

```js
<template>
    <div ref="canvasDom" id="sevenD" style="height: 800px"></div>
  </template>
  
  <script lang="ts" setup name="GroupCar">
  /* eslint-disable */
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import * as THREE from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
  
  //场景
  const scene = new THREE.Scene()
  
  
  const renderer = new THREE.WebGLRenderer({ antialias: true }) //setAlpha让其可设置透明度
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true; 
  
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
  camera.position.set(20, 100, 300) //镜头视角点设置
  camera.lookAt(0, 20, 100)
  const controls = new OrbitControls(camera, renderer.domElement)


  // scene.add(mesh

  
  
  // 渲染函数
  const render = () => {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
  }
  
  onMounted(() => {
    document.getElementById('sevenD')?.appendChild(renderer.domElement)
    // 设置背景颜色并启用透明度
    renderer.setClearColor(0xeeeeee, 1);
    render()
  })
  

  </script>
  
  <style scoped>
  #three {
    height: 100%;
    width: 100%;
  }
  </style>
  
```
