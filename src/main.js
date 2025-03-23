import $ from 'jquery';
import App from './App.vue';
import store from './store'; // 引入创建的 Vuex Store
import axios from 'axios'; // 引入 axios



// 确保 jQuery 为全局变量，以便在 Vue 组件中使用

window.$ = window.jQuery = $;

// 引入 Bootstrap 和相关样式
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 Bootstrap 3 的 CSS
import 'bootstrap'; // 引入 Bootstrap 3 的 JavaScript
import 'slick-carousel/slick/slick.css'; // 引入 Slick Carousel 样式
import 'slick-carousel/slick/slick-theme.css';
const vuetify = new Vuetify();
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入 Vue 2

import Vue from 'vue';

// 引入路由
import router from './router/index.js';
import VueCal from 'vue-cal'//引入日历组件
import 'vue-cal/dist/vuecal.css'
// 引入 Vuetify 2
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
// 初始化 Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// 引入 Firebase 配置
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqbqz4CpsCTDY0VbWPQB-t6uHdEIQk2TQ",
  authDomain: "myblog-c17a0.firebaseapp.com",
  databaseURL: "https://myblog-c17a0-default-rtdb.firebaseio.com",
  projectId: "myblog-c17a0",
  storageBucket: "myblog-c17a0.appspot.com",
  messagingSenderId: "710118595739",
  appId: "1:710118595739:web:84343f79d7ad946326ba3e",
  measurementId: "G-RXB7NMBMLE"
};

// 初始化 Firebase 应用
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp); 3
const database = getDatabase(firebaseApp); // Realtime Database 服务
// 从 localStorage 获取 token
const token = localStorage.getItem('token');

if (token) {
  // 通过 Vuex 更新用户状态
  store.dispatch('updateUser', { token, details: {} });

  // 可以添加请求用户详细信息的逻辑
  axios.get('/api/user', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(response => {
      const userDetails = response.data;
      store.dispatch('updateUser', { token, details: userDetails });
    })
    .catch(error => {
      console.error('Fetch user details error:', error);
    });
}

Vue.prototype.$firebaseApp = firebaseApp;
Vue.prototype.$auth = auth;
Vue.prototype.$database = database;
// 引入其他样式
import './styles/fontAwesome.css';
import './styles/light-box.css';
// import './styles/owl-carousel.css';
import './styles/index.css';




const app = new Vue({

  router, // 使用路由
  vuetify, // 使用 Vuetify
  store, // 确保注册 Vuex Store
  data: {
    $firebaseAuth: auth // 设置全局属性
  },
  render: (h) => h(App), // 渲染 App.vue
});
Vue.component('VueCal', VueCal);
// 关闭生产提示
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueQuillEditor, /* { default global options } */)
// 挂载应用
app.$mount('#app');

