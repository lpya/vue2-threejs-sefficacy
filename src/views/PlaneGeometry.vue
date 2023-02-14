<template>
  <div class="planeGeometry">
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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
      this.initOrbitControls();
      this.initPlane()
      this.animation();
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
      this.camera.position.set(5, 5, 0);
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
    // 缩放
    initOrbitControls() {
      let controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.maxDistance = 15;
      controls.addEventListener('change', this.render);
    },
    // 渲染
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    // 动画帧
    animation() {
      this.render();
      requestAnimationFrame(this.animation);
    },
    // 地板
    initPlane() {
      const geometry = new THREE.PlaneGeometry(4, 8, 50, 50);
      geometry.rotateX(Math.PI / 2)
      const material = new THREE.MeshBasicMaterial({ color: '#cccccc', side: THREE.DoubleSide });
      const plane = new THREE.Mesh(geometry, material);
      this.scene.add(plane);
    }
  }
};
</script>
