<template>
  <div id="app">
    <!-- 显示 Loader 组件，传递 loading 状态 -->
    <transition name="fade">
            <Loader v-if="isLoading" :visible="isLoading" />
        </transition>
    
    <!-- 页面视图 -->
    <router-view class="view"></router-view>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      isLoading: false,  // 控制加载状态
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
      console.log('调用了加载方法');
      
      // 只有第一次进入 home 路由时才显示加载动画
      if (to.name === 'Home' && !this.hasVisitedHome) {
        console.log('进入了加载方法');
        this.isLoading = true;  // 显示加载动画
        // 模拟加载过程或实际加载数据
        setTimeout(() => {
          this.isLoading = false;  // 加载完毕后隐藏加载动画
          this.markVisitedHome();  // 设置 Vuex 状态为已访问
        }, 3000); // 模拟延迟，通常是异步数据加载
      } else {
        this.isLoading = false;  // 如果不是第一次访问 home，直接隐藏加载动画
      }
    }
  },
  mounted() {
     // 如果是刷新页面，状态已被重置，因此显示加载动画
     this.onRouteChange(this.$route);
  }
};
</script>

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
