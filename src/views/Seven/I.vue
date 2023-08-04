<!-- eslint-disable indent -->

<template>
    <div ref="canvasDom" id="sevenI" style="height: 800px;"></div>
</template>
  
<script setup name="SevenI" >
/* eslint-disable */
let stats;
let grid;


const wheels = [];
import { ref, onMounted, onUnmounted, } from 'vue';
import Floors from '@/modules/Floors';
import * as THREE from 'three';
import gsap from 'gsap';
import Event from '@/modules/Viewer/Events';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// 引入OutlinePass通道
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';   // FXAA抗锯齿Shader
// SMAA相比较FXAA抗锯齿效果更好一些
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';   // SMAA抗锯齿Shader   


let scene, camera, renderer, composer;
let object;
const widthI = window.innerWidth, heightI = window.innerHeight

let outlinePass;

const params = {
    edgeStrength: 3.0,
    edgeGlow: 0.0,
    edgeThickness: 1.0,
    pulsePeriod: 0,
    usePatternTexture: false
};



//场景
scene = new THREE.Scene()

renderer = new THREE.WebGLRenderer({ antialias: false })  //setAlpha让其可设置透明度
renderer.setSize(widthI, heightI)
renderer.setClearColor('#cccccc');

camera = new THREE.PerspectiveCamera(45, widthI / heightI, 0.1, 3000)
camera.position.set(0, 500, 1000);
camera.lookAt(100, 0, 100);

const controls = new OrbitControls(camera, renderer.domElement)

const gridHelper = new THREE.GridHelper(1000, 20, 0xDB2A2D, 0xdddddd)
scene.add(gridHelper)

const group1 = new THREE.Group()

const geometry = new THREE.BoxGeometry(40, 40, 100);
const material = new THREE.MeshPhongMaterial({ color: '#254EDB', flatShading: true });
const material3 = new THREE.MeshPhongMaterial({ color: '#3366FF' });
const material4 = new THREE.MeshPhongMaterial({ color: '#3366FF' });
const mesh3 = new THREE.Mesh(geometry, material);
const mesh4 = new THREE.Mesh(geometry, material3);
const mesh5 = new THREE.Mesh(geometry, material4);
mesh4.position.set(100, 0, 0)
mesh5.position.set(200, 0, 0)
group1.position.set(100, 100, -150)
group1.add(mesh3, mesh4, mesh5)
scene.add(group1);

renderer.domElement.addEventListener('click', function (event) {
    // .offsetY、.offsetX以canvas画布左上角为坐标原点,单位px
    const px = event.offsetX;
    const py = event.offsetY;
    //屏幕坐标px、py转WebGL标准设备坐标x、y
    //width、height表示canvas画布宽高度
    const x = (px / widthI) * 2 - 1;
    const y = -(py / heightI) * 2 + 1;
    //创建一个射线投射器`Raycaster`
    const raycaster = new THREE.Raycaster();
    //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
    // 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    //.intersectObjects([mesh1, mesh2, mesh3])对参数中的网格模型对象进行射线交叉计算
    // 未选中对象返回空数组[],选中一个对象，数组1个元素，选中两个对象，数组两个元素
    const intersects = raycaster.intersectObjects([mesh3, mesh4, mesh5]);
    console.log("射线器返回的对象", intersects);
    // intersects.length大于0说明，说明选中了模型
    if (intersects.length > 0) {
        // 选中模型的第一个模型，设置为红色
        intersects[0].object.material.color.set(0xff0000);
    }
})




const effectComposerBlock = () => {
    //创建模型
    const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
    const boxMaterial = new THREE.MeshLambertMaterial({
        color: 0x6690FF
    })
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(40, 40, 100);
    const material = new THREE.MeshPhongMaterial({ color: '#254EDB', flatShading: true });
    const material2 = new THREE.MeshPhongMaterial({ color: '#3366FF' });
    const mesh = new THREE.Mesh(geometry, material);
    const mesh2 = new THREE.Mesh(geometry, material2);
    mesh.position.set(150, 0, 0)
    mesh2.position.set(250, 0, 0)
    group.position.set(-450, 100, -450)
    group.add(mesh2, mesh, box)
    scene.add(group);

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    outlinePass = new OutlinePass(new THREE.Vector2(widthI, heightI), scene, camera);
    //模型描边颜色，默认白色         
    outlinePass.visibleEdgeColor.set(0xffff00);
    //高亮发光描边厚度
    outlinePass.edgeThickness = 1;
    //高亮描边发光强度
    outlinePass.edgeStrength = 10;
    //模型闪烁频率控制，默认0不闪烁
    outlinePass.pulsePeriod = 0;

    outlinePass.selectedObjects = [group];
    composer.addPass(outlinePass);


    const ray = new THREE.Ray()
    ray.origin.set(1, 0, 3)
    // ray.direction = new THREE.Vector3(100,100,100)
    // 表示射线沿着x轴正方向
    // ray.direction = new THREE.Vector3(1, 0, 0);
    // 表示射线沿着x轴负方向
    ray.direction = new THREE.Vector3(-1, 0, 0);

    ray.direction = new THREE.Vector3(5, 0, 0).normalize();//.direction的值需要是单位向量，不是的话可以执行.normalize()归一化或者说标准化。

    // 表示射线沿着xy坐标轴的中间线
    ray.direction = new THREE.Vector3(1, 1, 0).normalize();

    // 三角形三个点坐标
    const p1 = new THREE.Vector3(100, 25, 0);
    const p2 = new THREE.Vector3(100, -25, 25);
    const p3 = new THREE.Vector3(100, -25, -25);
    const point = new THREE.Vector3();//用来记录射线和三角形的交叉点
    // `.intersectTriangle()`计算射线和三角形是否相交叉，相交返回交点，不相交返回null
    const result = ray.intersectTriangle(p1, p2, p3, false, point);
    console.log('交叉点坐标', point);
    console.log('查看是否相交', result);

    // const r = ray.intersectTriangle(p1, p2, p3, true, point);  //参数4设为true，表示进行背面剔除
    // console.log('查看是否相交', r);

    const raycaster = new THREE.Raycaster();
    console.log('射线属性', raycaster.ray);

    raycaster.ray.origin = new THREE.Vector3(-100, 0, 0)
    raycaster.ray.direction = new THREE.Vector3(1, 0, 0)

    const intersects = raycaster.intersectObjects([mesh, mesh2, box]);

    console.log("射线器返回的对象", intersects);
    // intersects.length大于0说明，说明选中了模型
    if (intersects.length > 0) {
        console.log("交叉点坐标", intersects[0].point);
        console.log("交叉对象", intersects[0].object);
        console.log("射线原点和交叉点距离", intersects[0].distance);
        intersects[0].object.material.color.set(0x041730);
    }










}




const render = () => {
    controls.update()
    requestAnimationFrame(render)
    renderer.render(scene, camera)
    composer.render();
}

onMounted(() => {
    effectComposerBlock()
    document.getElementById("sevenI")?.appendChild(renderer.domElement);
    addLight()
    render()
    // createGUI()
})


const addLight = () => {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(20, 30, 40)
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(-20, -30, -40);
    const light3 = new THREE.DirectionalLight(0xffffff, 1);
    light3.position.set(10, 0, 0);
    const light4 = new THREE.DirectionalLight(0xffffff, 1);
    light4.position.set(-10, 0, 0);
    const light5 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, 10, 0);
    const light10 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, -10, 0);
    const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
    light6.position.set(5, 10, 0);
    const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
    light7.position.set(0, 10, 5);
    const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
    light8.position.set(0, 10, -5);
    const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
    light9.position.set(-5, 10, 0);

    scene.add(light, light2, light3, light4, light5, light6, light7, light8, light9, light10);

    // const lightHelper = new THREE.DirectionalLightHelper(light, 10, 0xff0000)
    // scene.add(lightHelper)
}




const createGUI = () => {

    const gui = new GUI({ name: 'Pixel setting' });
    gui.add(params, 'edgeStrength', 0.01, 50).step(5).onChange(function (value) {

        outlinePass.edgeStrength = Number(value);

    });

    gui.add(params, 'edgeGlow', 0.0, 10).step(2).onChange(function (value) {

        outlinePass.edgeGlow = Number(value);

    });

    gui.add(params, 'edgeThickness', 1, 10).step(2).onChange(function (value) {

        outlinePass.edgeThickness = Number(value);

    });

    gui.add(params, 'pulsePeriod', 0.0, 10).step(2).onChange(function (value) {

        outlinePass.pulsePeriod = Number(value);

    });


    gui.add(params, 'usePatternTexture').onChange(function (value) {

        outlinePass.usePatternTexture = value;

    });

    const conf = {
        visibleEdgeColor: '#ffffff',
        hiddenEdgeColor: '#190a05',
    }

    gui.addColor(conf, 'visibleEdgeColor').onChange(function (value) {

        outlinePass.visibleEdgeColor.set(value);

    });

    gui.addColor(conf, 'hiddenEdgeColor').onChange(function (value) {

        outlinePass.hiddenEdgeColor.set(value);

    });

}

</script>
  
<style scoped>
#three {
    height: 100%;
    width: 100%;
}
</style>
