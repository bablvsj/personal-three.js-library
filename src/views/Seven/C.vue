<template>
    <div style="position: relative;">
        <div ref="canvasDom" id="sevenC" style="height: 800px;z-index:1 ;position: relative;"></div>
        <!-- <div style="position: absolute;z-index:999;top:0;right: 0;cursor: pointer;" @click="exportCanvas">导出</div> -->
    </div>
</template>
  
<script lang="ts" setup name="SevenC">
/* eslint-disable */
import { ref, onMounted } from 'vue';
import Floors from '@/modules/Floors';
import * as THREE from 'three';
import gsap from 'gsap';
import Event from '@/modules/Viewer/Events';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import { startProgress, closeProgress } from "@/utils/nprogress"


//场景
const scene = new THREE.Scene()

//镜头
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(100, 1000, 100)    //镜头视角点设置
camera.lookAt(0, 0, 0)



//生成圆弧顶点
const createArcVertex = () => {
    const geometry = new THREE.BufferGeometry(); //创建一个几何体对象    
    const R = 100;                               //圆弧半径
    const N = 10;                                //分段数量（ N控制圆弧精度：就是创建多少个顶点 ）
    const sp = 2 * Math.PI / N;                  //两个相邻点间隔弧度

    // 批量生成圆弧上的顶点数据
    const arr = [];
    // N控制圆弧精度：就是创建多少个顶点
    // for (let i = 0; i < N; i++) {
    //     const angle =  sp * i;//当前点弧度
    //     // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
    //     const x = R * Math.cos(angle);
    //     const y = R * Math.sin(angle);
    //     arr.push(x, y, 0);//xyz坐标
    // }

    // 设置圆心坐标
    const cx = 0;
    const cy = 50;
    for (let i = 0; i < N + 1; i++) {
        const angle = sp * i;//当前点弧度
        const x = cx + R * Math.cos(angle);
        const y = cy + R * Math.sin(angle);
        arr.push(x, y, 0);
    }

    //类型数组创建顶点数据
    const vertices = new Float32Array(arr);
    // 创建属性缓冲区对象
    //3个为一组，表示一个顶点的xyz坐标
    const attribue = new THREE.BufferAttribute(vertices, 3);
    // 设置几何体attributes属性的位置属性
    geometry.attributes.position = attribue;

    // 线材质
    const material = new THREE.LineBasicMaterial({
        color: 0xff0000 //线条颜色
    });
    // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
    // const line = new THREE.Line(geometry, material); 
    const line = new THREE.LineLoop(geometry, material);//线条模型对象

    scene.add(line)
}

const createGeometry = () => {
    const geometry = new THREE.BufferGeometry(); //创建一个几何体对象

    const pointsArr = [
        // 三维向量Vector3表示的坐标值
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 100, 0),
        new THREE.Vector3(0, 100, 100),
        new THREE.Vector3(0, 0, 100),
    ];

    const pointsArrt = [
        // 三维向量Vector2表示的坐标值
        new THREE.Vector2(0, 0),
        new THREE.Vector2(100, 0),
        new THREE.Vector2(100, 100),
        new THREE.Vector2(0, 100),
    ];

    // const geo


    geometry.setFromPoints(pointsArr)
    

    // 线材质
    const material = new THREE.LineBasicMaterial({
        color: 0x0000ff //线条颜色
    });
    // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
    // const line = new THREE.Line(geometry, material); 
    const geo = new THREE.LineLoop(geometry, material);//线条模型对象
    geo.position.set(0,0,-100)

    const geo2 = geo.clone()
    geo2.geometry = geo.geometry.clone()
    geo2.material = geo.material.clone()
    geo2.material.color.set(0x00ffff)

    geo2.geometry.setFromPoints(pointsArrt)

    scene.add(geo,geo2)

}





const wlRed = new URL('@/assets/images/textTure/wenli_red.jpg', import.meta.url).href
const wlImg1 = new URL('@/assets/images/textTure/wenli_gray.jpg', import.meta.url).href
const wlImg2 = new URL('@/assets/images/textTure/wenli2.jpg', import.meta.url).href
const wlImg3 = new URL('@/assets/images/textTure/wenli3.jpg', import.meta.url).href

//渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: false,//想把canvas画布上内容下载到本地，需要设置为true
    preserveDrawingBuffer: true,
    logarithmicDepthBuffer: true // 设置对数深度缓冲区，优化深度冲突问题   当两个面间隙过小或重合时，对数深度缓冲区无效
})

renderer.setClearColor(0xffc0cb, 1);
renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, renderer.domElement)

//网格地面
const gridHelper = new THREE.GridHelper(1000, 20)
scene.add(gridHelper)

// 渲染函数
const render = () => {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(render)
}


onMounted(() => {
    startProgress()
    createArcVertex()
    createGeometry()
    initModel()
    addLight()
    document.getElementById("sevenC")?.appendChild(renderer.domElement);
    render()
})

const addLight = () => {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 0, 100)
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(0, 0, -100);
    const light3 = new THREE.DirectionalLight(0xffffff, 1);
    light3.position.set(100, 0, 0);
    const light4 = new THREE.DirectionalLight(0xffffff, 1);
    light4.position.set(-100, 0, 0);
    const light5 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, 100, 0);
    const light10 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, -100, 0);
    const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
    light6.position.set(50, 100, 0);
    const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
    light7.position.set(0, 100, 50);
    const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
    light8.position.set(0, 100, -50);
    const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
    light9.position.set(-50, 100, 0);
    scene.add(light,
        light2,
        light3,
        light4,
        light5,
        light6,
        light7,
        light8,
        light9,
        light10,
    );
}

const exportCanvas = () => {

    const link = document.createElement('a');
    const canvas = renderer.domElement; //获取canvas对象
    link.href = canvas.toDataURL("image/png");
    // 通过超链接herf属性，设置要保存到文件中的数据
    link.download = 'threejs.png'; //下载文件名
    link.click(); //js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
}

const initModel = () => {
    //加载gltf模型
    const loader = new GLTFLoader()
    loader.load(`../../../public/models/porsche_911_930_turbo.glb`, (gltf) => {  //传id让其点击不同商品展示不同模型 id对应商品的id
        const bmw = gltf.scene
        const mesh = gltf.scene.children[0]; //获取Mesh

        bmw.scale.set(20, 20, 20); //模型缩放
        scene.add(bmw) //将整个模型组添加到场景中
    }, (xhr) => {
        const percent = xhr.loaded / xhr.total;
        percent == 1 && closeProgress()
    })
}


window.onresize = function () {
    const width = window.innerWidth; //canvas画布高度
    const height = window.innerHeight; //canvas画布宽度
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

</script>
  
<style scoped>
#three {
    height: 100%;
    width: 100%;
}
</style>
  