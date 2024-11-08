import Vue from 'vue'
import Vuex from 'vuex';
import ElementUI from 'element-ui'
// 引入ElementUI
import 'element-ui/lib/theme-chalk/index.css'
// 引入ElementUI的样式

import Index from '../views/index.vue'
// 引入index.vue
import Login from '../views/Login.vue'
import Home from '../components/IndeHome.vue'
import Categories from "../components/IndexCategories.vue"
import Content from '../components/IndexContent.vue'
import Settings from '../components/IndexSettings.vue'
import VueRouter from 'vue-router'
import Article from '../views/Article.vue'


// 引入ElementUI
Vue.use(ElementUI)
// 引入VueRouter
Vue.use(VueRouter)
// 路由配置
// 定义路由数组
const routes = [
    // 重定向到Index页面
    {
        path: '/',
        redirect: '/Index',
    },
    // 定义Index页面路由
    {
        path: '/Index',
        component: Index,
        name: 'Index',

        children: [
            {
                path: '', // 默认子路由
                redirect: 'home' // 重定向到 home
            },
            {
                path: 'home', // 子路由路径，不带斜杠
                component: Home,
                name: 'Home',

            },
            {
                path: 'categories',
                component: Categories,
                name: "Categories"
            },
            {
                path: 'content', // 子路由路径，不带斜杠
                component: Content,
                name: 'Content',
                beforeEnter: (to, from, next) => {//没有token不允许跳转
                    const token = localStorage.getItem('token');
                    if (!token) {
                        return
                    } else {
                        next(); // 有 token，允许访问
                    }
                }
            },

            {
                path: 'settings',
                component: Settings,
                name: "Settings"
            },
        ]
    },

    // 定义Entry页面路由

    {
        path: '/Login',
        component: Login,
        name: 'Login'
    },

    {
        path: '/Article/:id', // 动态路由，:id 是路由参数
        name: 'Article',
        component: Article,
    }
]

const router = new VueRouter({
    routes,
})

export default router
