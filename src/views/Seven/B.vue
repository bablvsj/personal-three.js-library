<template>
    <div id="sevenB" style="height: 800px;"></div>
</template>
  
<script lang="ts" setup name="SevenB">
/* eslint-disable */
import { ref, onMounted, type Ref } from 'vue';
import Viewer, { type Animate } from '@/modules/Viewer';
import Floors from '@/modules/Floors';
import ModelLoader from '@/modules/ModelLoder';
import * as THREE from 'three';
import gsap from 'gsap';
import Event from '@/modules/Viewer/Events';
import BoxHelperWrap from '@/modules/BoxHelperWrap';

let viewer: Viewer;
let modelLoader: ModelLoader;
let boxHelperWrap: BoxHelperWrap;

const popoverRef: Ref = ref(null);
const popoverTop = ref(0);
const popoverLeft = ref(0);
const popoverData = ref<any>({});

let office: any = null;
let oldOffice: any = null;
let dataCenter: any = null;
let oldDataCenter: any = null;
let modelSelect = ['zuo0', 'zuo1', 'zuo2', 'zuo3', 'zuo4', 'zuo5'];
let modelSelectName = '';
let modelMoveName = '';
let isModelSelectName = false;


onMounted(() => {
    init();
    initModel();

    // viewer.scene.traverse((item: THREE.Object3D) => {
    //     console.log(item, '0000000000');
    // });
});

const init = () => {
    viewer = new Viewer('sevenB');
    viewer.addAxis();
    // viewer.addStats();
    viewer.initRaycaster();
    modelLoader = new ModelLoader(viewer);
    boxHelperWrap = new BoxHelperWrap(viewer);
};

const initModel = () => {
    modelLoader.loadModelToScene('/models/zuo.glb', baseModel => {
        console.log(baseModel, '1111111');
        baseModel.setScalc(0.2);
        // baseModel.object.rotation.y = Math.PI / 2;
        const model = baseModel.gltf.scene;
        model.position.set(0, 0, 0);
        model.name = '机房';
        baseModel.openCastShadow();

        dataCenter = baseModel;
        oldDataCenter = model.clone();

        const rackList: any[] = [];
        model.traverse(item => {
            if (item) {
                rackList.push(item);
            }
        });
        // console.log(rackList, 'rackList------');

        viewer.setRaycasterObjects(rackList);

    });
};

</script>
  
<style scoped>
#three {
    height: 100%;
    width: 100%;
}
</style>
  