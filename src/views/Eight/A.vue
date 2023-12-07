<template>
  <div style="position:relative">
    <div ref="canvasDom" id="eightA" style="height: 800px"></div>
    <div class="btn-group" style="position:absolute;top:20px;right:20px;display:flex;cursor: pointer;" >
      <div @click="changeCamera('A')" class="bu">设备A</div>
      <div @click="changeCamera('B')" class="bu" style="margin-left: 10px">设备B</div>
      <!-- <div @click="changeCamera('car')" class="bu" style="margin-left: 10px">停车场</div> -->
      <div @click="changeCamera('all')" class="bu" style="margin-left: 10px">整体</div>
    </div>
  </div>
</template>

<script lang="ts" setup name="EightA">
/* eslint-disable */
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import TWEEN from '@tweenjs/tween.js'
import { Theme } from 'ant-design-vue'

const scene = new THREE.Scene() //场景
scene.background = new THREE.Color(0x1A1A1A);
scene.fog = new THREE.Fog(0x1A1A1A, 300, 1000);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000)
camera.position.set(100, 500, 100) //镜头视角点设置
camera.lookAt(0, 0, 0)




//纹理内容块
const textLoader = new THREE.TextureLoader() // 文件加载器

const wlRed = new URL('@/assets/images/textTure/wenli_red.jpg', import.meta.url).href
const wlImg1 = new URL('@/assets/images/textTure/wenli_gray.jpg', import.meta.url).href
const wlImg2 = new URL('@/assets/images/textTure/wenli2.jpg', import.meta.url).href
const wlImg3 = new URL('@/assets/images/textTure/wenli3.jpg', import.meta.url).href
const ttRed = textLoader.load(wlRed)
const texture1 = textLoader.load(wlImg1)
const texture2 = textLoader.load(wlImg2)
const texture3 = textLoader.load(wlImg3)
texture2.wrapS = THREE.RepeatWrapping
texture2.wrapT = THREE.RepeatWrapping
texture2.repeat.set(1, 1) // uv两个方向纹理重复数量

const geometryCircle = new THREE.SphereGeometry(20, 32, 16) //圆形
const materialCircle = new THREE.MeshBasicMaterial({
  // color: 0x016AB7,
  // side: THREE.FrontSide,
  // side:THREE.DoubleSide,
  // map:texture
  // transparent: true,//开启透明
  // opacity: 0.9,//设置透明度
})

const circleMesh = new THREE.Mesh(geometryCircle, materialCircle)
circleMesh.name = '圆模型'
circleMesh.position.set(-150, 20, -20)

const geometryPlane = new THREE.PlaneGeometry(1000, 1000)
//纹理贴图加载器TextureLoader
const materialPlane = new THREE.MeshBasicMaterial({
  // 设置纹理贴图：Texture对象作为材质map属性的属性值
  side: THREE.DoubleSide
  // transparent: true
})
const meshPlane = new THREE.Mesh(geometryPlane, materialPlane)

const geometry = new THREE.BoxGeometry(20, 120, 20)
const material = new THREE.MeshLambertMaterial()
const group = new THREE.Group()
group.name = '整体模型'

const mesh1 = new THREE.Mesh(geometry, material)
mesh1.name = 'A楼'
const mesh2 = mesh1.clone()
mesh2.material = mesh1.material.clone()
mesh2.name = 'B楼'
mesh2.position.set(200,0,200)
group.add(mesh1, mesh2, circleMesh)
group.position.set(0, 60, -80)
scene.add(group, meshPlane)


// ttRed.wrapS = THREE.RepeatWrapping //x轴平铺
// ttRed.wrapT = THREE.RepeatWrapping //z轴

// circleMesh.material.map = texture1
// mesh1.material.map = texture2
// mesh2.material.map = ttRed
// meshPlane.material.map = ttRed
// meshPlane.rotateX(-Math.PI / 2)

// const gridHelper = new THREE.GridHelper(1000, 25, 0x004444, 0x004444)
// gridHelper.position.y = 10
// scene.add(gridHelper)

//星球
const spherMaterial = new THREE.MeshLambertMaterial({color:0x03c03c,wireframe:true})
const spherGeometry = new THREE.SphereGeometry(80,32,32)
const planet = new THREE.Mesh(spherGeometry,spherMaterial)
planet.position.set(0,100,0)

//光环
const TorusGeometry = new THREE.TorusGeometry(150, 8, 2, 120);
const TorusMaterial = new THREE.MeshLambertMaterial({
  color: 0x40a9ff,
  wireframe: true
});
const ring = new THREE.Mesh(TorusGeometry, TorusMaterial);
ring.rotation.x = Math.PI / 2;
ring.rotation.y = -0.1 * (Math.PI / 2);
ring.position.set(0,100,0)




const iconGeometry = new THREE.IcosahedronGeometry(16,0)
const iconMaterial = new THREE.MeshToonMaterial({color:0xfffc00})
const satellite = new THREE.Mesh(iconGeometry,iconMaterial)
satellite.position.set(0,100,0)




const stars = new THREE.Group();
for (let i = 0; i < 500; i++) {
  const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0);
  const material = new THREE.MeshToonMaterial({ color: 0xeeeeee });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 700;
  mesh.position.y = (Math.random() - 0.5) * 700;
  mesh.position.z = (Math.random() - 0.5) * 700;
  mesh.rotation.x = Math.random() * 2 * Math.PI;
  mesh.rotation.y = Math.random() * 2 * Math.PI;
  mesh.rotation.z = Math.random() * 2 * Math.PI;
  stars.add(mesh);
}
// scene.add(stars,satellite,ring,planet);


const createParticlesByPoints = () => {
  const geom = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    size: 4,
    vertexColors: true,
    color: 0xffffff
  });
  let veticsFloat32Array = []
  let veticsColors = []
  for (let x = -15; x < 15; x++) {
    for (let y = -10; y < 10; y++) {
        veticsFloat32Array.push(x * 4, y * 4, 0);
        const randomColor = new THREE.Color(Math.random() * 0xffffff);
        veticsColors.push(randomColor.r, randomColor.g, randomColor.b);
    }
  }
  const vertices = new THREE.Float32BufferAttribute(veticsFloat32Array, 3);
  const colors = new THREE.Float32BufferAttribute(veticsColors, 3);
  geom.attributes.position = vertices;
  geom.attributes.color = colors;
  const particles = new THREE.Points(geom, material);
  scene.add(particles);
}

createParticlesByPoints()




// camera.position.set(202, 123, 125);
//相机飞行动画(从一个点飞到另一个点)
// onStart：动画开始执行触发
// onUpdate：动画执行过程中，一直被调用执行
// onComplete：动画正常执行完触发
// new TWEEN.Tween(camera.position)
// .to({x: 202,y: 123,z: 50}, 3000).onUpdate(function(){
//     camera.lookAt(0, 0, 0);  //相机飞行过程中重新计算相机视线
// }).start()

//相机圆周运动
// const R = 100 //相机圆周运动的半径
// new TWEEN.Tween({ angle: 0 })
//   .to({ angle: Math.PI * 2 }, 16000)
//   .onUpdate(function (obj) {
//     camera.position.x = R * Math.cos(obj.angle)
//     camera.position.z = R * Math.sin(obj.angle)
//     camera.lookAt(0, 0, 0)
//   })
//   .start()

const changeCamera = (type) => {
  // 相机飞行到的位置和观察目标拉开一定的距离
  if (type === 'A') {
    const A = scene.getObjectByName('A楼')
    const pos = new THREE.Vector3()
    A.getWorldPosition(pos) //获取三维场景中某个对象世界坐标
    const pos2 = pos.clone().addScalar(30)
    createCameraTween(pos2, controls.target)
  } else if (type === 'B') {
    const B = scene.getObjectByName('B楼')
    const pos = new THREE.Vector3()
    B.getWorldPosition(pos) //获取三维场景中某个对象世界坐标
    // 相机飞行到的位置和观察目标拉开一定的距离
    const pos2 = pos.clone().addScalar(30)
    // 相机从当前位置camera.position飞行三维场景中某个世界坐标附近
    createCameraTween(pos2, controls.target)
  } else {
    const cameraPos0 = new THREE.Vector3(100, 1400, 100)
    const target0 = new THREE.Vector3(100, 100, 100)
    // 切换整体预览状态
    createCameraTween(cameraPos0, target0)
  }
}

// 相机动画函数，从A点飞行到B点，A点表示相机当前所处状态
// pos: 三维向量Vector3，表示动画结束相机位置
// target: 三维向量Vector3，表示相机动画结束lookAt指向的目标观察点
const createCameraTween = (endPos, endTarget) => {
  new TWEEN.Tween({
    // 不管相机此刻处于什么状态，直接读取当前的位置和目标观察点
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
    tx: controls.target.x,
    ty: controls.target.y,
    tz: controls.target.z
  })
    .to(
      {
        // 动画结束相机位置坐标
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        // 动画结束相机指向的目标观察点
        tx: endTarget.x,
        ty: endTarget.y,
        tz: endTarget.z
      },
      2000
    )
    .onUpdate((obj) => {
      // 动态改变相机位置
      camera.position.set(obj.x, obj.y, obj.z)
      // 动态计算相机视线
      // camera.lookAt(obj.tx, obj.ty, obj.tz);
      controls.target.set(obj.tx, obj.ty, obj.tz)
      controls.update() //内部会执行.lookAt()
    })
    .start().easing(TWEEN.Easing.Sinusoidal.InOut)
}

//洒满灯光
const light = new THREE.AmbientLight(0xdeedff, 10)
light.position.set(200, 200, 200)
scene.add(light)
const light2 = new THREE.AmbientLight(0xdeedff, 10)
light2.position.set(-200, 200, 200)
scene.add(light2)
const light3 = new THREE.AmbientLight(0xdeedff, 10)
light3.position.set(-200, 200, -200)
scene.add(light3)
const light4 = new THREE.AmbientLight(0xdeedff, 10)
light4.position.set(200, 200, -200)
scene.add(light4)
const light9 = new THREE.AmbientLight(0xffffff, 10)
light9.position.set(0, 200, 0)
scene.add(light9)


const renderer = new THREE.WebGLRenderer({ antialias: false }) //渲染器 //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)


const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true  //移动惯性



let rot = 0;
// 动画
const axis = new THREE.Vector3(0, 0, 1);
const tick = () => {
  // 更新渲染器
  renderer.render(scene, camera);
  // 给网格模型添加一个转动动画
  rot += Math.random() * 0.8;
  const radian = (rot * Math.PI) / 180;
  // 星球位置动画
  planet && (planet.rotation.y += .005);
  // 星球轨道环位置动画
  ring && ring.rotateOnAxis(axis, Math.PI / 400);
  // 卫星位置动画
  satellite.position.x = 250 * Math.sin(radian);
  satellite.position.y = 100 * Math.cos(radian);
  satellite.position.z = -100 * Math.cos(radian);
  satellite.rotation.x += 0.005;
  satellite.rotation.y += 0.005;
  satellite.rotation.z -= 0.005;
  // 星星动画
  stars.rotation.y += 0.0009;
  stars.rotation.z -= 0.0003;
  // 更新控制器
  controls.update();
  // 页面重绘时调用自身
  window.requestAnimationFrame(tick);
}

// tick();


// 渲染函数
const render = () => {

  renderer.render(scene, camera)
  controls.update()
  TWEEN.update() //tween更新
//   console.log(pos.x, pos.y)
  requestAnimationFrame(render)
}

onMounted(() => {
  //渲染
  document.getElementById('eightA')?.appendChild(renderer.domElement)

  // 设置背景颜色并启用透明度
  renderer.setClearColor(0xffc0cb, 0.5)
  render()
})
</script>

<style scoped>
#three {
  height: 100%;
  width: 100%;
}
</style>
