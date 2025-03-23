import Vue from 'vue'
import store from '../store'
import ElementUI from 'element-ui'
// 引入ElementUI
import 'element-ui/lib/theme-chalk/index.css'
// 引入ElementUI的样式

import Index from '../views/index.vue'
// 引入index.vue
import Login from '../views/Login.vue'
import Home from '../components/IndeHome.vue'
import Discover from "../components/IndexCategories.vue"
import Create from '../components/IndexContent.vue'
// import Settings from '../components/IndexSettings.vue'//设置页面暂时不用
import VueRouter from 'vue-router'
import Article from '../views/Article.vue'
import My from '../components/User.vue';

import { isTokenExpired } from '@/utils/auth';
import { Notification } from 'element-ui';

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
        meta: { requiresAuth: true }, // 需要认证的页面
        children: [
            {
                path: '', // 默认子路由
                redirect: 'home' // 重定向到 home
            },
            {
                path: 'home', // 子路由路径，不带斜杠
                component: Home,
                name: 'Home',
                meta: { requiresAuth: true }, // 需要认证的页面
            },
            {
                path: 'discover',
                component: Discover,
                name: "Discover",
                meta: { requiresAuth: true }, // 需要认证的页面
            },
            {
                path: 'create', // 子路由路径，不带斜杠
                component: Create,
                name: 'Create',
                meta: { requiresAuth: true }, // 需要认证的页面
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
                path: 'my', // 子路由路径，不带斜杠
                component: My,
                name: 'My',
                meta: { requiresAuth: true }, // 需要认证的页面
            },
           
            // {
            //     path: 'settings',
            //     component: Settings,
            //     name: "Settings",
            //     meta: { requiresAuth: true }, // 需要认证的页面

            // },
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
        meta: { requiresAuth: true }, // 需要认证的页面
    }
]

const router = new VueRouter({
    mode: 'history', // 使用 history 模式
    routes,
})

// 记录路由来源
router.beforeEach((to, from, next) => {
    if (to.name === 'Article') {
        // 使用localStorage存储来源路径
        localStorage.setItem('articleFrom', from.fullPath);
    }
    next();
})
// 设置全局路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");


    // 如果页面需要认证且 token 过期，跳转到登录页
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token || isTokenExpired()) {

            Notification.error({
                title: "登录信息已失效",
                message: "请从新登录",
                duration: 3000,
            });
            localStorage.removeItem("token"); // 清除 token
            next('/Login'); // 如果 token 不存在或已过期，跳转到登录页面
        } else {
            next(); // token 有效，继续访问目标页面
        }
    } else {
        next(); // 不需要认证的页面，直接进入
    }
});
export default router
