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
import { linkList } from '@/router/link.js'
export default {
  data() {
    return {
      linkList: linkList
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
