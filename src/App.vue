<template>
  <div id="app">
    <!-- 显示 Loader 组件，传递 loading 状态 -->
    <transition name="fade">
      <Loader v-if="isLoading" :visible="isLoading" />
    </transition>

    <!-- 页面视图，确保只有在加载完成后才显示 -->
    <!-- <transition name="fade"> -->
      <router-view class="view" v-if="isView"></router-view>
    <!-- </transition> -->
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      isLoading: false,  // 控制加载状态
      isView: false,   // 控制 router-view 是否渲染
    };
  },
  components: {
    Loader,
  },
  watch: {
    // 监听路由变化
    $route(to) {
      this.onRouteChange(to);
    }
  },
  computed: {
    ...mapState(['hasVisitedHome']), // 从 Vuex 中获取 hasVisitedHome 状态
  },
  methods: {
    ...mapActions(['markVisitedHome']), // 调用 Vuex 的 action
    onRouteChange(to) {

      
      // 只有第一次进入 home 路由时才显示加载动画
      if (to.name === 'Home' && !this.hasVisitedHome) {
  
        this.isLoading = true;  // 显示加载动画
        this.isView = false;  // 暂时隐藏 router-view
     
        // 模拟加载过程或实际加载数据
        setTimeout(() => {
         
          this.isLoading = false;  // 加载完毕后隐藏加载动画
          
          this.markVisitedHome();  // 设置 Vuex 状态为已访问
        }, 3000); // 模拟延迟，通常是异步数据加载
        setTimeout(() => {
          this.isView = true;  // 显示 router-view
        },4000)
      } else {
        this.isLoading = false;  // 如果不是第一次访问 home，直接隐藏加载动画
        this.isView = true;  // 显示 router-view
      }
    }
  },
  mounted() {
    // 如果是刷新页面，状态已被重置，因此显示加载动画
    this.onRouteChange(this.$route);
  }
};
</script>

<style scoped>
/* 给 loader 加上 fade 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>



<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

#app {
  background-color: var(--background-color);
  transition: background-color 0.5s ease, color 0.5s ease;
  height: 100vh;
  min-width: 320px;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

a {
  text-decoration: none !important;
  line-height: 0 !important;
}
</style>
