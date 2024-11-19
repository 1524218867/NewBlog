<template>
  <div id="app">

    <router-view class="view"></router-view>

  </div>
</template>

<script>
export default {
  data() {
    return {


    }
  },

  components: {
  },

  computed: {

  },
  mounted() {

  },

  methods: {

  },
  watch: {

  },
}

</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

#app {
  background-color: var(--background-color);
  transition: background-color 0.5s ease, color 0.5s ease;
  /* overflow: hidden; */
  height: 100vh;
  min-width: 320px;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

a {
  text-decoration: none !important;
  /* color: #000 !important; */
  line-height: 0 !important;
}
</style>