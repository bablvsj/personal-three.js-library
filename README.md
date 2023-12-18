## 特性

本项目基于 Vue3 + Ts/Js + Vite +  [Ant Design Vue](https://antdv.com/components/overview) + Three.js 开发。

## Run

```node
npm install 
npm run dev
```

## Three.js开发资源

#### shader库

 <https://www.shadertoy.com/view/XstGWn>

## 推荐文章

1. 图解webgl <https://www.cnblogs.com/wanbo/p/6754066.html>
2. WebGI中文网 <http://www.hewebgl.com/article/getarticle/50>
3. Three.js journey Notes 第一部分：基础 <https://kwii.cc/threejs-basis/>

## 致敬

1. 最开始看到掘金博主[蝴蝶刀砍手大师](<https://stevenfeng.cn/threejs-demo/>)的文章[基于vue3+threejs实现可视化大屏](https://juejin.cn/post/7235906062301085757)，开始对Three.js感兴趣。

<!-- 个人操作：
 git提交操作：https://blog.csdn.net/qq_43183942/article/details/132236316
 还不错的后台UI：https://www.creative-tim.com/product/muse-vue-ant-design-dashboard-pro -->

<!-- ###### 模板

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
  </style> -->
  
<!-- ``` -->
