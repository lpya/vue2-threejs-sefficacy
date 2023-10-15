<template>
  <div class="tempalte">
    <div id="container"></div>
    <div ref="Label" class="tips">
      <div>立方体{{ selectBoxName }}</div>
      <div>长：2mm</div>
      <div>宽：2mm</div>
      <div>高：2mm</div>
    </div>
  </div>
</template>
<script>
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export default {
  data() {
    return {
      scene: null, // 场景
      camera: null, // 相机
      renderer: null, // 渲染器
      css2DRenderer: null, // 2D渲染器
      composer: null, // 效果合成器
      label: null, // label标签
      selectBoxName: null,
      stats: null
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.label.element.style.visibility = 'hidden';
    removeEventListener('click', this.clickFn)
  },
  methods: {
    // 初始化
    init() {
      const el = document.getElementById('container');
      this.initScene();
      this.initCamera();
      this.initRenderer(el);
      this.initStats(el);
      this.initCube();
      this.initOrbitControls();
      this.initCSS2DRenderer();
      this.initLabel();
      this.animation();
      addEventListener('click', this.clickFn);
      window.addEventListener('resize', this.onWindowResize);
    },
    // 场景
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('#000000');
    },
    // 性能
    initStats(el) {
      this.stats = new Stats();
      el.appendChild(this.stats.dom);
    },
    // 相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 0, 10);
    },
    // 渲染器
    initRenderer(el) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      el.appendChild(this.renderer.domElement);
    },
    // 立方体
    initCube() {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial({ color: '#00ffff' });
      let cube = new THREE.Mesh(geometry, material);
      for (let i = 0; i < 3; i++) {
        // 添加边框
        let cubesEdges = new THREE.EdgesGeometry(geometry, 1);
        let edgesMtl = new THREE.LineBasicMaterial({
          color: '#ffffff',
          linewidth: 3
        });
        let cubesLine = new THREE.LineSegments(cubesEdges, edgesMtl);

        let newCube = cube.clone();
        newCube.name = `cube${i}`;
        newCube.position.x = (i - 1) * 3;
        newCube.add(cubesLine);
        this.scene.add(newCube);
      }
    },
    // 呼吸光
    initOutlinePass(materialObj) {
      if (!materialObj) {
        this.composer = null
        return
      }
      let renderScene = new RenderPass(this.scene, this.camera);
      let outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        this.scene,
        this.camera,
        [materialObj]
      );
      // 将此通道结果渲染到屏幕
      outlinePass.renderToScreen = true;
      outlinePass.edgeGlow = 1; // 发光强度
      outlinePass.usePatternTexture = false; // 是否使用纹理图案
      outlinePass.edgeThickness = 2; // 边缘浓度
      outlinePass.edgeStrength = 6; // 边缘的强度，值越高边框范围越大
      outlinePass.pulsePeriod = 2; // 闪烁频率，值越大频率越低
      outlinePass.visibleEdgeColor.set('#ff0000'); // 呼吸显示的颜色
      outlinePass.hiddenEdgeColor.set('#ffff00'); // 不可见边缘的颜色
      // 将通道加入组合器
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(renderScene);
      this.composer.addPass(outlinePass);
    },
    // 缩放
    initOrbitControls() {
      let controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.maxDistance = 15;
      controls.addEventListener('change', this.render);
    },
    // 2D渲染器
    initCSS2DRenderer() {
      this.css2DRenderer = new CSS2DRenderer();
      this.css2DRenderer.setSize(window.innerWidth, window.innerHeight);
      this.css2DRenderer.domElement.style.position = 'absolute';
      this.css2DRenderer.domElement.style.top = '-150px';
      this.css2DRenderer.domElement.style.left = '0px';
      this.css2DRenderer.domElement.style.pointerEvents = 'none';
      document.body.appendChild(this.css2DRenderer.domElement);
    },
    // 获取dom
    getCSS2DObject(domEle) {
      let label = new CSS2DObject(domEle);
      domEle.style.pointerEvents = 'none';
      return label;
    },
    // 渲染
    render() {
      this.renderer.render(this.scene, this.camera);
      if (this.composer) {
        this.composer.render();
      }
      if (this.css2DRenderer) {
        this.css2DRenderer.render(this.scene, this.camera);
      }
      if (this.stats) {
        this.stats.update();
      }
    },
    // 自适应
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    // 动画帧
    animation() {
      this.render();
      requestAnimationFrame(this.animation);
    },
    // 标签
    initLabel() {
      let labelDomEle = this.$refs.Label;
      labelDomEle.style.visibility = 'hidden';
      this.label = this.getCSS2DObject(labelDomEle);
      this.scene.add(this.label);
    },
    // 点击事件
    clickFn(event) {
      let material = this.raycaster(event, this.scene.children);
      if (material.length <= 0) {
        return;
      }
      let selectBoxObj = null;
      material.forEach((item) => {
        if (item.object.type === 'Mesh') {
          if (!selectBoxObj) {
            selectBoxObj = item.object;
          }
        }
      });
      if (!selectBoxObj) {
        this.initOutlinePass(false)
        this.label.element.style.visibility = 'hidden';
        return;
      }
      this.initOutlinePass(selectBoxObj);
      this.selectBoxName = selectBoxObj.name
      this.label.element.style.visibility = 'visible';
      this.label.position.copy(selectBoxObj.position);
    },
    // 射线拾取
    raycaster(event, geometrys) {
      let x = (event.clientX / window.innerWidth) * 2 - 1;
      let y = -(event.clientY / window.innerHeight) * 2 + 1;
      let raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
      return raycaster.intersectObjects(geometrys);
    }
  }
};
</script>
<style lang='scss' scoped>
.tips {
  visibility: hidden;
  width: 200px;
  height: 100px;
  background-color: #a6f7f7;
  border: 1px solid #fff;
  padding: 10px;
  border-radius: 5px;
  div{
    margin-bottom: 4px;
  }
}
</style>
