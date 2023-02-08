<template>
  <div class="index">
    <ul>
      <li v-for="(item, key) in linkList" :key="key">
        <router-link :to="item.path">
          {{ key + 1 }}、{{ item.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      linkList: [
        {
          title: '正方体点云数据动态加载【Points】',
          path: '/pointCloudCube'
        },
        {
          title: '正方体辉光效果【UnrealBloomPass】',
          path: '/glowCube'
        },
        {
          title: '正方体呼吸灯效果【OutlinePass】',
          path: '/breathingLamp'
        },
        {
          title: '正方体选中提示【CSS2DRenderer】',
          path: '/CSS2DRenderer'
        }, {
          title: '物料贴图【TextureLoader】',
          path: '/TextureLoader'
        },
        {
          title: '地板【PlaneGeometry】',
          path: '/PlaneGeometry'
        },
        {
          title: '坐标轴示意图【AxesHelper】',
          path: '/coordinates'
        },
        {
          title: '测试',
          path: '/test'
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.index {
  ul {
    li {
      padding: 10px 20px;
      a {
        text-decoration: none;
      }
    }
  }
}
</style>
