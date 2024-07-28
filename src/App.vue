<template>
  <div id="app">
    <transition name="tv-shut" mode="out-in">

      <router-view :key="key" class="view"></router-view>

    </transition>

  </div>
</template>

<script>
export default {
  data() {
    return {
      key: 0,

    }
  },

  components: {
  },

  computed: {

  },

  mounted() { },

  methods: {
    Loginsuccess(data) {
      this.LoginData = data
    }
  },
  watch: {

    // 当路由发生变化时调用
    $route() {
      console.log('$route changed')
      // 每次路由发生变化时，key值加1
      this.key++;
    }
  }
}

</script>
<style>
.tv-shut-enter-active,
.tv-shut-leave-active {
  position: relative;
  transition: clip-path 0.5s ease;
}

.tv-shut-enter,
.tv-shut-leave-to {
  clip-path: inset(0 50% 0 50%);
}

.tv-shut-leave,
.tv-shut-enter-to {
  clip-path: inset(0 0 0 0);
}

.tv-shut-enter-active::before,
.tv-shut-leave-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: black; */
  /* 你可以在这里设置颜色 */
  z-index: 10;
  transition: opacity 0.5s ease;
  opacity: 0;
}

.tv-shut-enter-active::before {
  opacity: 1;
}

.tv-shut-leave-active::before {
  opacity: 1;
}
</style>