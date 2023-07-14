<!-- eslint-disable indent -->

<template>
    <div ref="canvasDom" id="sevenG" style="height: 800px;"></div>
</template>
  
<script setup name="SevenG" >
/* eslint-disable */
let stats;
let grid;

const wheels = [];
import { ref, onMounted } from 'vue';
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

//场景
const scene = new THREE.Scene()






//渲染器
const renderer = new THREE.WebGLRenderer({ antialias: false })  //setAlpha让其可设置透明度
renderer.setSize(window.innerWidth, window.innerHeight)
//镜头
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(100, 1000, 100)    //镜头视角点设置
camera.lookAt(0, 0, 0)
const controls = new OrbitControls(camera, renderer.domElement)

//网格地面
const gridHelper = new THREE.GridHelper(1000, 20)
scene.add(gridHelper)


const init = () => {
    // const container = document.getElementById('SevenG');

    // renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setAnimationLoop(render);
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 0.85;
    // renderer.useLegacyLights = false;
    // // container.appendChild(renderer.domElement);
    // // window.addEventListener('resize', onWindowResize);

    // stats = new Stats();
    // // container.appendChild(stats.dom);

    // //

    // // camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera.position.set(4.25, 1.4, - 4.5);

    // // controls = new OrbitControls(camera, container);
    // // controls.maxDistance = 9;
    // // controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
    // // controls.target.set(0, 0.5, 0);
    // // controls.update();

    // // scene = new THREE.Scene();
    // // scene.background = new THREE.Color(0x333333);
    // // scene.environment = new RGBELoader().load('textures/equirectangular/venice_sunset_1k.hdr');
    // // scene.environment.mapping = THREE.EquirectangularReflectionMapping;
    // // scene.fog = new THREE.Fog(0x333333, 10, 15);

    // grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
    // grid.material.opacity = 0.2;
    // grid.material.depthWrite = false;
    // grid.material.transparent = true;
    // scene.add(grid);

    // // materials

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03
    });

    const detailsMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, metalness: 1.0, roughness: 0.5
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
    });

    // const bodyColorInput = document.getElementById('body-color');
    // bodyColorInput.addEventListener('input', function () {

    //     bodyMaterial.color.set(this.value);

    // });

    // const detailsColorInput = document.getElementById('details-color');
    // detailsColorInput.addEventListener('input', function () {

    //     detailsMaterial.color.set(this.value);

    // });

    // const glassColorInput = document.getElementById('glass-color');
    // glassColorInput.addEventListener('input', function () {

    //     glassMaterial.color.set(this.value);

    // });

    // Car

    const wlImg3 = new URL('@/assets/images/ferrari_ao.jpg', import.meta.url).href

    const shadow = new THREE.TextureLoader().load(wlImg3);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load('../../../public/models/ferrari.glb', function (gltf) {

        const carModel = gltf.scene.children[0];
        const bmw = gltf.scene;

        console.log(bmw)


        carModel.getObjectByName('body').material = bodyMaterial;

        carModel.getObjectByName('rim_fl').material = detailsMaterial;
        carModel.getObjectByName('rim_fr').material = detailsMaterial;
        carModel.getObjectByName('rim_rr').material = detailsMaterial;
        carModel.getObjectByName('rim_rl').material = detailsMaterial;
        carModel.getObjectByName('trim').material = detailsMaterial;

        carModel.getObjectByName('glass').material = glassMaterial;

        wheels.push(
            carModel.getObjectByName('wheel_fl'),
            carModel.getObjectByName('wheel_fr'),
            carModel.getObjectByName('wheel_rl'),
            carModel.getObjectByName('wheel_rr')
        );

        // shadow
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
            new THREE.MeshBasicMaterial({
                map: shadow, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true
            })
        );
        mesh.rotation.x = - Math.PI / 2;
        mesh.renderOrder = 2;

        // mesh.scale.set(20, 20, 20)
        carModel.add(mesh);

        // bmw.scale.set(1000, 1000, 1000); //模型缩放
        carModel.scale.set(100, 100, 100)

        scene.add(carModel,bmw);
    });

}

const onWindowResize = () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

const render = () => {

    // circleMesh.rotation.y += Math.PI / 1000;
    // circleMesh.rotateZ(0.001)
    // textureCube.colorSpace = THREE.SRGBColorSpace;
    controls.update()
    requestAnimationFrame(render)

    const time = - performance.now() / 1000;

    for (let i = 0; i < wheels.length; i++) {

        wheels[i].rotation.x = time * Math.PI * 2;

    }

    // grid.position.z = - (time) % 1000;

    renderer.render(scene, camera);

    // stats.update();

}


onMounted(() => {
    document.getElementById("sevenG")?.appendChild(renderer.domElement);
    renderer.setClearColor(0xffc0cb, 0.5);
    render()
    addLight()
    init()
})

const addLight = () => {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 0, 10)
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(0, 0, -10);
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
</script>
  
<style scoped>
#three {
    height: 100%;
    width: 100%;
}
</style>
