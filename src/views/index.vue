<template>
    <div>

        <transition name="fade">
            <Loader v-if="isLoading" :visible="isLoading" />
        </transition>
        <div v-if="!isLoading" class="container">
            <!-- 左侧页 -->
            <div class="sidebar">
                <div class="LogoAndMenu">
                    <div class="logo">
                        <img src="../../public/logo2.png" alt="Logo" />
                        <span>云端轻语</span>
                    </div>
                    <ul class="menu">
                        <li :class="{ active: activeSection === 'home' }">
                            <router-link :to="getPath(0)" @click.native="setActive('home')">
                                <span>首页</span>
                            </router-link>
                        </li>
                        <li :class="{ active: activeSection === 'content' }">
                            <router-link :to="getPath(1)" @click.native="setActive('content')">
                                <span>社区</span>
                            </router-link>
                        </li>
                        <li :class="{ active: activeSection === 'categories' }">
                            <template v-if="!isDisabled">
                                <router-link :to="getPath(2)" @click.native="setActive('categories')">
                                    <span>发布</span>
                                </router-link>
                            </template>
                            <span v-else>发布</span>
                        </li>
                    </ul>
                </div>
                <div class="Index-Login">
                    <div class="wrapper">
                        <!-- <input type="checkbox" name="checkbox" class="switch" @click="toggleTheme"
                            :checked="currentTheme === 'dark'"> -->

                        <label aria-checked="false" role="switch" class="switch">
                            <input type="checkbox" @click="toggleTheme" :checked="currentTheme === 'dark'" />
                            <span class="slider">
                                <span class="slider-inner"></span>
                            </span>
                        </label>


                    </div>

                </div>
                <!-- 轮播图 -->
            </div>
        </div>
        <!-- 中页 -->
        <div class="Index-content">
            <div class="content-section-Foather">
                <transition name="fade">
                    <router-view :getImageUrl="getImageUrl" :key="$route.fullPath"
                        @themeChanged="updateTheme"></router-view>
                </transition>
            </div>
            <!-- 右侧页 -->
            <div class="user-info-wrapper">
                <LeftUser :DisplayContinueReadingZi="DisplayContinueReading" :noArticlesMessageZi="noArticlesMessage"
                    :lastViewedArticleZi="lastViewedArticle" :JingDuTiaoZi="JingDuTiao">
                </LeftUser>
            </div>

        </div>

    </div>

</template>

<script>
import "slick-carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import '../utils/index'
import { mapGetters, mapActions } from "vuex";
import ForActicle from "./ForActicle.vue";
import { Notification } from "element-ui"; // 确保你已经引入了 Notification
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/Loader.vue";
import LeftUser from "@/components/LeftUser.vue";
export default {
    data() {
        return {

            articles: [], // 用于存储文章列表
            filteredArticles: [], // 根据分类筛选后的文章
            latestArticle: {}, // 最新文章，初始化为空对象

            isDisabled: false, // 控制按钮是否禁用，初始化为 false
            activeSection: "home", // 当前激活的菜单项
            LoginActive: null,
            currentTheme: 'light',  // 默认主题，updateTheme（）函数会根据用户设置的主题更新这个值

            DisplayContinueReading: false, // 是否显示“继续阅读”部分
            // defaultCategoryId: "all", // 默认分类 ID
            viewedArticles: [], //浏览记录
            lastViewedArticle: null, // 要显示的文章
            noArticlesMessage: false, // 是否显示“继续去发现好的文章”消息
            scrollPosition: 0, // 当前文章的滚动位置
            maxScrollPosition: 0, // 当前文章的最大滚动高度
            isLoading: true, // 是否显示加载器
            JingDuTiao: 0, // 进度条

            themes: {
                light: {
                    '--primary-color': '#3498db',
                    '--ZiBaiBgc': "#f8f9ff",
                    '--ActiveBgc': '#f7f7f8',
                    '--background-color': '#ffffff',
                    '--Border': ' #f0f1fb',
                    '--text-color': '#000000',//文本颜色
                    '--active-background-color': '#1988fa',//按钮颜色
                    '--article-card-background-color': ' #f5f5f5',//边框颜色
                    '--Business-card-gradient': 'linear-gradient(to right, #1988fa 0%, #33c4f9 50%, #00f2fe 100%)'
                },
                dark: {
                    '--primary-color': '#e74c3c',
                    '--ActiveBgc': '#1a1a1a',
                    '--ZiBaiBgc': "#1f1f1f",
                    '--background-color': '#000000',
                    '--Border': ' #2c2c2c',
                    '--text-color': '#ecf0f1',//文本颜色
                    '--active-background-color': '#015aea',//按钮颜色
                    '--article-card-background-color': ' #212121',//边框颜色
                    '--Business-card-gradient': 'linear-gradient(to right, #012a63, #015aea, #4d9ef7)'
                }
            },
        };
    },

    components: {
        ForActicle,
        Loader,
        LeftUser
    },

    computed: {
        ...mapGetters(["isLoggedIn", "getUser"]),

    },

    created() {
        const token = localStorage.getItem("authToken");
        if (token) {
            this.$store.dispatch("updateUser", { token, details: {} }); // 更新用户信息
        }


    },

    methods: {
        ...mapActions(["logout"]),

        // goToLogin() {
        //     this.$router.push("/Login");
        // },

        goToRegister() {
            this.$router.push("/Login");
        },


        async logout() {
            try {

                if (!this.$store.getters.isLoggedIn) {
                    Notification.warning({
                        title: "未登录",
                        message: "您尚未登录，无法执行退出操作。",
                        duration: 3000,
                    });
                    return;
                }
                await this.$store.dispatch("logout"); // 调用 Vuex 的 logout action
                localStorage.removeItem("token"); // 清除本地存储中的 token
                Notification.success({
                    title: "退出登录成功",
                    message: "您已成功退出登录。",
                    duration: 3000,
                });
                this.$router.push("/Login"); // 跳转到登录页面
            } catch (error) {
                Notification.error({
                    title: "退出登录失败",
                    message: "退出登录过程中出现错误，请稍后重试。",
                    duration: 3000,
                });
                console.error("Error:", error);
            }
        },
        // 拼接图片 URL
        getImageUrl(imageName) {
            return `http://localhost:5000/uploads/${imageName}`;
        },
        //获取文章
        async fetchArticles() {
            try {
                const response = await axios.get("http://localhost:5000/api/articles");
                setTimeout(() => {
                    this.isLoading = false;
                }, 2000);

                this.articles = response.data; // 存储文章列表
                console.log(response.data);
                this.filteredArticles = this.articles; // 默认显示所有文章
                this.latestArticle =
                    this.articles.length > 0
                        ? this.articles[this.articles.length - 1]
                        : {}; // 设置最新文章

            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        },


        //获取浏览记录
        async fetchViewedArticles() {

            //如果没有登陆不让获取浏览记录
            if (localStorage.getItem("token") == null) {
                return;
            }
            this.DisplayContinueReading = true;//有token时显示继续阅读，无时显示请登录
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/user/viewed-articles",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                console.log("获取到了浏览记录", response);
                this.viewedArticles = response.data; // 假设 API 返回的数据是一个数组


                console.log('222', this.viewedArticles.length);
                // 更新 noArticlesMessage 的状态
                if (this.viewedArticles.length === 0) {
                    this.noArticlesMessage = true; // 没有文章时显示消息
                    this.lastViewedArticle = null; // 没有文章时清空 lastViewedArticle
                    return;
                }
                console.log('222');

                // 根据 lastViewedAt 时间排序
                const sortedArticles = [...this.viewedArticles].sort(
                    (a, b) => new Date(b.lastViewedAt) - new Date(a.lastViewedAt)
                );
                console.log('打印了sortedArticles', sortedArticles);


                // 查找未完成的文章,将未完成的文章放在最前面，通过filter来排序
                const unfinishedArticles = sortedArticles.filter((article) => this.calculateProgress(article.scrollPosition, article.maxScrollPosition) < 100
                );
                console.log('打印了', unfinishedArticles);

                if (unfinishedArticles.length > 0) {
                    console.log('222');
                    // 有未完成的文章，设置 lastViewedArticle 为最近浏览的未完成文章
                    this.lastViewedArticle = unfinishedArticles[0]; // 由于已经按时间排序，直接取第一个
                    console.log('111111', this.lastViewedArticle);

                    this.noArticlesMessage = false;
                } else {


                    // 所有文章都完成了，设置 lastViewedArticle 为最后一篇文章
                    this.lastViewedArticle = sortedArticles[0]; // 由于已经按时间排序，直接取第一个
                    this.noArticlesMessage = false;
                }
                // 使用 calculateProgress 更新 JingDuTiao 的值
                if (this.lastViewedArticle) {
                    this.JingDuTiao = this.calculateProgress(
                        this.lastViewedArticle.scrollPosition,
                        this.lastViewedArticle.maxScrollPosition
                    );
                } else {
                    this.JingDuTiao = 0;
                }


            } catch (error) {
                console.error("Error fetching viewed articles:", error);
                console.log("出错了，要改变状态了");

                this.noArticlesMessage = true; // 发生错误时显示消息
            }
        },

        calculateProgress(scrollPosition, maxScrollPosition) {

            if (maxScrollPosition === 0) return 0; // 防止除以0的情况
            // 计算进度条的宽度百分比
            const percentage = (scrollPosition / maxScrollPosition) * 100;


            return Math.min(percentage, 100); // 防止超过100%
        },

        //处理超时token
        isTokenExpired(token) {

            if (!token) return true;

            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000); // 当前时间（秒）

                // 检查当前时间是否超过 token 的过期时间
                return decodedToken.exp < currentTime;
            } catch (error) {
                console.error("Token decoding failed:", error);
                return true; // 如果解码失败，视为 token 已过期
            }
        },
        //从本地获取token，然后传给isTokenExpired处理,isTokenExpiredr如果返回true，就调用退出登录方法
        checkTokenAndRedirect() {
            const token = localStorage.getItem("token");

            if (this.isTokenExpired(token)) {
                Notification.error({
                    title: "登录信息已失效",
                    message: "请从新登录",
                    duration: 3000,
                });
                this.logout(); // 如果 token 已过期，执行退出登录操作
            }
        },
        setActive(section) {
            // if (!this.hasToken && this.activeSection === 'categories') {
            //     return; // 如果没有 token 并且 activeSection 是 'categories'，则返回
            // }
            this.activeSection = section; // 设置当前激活的菜单项
        },
        LoginActiveCLick(button) {//登陆是否显示
            this.LoginActive = button;
        },
        getPath(key) {
            const paths = {
                0: '/Index/Home',         // Home 路由
                1: '/Index/Categories',    // Categories 路由 
                2: '/Index/Content',    // Content 路由
                3: '/Index/Settings',     // Settings 路由
            };
            return paths[key] || '/Index/Home'; // 默认路径
        },
        setActiveSection() {//页面刷新就启动，路由跳转也算，作用是在页面刷新后根据当前按钮来跳转路由，如果本来就是在home也就不执行，
            if (this.$route.path === '/Index/Home') {
                return
            }

            const section = this.activeSection
            let path = '';
            switch (section) {
                case 'home':
                    path = '/Index/Home';
                    break;
                case 'categories':
                    path = '/Index/Categories';
                    break;
                case 'content':
                    path = '/Index/Content';
                    break;
                case 'settings':
                    path = '/Index/Settings';
                    break;
                default:
                    path = '/Index/Home'; // 默认路由
            }

            // 通过 Vue Router 的 push 方法进行导航
            this.$router.push(path);
        },
        toggleTheme() {

            console.log(this.currentTheme);

            // 切换主题状态
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            console.log(this.currentTheme);

            // 更新页面的 CSS 变量或样式
            this.updateTheme(this.currentTheme);
            // 将当前主题保存到 localStorage
            localStorage.setItem('theme', this.currentTheme);
        },
        updateTheme(themeName) {
            console.log(themeName);

            // document.body.classList.toggle('dark-theme', themeName === 'dark');
            this.currentTheme = themeName;//这里的currentTheme是data里的，用来在html里显示当前主题，并不是子组件的
            // 根据传入的主题名称更新全局 CSS 变量
            const theme = this.themes[themeName];
            for (const key in theme) {
                document.documentElement.style.setProperty(key, theme[key]);
            }
            // 保存到 localStorage 以保持刷新后的主题
            localStorage.setItem('theme', themeName);
        }

    },

    mounted() {
        this.isDisabled = localStorage.getItem('token') ? false : true
        // 初始化时从 localStorage 获取用户上次选择的主题
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.updateTheme(savedTheme);
        // 初始化时获取本地存储的主题状态


        this.fetchArticles(); // 获取文章
        this.setActiveSection()
        // 在组件挂载后执行获取浏览记录
        this.fetchViewedArticles();
        this.checkTokenAndRedirect(); // 组件挂载时检查 token过期没有

    },
};
</script>
<style scoped>
/* 子路由的动画。 */


body,
html {
    height: 100%;
    overflow: hidden;
    /* 禁止页面滚动 */
    font-size: 16px;
    /* 1rem = 16px */
}

/* 全局定义两套主题的 CSS 变量 */

dl,
ol,
ul {
    margin-top: 0;
    margin-bottom: 0;
}

h1,
h2,
p,

button {

    transition: color 0.5s ease, background-color 0.5s ease;
    /* 为其他元素添加过渡 */
}

/* 深色主题 */
/* .dark-theme {
    --background-color: #171717;
    --active-background-color: linear-gradient(to right, #dfe9f3 0%, white 100%);
    --text-color: #ffffff;
    --article-card-background-color: #212121;

} */

/* 浅色主题
.light-theme {
    --background-color: #ffffff;
    --active-background-color: #e6efff;
    --text-color: #000000;

    --article-card-background-color: #f5f5f5;
} */

/* 应用全局字体颜色 */
body {
    /* color: var(--font-color) !important; */
    /* 使用定义的字体颜色 */
}

/* 整体滚动条 */
::-webkit-scrollbar {
    width: 10px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    background-color: #ffffff;
    border-radius: 6px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    background-color: #d6d6d6;
    border-radius: 6px;
    border: 2px solid #f1f1f1;
}

/* 滚动条滑块 - 悬停 */
::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

.read-now {
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    background-color: #000;
    color: #fff;
    border-radius: 20px;
    cursor: pointer;
}

.container {
    display: flex;
    height: 100%;
    width: 100%;
    padding: 0;

    flex-direction: column;
}

.sidebar {
    flex: 1;
    width: 70%;
    background-color: var(--background-color);
    transition: background-color 0.5s ease, color 0.5s ease;
    min-width: 120px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 100vh;
    margin: auto;
}

.sidebar>div>.logo {
    display: flex;
    align-items: center;
}

.sidebar>div>.logo>img {
    width: 55px;
    height: 55px;
}

.sidebar>div>.logo>span {
    font-size: 20px;
    margin: 0 10px 0 0;
    font-weight: 600;
    color: var(--text-color);
}

.sidebar .menu {
    text-align: center;
    list-style: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 60%;
    height: 100%;
    color: #000;
    font-weight: 600;
}

.menu li.active>a>span {

    /* background-color: black; */
    /* 这里设置你希望的激活状态下的背景颜色 */
    /* box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4); */
    /* background: var(--active-background-color); */
    /* background-image: linear-gradient(to right, #dfe9f3 0%, white 100%); */
    transition: background-color 0.5s ease, color 0.5s ease;
    color: var(--active-background-color) !important;

}

.menu>li>a>span {
    color: var(--text-color);
}

.button-in-li {
    width: 100%;
    /* 让按钮填满 li */
    text-align: center;
    /* 按钮内容左对齐 */
    z-index: 10;
    background-color: var(--background-color);
    border: none;
}

.button-in-li:hover {
    background-color: transparent !important;
    /* 取消 hover 背景色 */
    color: inherit;
    /* 继承父元素颜色 */
    border-color: none !important;
    /* 取消 hover 边框颜色 */
}



.sidebar .menu li {
    margin: 0 25px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    /* padding: 10px 0 10px 0; */
    /* height: 55px; */
    border-radius: 10px;
    display: block;

}


.SomeSvg {
    width: 24px !important;
    height: 24px !important;
}

.sidebar .menu img {
    width: 30%;
    /* height: 80%; */
}

.LogoAndMenu {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* height: 100%; */
    width: 100%;
    flex: 1;
}

.Index-Login {
    flex: 1;
    display: flex;
    justify-content: flex-end;
}


/* Base Styles */
.switch {
    display: inline-block;
    width: 6em;
    height: 3em;
    position: relative;
    font-size: 18px;
    user-select: none;
    margin: 20px;
}

/* Hide default HTML checkbox */
.switch input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
}

/* Slider */
.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, #87ceeb, #e0f6ff);
    border-radius: 50px;
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow:
        0 4px 8px rgba(0, 0, 0, 0.1),
        inset 0 -5px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

/* Inner slider for additional styling */
.slider-inner {
    position: absolute;
    top: 0.3em;
    left: 0.3em;
    height: 2.4em;
    width: 2.4em;
    border-radius: 50%;
    background-color: #ffd700;
    transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.2),
        inset 0 -2px 5px rgba(0, 0, 0, 0.2);
}

/* Checked state */
.switch input:checked+.slider {
    background: linear-gradient(to right, #1a237e, #3949ab);
}

.switch input:checked+.slider .slider-inner {
    transform: translateX(3em);
    background-color: #ffffff;
}

/* Focus state */
.switch input:focus+.slider {
    outline: none;
    box-shadow: 0 0 0.4em rgba(25, 118, 210, 0.5);
}

/* Hover and active states */
.switch:hover .slider {
    background: linear-gradient(to right, #64b5f6, #e3f2fd);
}

.switch input:checked:hover+.slider {
    background: linear-gradient(to right, #283593, #5c6bc0);
}

/* Animation for slider inner */
@keyframes sunPulse {

    0%,
    100% {
        box-shadow:
            0 0 0 0 rgba(255, 215, 0, 0.7),
            0 0 0 0 rgba(255, 215, 0, 0.4);
    }

    50% {
        box-shadow:
            0 0 20px 10px rgba(255, 215, 0, 0.7),
            0 0 40px 20px rgba(255, 215, 0, 0.4);
    }
}

@keyframes moonPhase {

    0%,
    100% {
        box-shadow:
            inset -10px -5px 0 0 #ddd,
            0 0 20px rgba(255, 255, 255, 0.5);
    }

    50% {
        box-shadow:
            inset 0 0 0 0 #ddd,
            0 0 20px rgba(255, 255, 255, 0.5);
    }
}

.switch input:not(:checked)+.slider .slider-inner {
    animation: sunPulse 3s infinite;
}

.switch input:checked+.slider .slider-inner {
    animation: moonPhase 5s infinite;
}

/* Stars effect */
@keyframes twinkle {

    0%,
    100% {
        opacity: 0.2;
    }

    50% {
        opacity: 1;
    }
}

.slider::before,
.slider::after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    background-color: #ffffff;
    border-radius: 50%;
    transition: all 0.6s ease;
    opacity: 0;
}

.slider::before {
    top: 20%;
    left: 30%;
}

.slider::after {
    bottom: 25%;
    right: 25%;
}

.switch input:checked+.slider::before,
.switch input:checked+.slider::after {
    opacity: 1;
    animation: twinkle 2s infinite;
}

.switch input:checked+.slider::before {
    animation-delay: 0.5s;
}

/* 3D effect */
.slider {
    transform-style: preserve-3d;
    perspective: 500px;
}

.slider-inner {
    transform: translateZ(5px);
}

.switch input:checked+.slider .slider-inner {
    transform: translateX(3em) translateZ(5px) rotateY(180deg);
}

/* Cloud effect for day mode */
.slider-inner::before,
.slider-inner::after {
    content: "";
    position: absolute;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    transition: all 0.6s ease;
}

.slider-inner::before {
    width: 1em;
    height: 1em;
    top: -0.5em;
    left: -0.2em;
}

.slider-inner::after {
    width: 1.2em;
    height: 1.2em;
    bottom: -0.6em;
    right: -0.3em;
}

.switch input:checked+.slider .slider-inner::before,
.switch input:checked+.slider .slider-inner::after {
    opacity: 0;
}

/* Crater effect for night mode */
.switch input:checked+.slider .slider-inner::before {
    width: 0.6em;
    height: 0.6em;
    background-color: rgba(0, 0, 0, 0.2);
    top: 0.3em;
    left: 0.3em;
    opacity: 1;
}

.switch input:checked+.slider .slider-inner::after {
    width: 0.4em;
    height: 0.4em;
    background-color: rgba(0, 0, 0, 0.15);
    bottom: 0.5em;
    right: 0.5em;
    opacity: 1;
}

/* Accessibility improvements */
.switch input:focus+.slider {
    outline: 2px solid #4a90e2;
    outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .switch {
        width: 5em;
        height: 2.5em;
    }

    .slider-inner {
        height: 2em;
        width: 2em;
    }

    .switch input:checked+.slider .slider-inner {
        transform: translateX(2.5em) translateZ(5px) rotateY(180deg);
    }
}

@media (max-width: 480px) {
    .switch {
        width: 4em;
        height: 2em;
    }

    .slider-inner {
        height: 1.6em;
        width: 1.6em;
    }

    .switch input:checked+.slider .slider-inner {
        transform: translateX(2em) translateZ(5px) rotateY(180deg);
    }
}

/* High contrast mode */
@media (forced-colors: active) {
    .slider {
        background: Canvas;
        border: 2px solid ButtonText;
    }

    .switch input:checked+.slider {
        background: Highlight;
    }

    .slider-inner {
        background-color: ButtonFace;
    }

    .switch::before,
    .switch::after {
        color: ButtonText;
    }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {

    .switch,
    .slider,
    .slider-inner {
        transition: none;
    }

    .switch input:checked+.slider .slider-inner,
    .switch input:not(:checked)+.slider .slider-inner,
    .switch input:checked+.slider::before,
    .switch input:checked+.slider::after {
        animation: none;
    }
}



.register {
    margin-left: 10px;
}

.Index-content {
    display: flex;
    width: 70%;
    margin: auto;
    height: calc(100vh - 100px)
}


.content-wrapper {
    flex: 3;

    /* 为了避免和侧边栏重叠 */
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

.content-wrapper::-webkit-scrollbar {
    display: none;
}

.main-content {
    flex: 1;
    overflow-y: auto;
    /* 启用垂直滚动条 */
    padding: 40px 80px;
}

.content-section-Foather {
    flex: 9;
    /* height: 100vh; */
    /* min-width: 490px; */
    overflow-y: auto;
    background-color: var(--background-color);
    transition: background-color 0.5s ease, color 0.5s ease;
}

.content-section-Foather[data-v-a83bd3b0]::-webkit-scrollbar {
    display: none;
    /* 隐藏滚动条 */
}

.user-info-wrapper {

    flex: 4;
    background-color: var(--background-color);
    transition: background-color 0.5s ease, color 0.5s ease;
    overflow-y: auto;
    /* 启用垂直滚动条 */

}

.user-info-wrapper[data-v-a83bd3b0]::-webkit-scrollbar {
    display: none;
    /* 隐藏滚动条 */
}

.userlogo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

/* .LogoImg {
    border-radius: 50%;
    width: 60px;
    height: 60px;
    overflow: hidden;
}

.LogoImg>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
} */

.userlogo>span {
    flex: 1;
    padding: 20px;
}



.articles {
    display: flex;
    gap: 20px;
}

.user-card,
.premium-promo,
.more-topics {
    padding: 15px;
    border-radius: 5px;
    /* border-bottom: 1px solid #ccc; */
}

.premium-promo {
    width: 100%;
    /* 或者你希望的固定宽度，比如 500px */
    aspect-ratio: 2 / 1.3;
    /* 宽高比为2:1 */
    background-image: url(../../public/ZhiChi.png);
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    border-radius: 5px;
}



.premium-promo>p {
    color: #ffffff;
    margin-bottom: 40px;
}

.premium-promo button {
    background-color: #fff;
    padding: 10px 20px;
    border-radius: 40px;
}

.continue-reading button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.continue-reading h4 {
    padding: 20px 0;
}



.more-topics .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.more-topics .tags span {
    background-color: #f0f0f0;
    padding: 5px 10px;
    border-radius: 15px;
    cursor: pointer;
}

/* 超小屏幕（手机竖屏） */
@media (max-width: 576px) {
    .user-info-wrapper {
        display: none;
    }

    .icons {
        display: none !important;
    }
}

/* 小屏幕（手机横屏） */
@media (min-width: 577px) and (max-width: 768px) {}

/* 中等屏幕（平板） */
@media (min-width: 769px) and (max-width: 992px) {}

/* 大屏幕（小笔记本） */
@media (min-width: 993px) and (max-width: 1200px) {}

/* 超大屏幕（台式机） */
@media (min-width: 1201px) {}
</style>
