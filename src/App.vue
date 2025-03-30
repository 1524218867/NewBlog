<template>
  <div id="app">
    <!-- 显示 Loader 组件，仅在首次访问时显示 -->
    <transition name="fade">
      <Loader v-if="isLoading" :visible="isLoading" />
    </transition>

    <!-- 页面视图，使用Vue Router的过渡动画，仅在加载完成后显示 -->
    <transition name="fade">
      <router-view v-show="!isLoading" class="view"></router-view>
    </transition>
  </div>
</template>

<script>
import Loader from "@/components/Loader.vue";
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      isLoading: true,  // 默认显示加载动画
    };
  },
  components: {
    Loader,
  },
  computed: {
    ...mapState(['hasVisitedHome']), // 从 Vuex 中获取 hasVisitedHome 状态
  },
  methods: {
    ...mapActions(['markVisitedHome']), // 调用 Vuex 的 action
    initializeApp() {
      // 在首次访问或页面刷新时显示加载动画
      // 模拟资源加载过程
      setTimeout(() => {
        this.isLoading = false;  // 加载完毕后隐藏加载动画
        this.markVisitedHome();  // 设置 Vuex 状态为已访问
      }, 3000);
    }
  },
  mounted() {
    // 在组件挂载时初始化
    this.initializeApp();
  }
};
</script>

<style scoped>
/* 给 loader 和路由切换加上 fade 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

<style>
#app {
  background-color: var(--background-color);
  transition: background-color 0.5s ease, color 0.5s ease;
  /* height: 100vh; */
  min-width: 320px;
}

a {
  text-decoration: none !important;
  line-height: 0 !important;
}
.el-select-dropdown{
    background-color:  var(--background-color) !important;
    border:1px solid var(--border-color) !important;
    
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
  background-color: var(--card-background) !important;
}
.el-popper[x-placement^=top] .popper__arrow {
  border-top-color:var(--border-color) !important;
  /* background-color: var(--border-color) !important; */
}
.el-popper[x-placement^=top] .popper__arrow::after{
  border-top-color:var(--background-color) !important;
}
.el-card__header{
  border-bottom: 1px solid var(--border-color) !important;
}
.el-card{
  border: 1px solid var(--border-color) !important;
}
.el-input_inmer:focus,.el-textareainner:focus{
  border-color:var(--button-color) !important;
}
.el-dialog{
  background: var(--background-color) !important;
}
.el-input .el-input__count .el-input__count-inner{
       background:var(--card-background) !important;
}
.el-input__inner, .el-textarea__inner{
  padding:8px 35px  !important;

}
.el-upload-list__item-name{
  height: 30px !important;
  line-height: 29px !important;
}
.el-dialog{
  width: 95% !important;
}
.el-input__inner{
  background-color: var(--card-background) !important;
  color: var(--text-color)!important;
  /* border: 1px solid var(--border-color)!important; */
}

.el-textarea__inner{
  background-color: var(--card-background)!important;
  color: var(--text-color)!important;
}
.editor-container{
  background-color: var(--card-background)!important;
  color: var(--text-color)!important;
}
.el-textarea .el-input__count{
  background-color: var(--card-background)!important;
}

</style>
