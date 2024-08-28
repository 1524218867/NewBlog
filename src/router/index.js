import Vue from 'vue'
import Vuex from 'vuex';
import ElementUI from 'element-ui'
// 引入ElementUI
import 'element-ui/lib/theme-chalk/index.css'
// 引入ElementUI的样式
import Entry from '../views/Entry.vue'
// 引入Entry.vue
import Index from '../views/index.vue'
// 引入index.vue
import Login from '../views/Login.vue'
import Content from '../views/Content.vue'
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
                path: '/Content',
                component: Content,
                name: 'Content'
            }
        ]
    },
    // 定义Entry页面路由
    {
        path: '/Entry',
        component: Entry,
        name: 'Entry',
    },
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
