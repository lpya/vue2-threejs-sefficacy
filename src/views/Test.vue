<template>
  <div class="tempalte">
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

export default {
  data() {
    return {
      scene: null, // 场景
      camera: null, // 相机
      renderer: null, // 初始渲染
      stats: null, // 性能
      composer: null,
      cube: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      const el = document.getElementById('container');
      this.initScene();
      this.initCamera();
      this.initRenderer(el);
      this.initCube();
      // this.initBloomPass()
      this.initOutlinePass();
      this.initOrbitControls();
      // this.initAxesHelper();
      this.initPlane()
      this.render();
      this.requestAnimationFrame();
    },
    // 场景
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('#000000');
    },
    // 相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.set(2, 5, 2);
    },
    // 渲染器
    initRenderer(el) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio)

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      el.appendChild(this.renderer.domElement);
    },
    initPlane() {
      const floorMaterial = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide
      });
      const floorGeometry = new THREE.PlaneGeometry(12, 12);
      const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
      floorMesh.rotation.x -= Math.PI * 0.5;
      floorMesh.position.y -= 1.5;
      this.scene.add(floorMesh);
    },
    // 立方体
    initCube() {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      this.cube = new THREE.Mesh(geometry, material);
      this.scene.add(this.cube);
      this.camera.position.z = 5;
    },
    // 呼吸光
    initOutlinePass() {
      let renderScene = new RenderPass(this.scene, this.camera);
      let outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        this.scene,
        this.camera,
        [this.cube]
      );
      // 将此通道结果渲染到屏幕
      outlinePass.renderToScreen = true
      outlinePass.edgeGlow = 1 // 发光强度
      outlinePass.usePatternTexture = false // 是否使用纹理图案
      outlinePass.edgeThickness = 2 // 边缘浓度
      outlinePass.edgeStrength = 5 // 边缘的强度，值越高边框范围越大
      outlinePass.pulsePeriod = 2// 闪烁频率，值越大频率越低
      outlinePass.visibleEdgeColor.set('#ffff00') // 呼吸显示的颜色
      outlinePass.hiddenEdgeColor.set('#ff0000') // 不可见边缘的颜色
      // 将通道加入组合器
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(renderScene);
      this.composer.addPass(outlinePass);
    },
    // 炫光
    initBloomPass() {
      let renderScene = new RenderPass(this.scene, this.camera);
      let bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      bloomPass.renderToScreen = true;
      bloomPass.threshold = 0;
      bloomPass.strength = 1;
      bloomPass.radius = 0;
      this.composer = new EffectComposer(this.renderer);
      this.composer.setSize(window.innerWidth, window.innerHeight);
      this.composer.addPass(renderScene);
      this.composer.addPass(bloomPass);
    },
    // 缩放
    initOrbitControls() {
      let controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.maxDistance = 10;
      controls.addEventListener('change', this.render);
    },
    // 坐标轴
    initAxesHelper() {
      const axes = new THREE.AxesHelper(2000);
      this.scene.add(axes);
    },
    requestAnimationFrame() {
      this.composer.render();
      requestAnimationFrame(this.requestAnimationFrame);
    },
    // 渲染
    render() {
      this.renderer.render(this.scene, this.camera);
    }
  }
};
</script>
