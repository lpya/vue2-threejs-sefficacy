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
          title: '测试',
          path: '/test'
        },
        {
          title: '正方体点云数据动态加载【Points】',
          path: '/pointCloudCube'
        },
        {
          title: '立方体辉光效果【UnrealBloomPass】',
          path: '/glowCube'
        },
        {
          title: '立方体呼吸灯效果【OutlinePass】',
          path: '/breathingLamp'
        },
        {
          title: '立方体选中提示【CSS2DRenderer】',
          path: '/CSS2DRenderer'
        },
        {
          title: '坐标轴示意图',
          path: '/coordinates'
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
