<template>
  <div class="TextureLoader">
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
export default {
  data() {
    return {
      scene: null, // 场景
      camera: null, // 相机
      renderer: null // 渲染器
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
      this.initOrbitControls();
      this.render();
      window.addEventListener('resize', this.onWindowResize);
    },
    // 场景
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xcccccc);
    },
    // 相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.set(2, 5, 2);
    },
    // 渲染器
    initRenderer(el) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true // 开启抗锯齿
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      el.appendChild(this.renderer.domElement);
    },
    // 缩放
    initOrbitControls() {
      let controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.maxDistance = 10;
      controls.addEventListener('change', this.render);
    },
    // 渲染
    render() {
      this.renderer.render(this.scene, this.camera);
      // 动画帧
      requestAnimationFrame(this.render);
    },
    // 自适应
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    // 立方体
    initCube() {
      // 加载图片
      const texture = new THREE.TextureLoader().load('/image/1.jpg');
      // 设置立方体长宽高
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshMatcapMaterial({
        map: texture,
        color: 0xffffff
      });
      let cube = new THREE.Mesh(geometry, material);
      this.scene.add(cube);
    }
  }
};
</script>
