<template>
  <div>
    <div ref="container"></div>
    <div id="c3d">
      <img class="c3d-img" src="@/assets/images/01.png" alt="">
      <div>文字测试</div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 创建场景、相机和CSS3D渲染器
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#202020'); // 设置背景颜色
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new CSS3DRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      this.$refs.container.appendChild(renderer.domElement);

      // 创建立方体DOM元素
      // const element = document.createElement('div');
      // element.style.width = '100px';
      // element.style.height = '100px';
      // element.style.background = 'red';
      const element = document.getElementById('c3d');

      // 创建CSS3D对象并将其添加到场景中
      const object = new CSS3DObject(element);
      scene.add(object);

      // 设置相机位置
      camera.position.z = 500;

      // 创建OrbitControls控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.minDistance = 100;
      controls.maxDistance = 1000;

      // 渲染循环
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update(); // 更新控制器状态
        renderer.render(scene, camera);
      };
      animate();
    }
  }
};
</script>

<style lang="scss">
#container {
  width: 100%;
  height: 100%;
  position: relative;
}

#c3d {
  height: 100px;
  width: 100px;
  // background: red;
  border: 1px solid red;

  .c3d-img {
    height: 50px;
    width: 50px;
  }

}
</style>
