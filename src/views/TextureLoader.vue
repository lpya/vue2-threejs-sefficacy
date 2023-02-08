<template>
  <div class="TextureLoader">
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { TextureAnimator } from 'three/examples/jsm/animation/'

export default {
  data() {
    return {
      scene: null, // 场景
      camera: null, // 相机
      renderer: null, // 渲染器
      composer: null // 效果合成器
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
      this.animation();
      window.addEventListener('resize', this.onWindowResize);
    },
    // 场景
    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('#ccc');
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
    // 立方体
    initCube() {
      const texture = new THREE.TextureLoader().load('2.webp');
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(1, 1)
      texture.needsUpdate = true
      //   annie = new TextureAnimator(texture, 10, 1, 10, 75);
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true
      });
      let cube = new THREE.Mesh(geometry, material);
      for (let i = 0; i < 3; i++) {
        let newCube = cube.clone();
        newCube.name = `cube${i}`;
        newCube.position.x = (i - 1) * 3;
        this.scene.add(newCube);
      }
    }
  }
};
</script>
