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

                    <label class="popup">
                        <input type="checkbox" />
                        <div tabindex="0" class="burger">
                            <svg t="1731742925320" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="4265" width="20" height="200">
                                <path
                                    d="M61.44 238.933333h901.12c27.306667 0 47.786667-20.48 47.786667-47.786666 0-27.306667-20.48-47.786667-47.786667-47.786667H61.44C34.133333 143.36 13.653333 163.84 13.653333 191.146667 13.653333 218.453333 34.133333 238.933333 61.44 238.933333z m901.12 225.28H61.44C34.133333 464.213333 13.653333 484.693333 13.653333 512s20.48 47.786667 47.786667 47.786667h901.12c27.306667 0 47.786667-20.48 47.786667-47.786667s-23.893333-47.786667-47.786667-47.786667z m0 320.853334H61.44c-27.306667 0-47.786667 20.48-47.786667 47.786666 0 27.306667 20.48 47.786667 47.786667 47.786667h901.12c27.306667 0 47.786667-20.48 47.786667-47.786667 0-27.306667-23.893333-47.786667-47.786667-47.786666z"
                                    p-id="4266" fill="#ffffff"></path>
                            </svg>
                        </div>
                        <nav class="popup-window">

                            <ul>
                                <li>
                                    <router-link :to="getPath(0)" @click.native="setActive('home')">
                                        <button>
                                            <svg t="1731745400798" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg" p-id="7089" width="12" height="12">
                                                <path
                                                    d="M854 512.9c-20.9 0-37.7 16.9-37.7 37.7v240.6c0 85.6-69.6 155.2-155.2 155.2H362.9c-85.6 0-155.2-69.6-155.2-155.2V550.6c0-20.9-16.9-37.7-37.7-37.7s-37.7 16.9-37.7 37.7v240.6c0 127.2 103.5 230.7 230.7 230.7h298.1c127.2 0 230.7-103.5 230.7-230.7V550.6c0-20.8-16.9-37.7-37.8-37.7zM1012.2 430L596.7 35.9c-47.5-45.1-121.9-45.1-169.5 0L11.8 430c-15.1 14.3-15.8 38.2-1.4 53.4 14.4 15.1 38.2 15.8 53.4 1.4L479.2 90.6c18.4-17.4 47.2-17.4 65.5 0l415.5 394.1c7.3 6.9 16.6 10.4 26 10.4 10 0 20-4 27.4-11.8 14.4-15.1 13.8-39-1.4-53.3z"
                                                    p-id="7090"></path>
                                            </svg>


                                            <span>首页</span>

                                        </button>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link :to="getPath(1)" @click.native="setActive('content')">
                                        <button>
                                            <svg t="1731747976102" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg" p-id="9138" width="14" height="14">
                                                <path
                                                    d="M597.7 566.2m-352.5 0a352.5 352.5 0 1 0 705 0 352.5 352.5 0 1 0-705 0Z"
                                                    p-id="9139">
                                                </path>
                                                <path
                                                    d="M242.7 782.1c5.4 5.4 10.9 10.5 16.5 15.5 19.8-3.6 42.9-10.9 68.7-22.1-82.9-58.4-137.2-154.8-137.2-263.6 0-177.7 144.5-322.2 322.2-322.2 108.2 0 204 53.6 262.5 135.6 11-25.9 18-49.6 21-69.7-4.3-4.7-8.7-9.4-13.2-13.9-35.1-35.1-76-62.6-121.5-81.9-47.1-19.9-97.2-30-148.8-30-51.6 0-101.6 10.1-148.8 30-45.5 19.3-86.4 46.8-121.5 81.9-35.1 35.1-62.6 76-81.9 121.5-19.9 47.1-30 97.2-30 148.8 0 51.6 10.1 101.6 30 148.8 19.4 45.3 47 86.2 82 121.3zM867.5 405.5c-9.8 21.2-21.5 43-34.9 65.2 1.7 13.5 2.6 27.2 2.6 41.1C835.2 689.5 690.7 834 513 834c-13.6 0-26.9-0.9-40.1-2.5-23.2 14.1-46 26.4-68.1 36.7-4.6 2.1-9.1 4.1-13.6 6 39.1 13.1 80 19.8 121.8 19.8 51.6 0 101.6-10.1 148.8-30 45.5-19.3 86.4-46.8 121.5-81.9 35.1-35.1 62.6-76 81.9-121.5 19.9-47.1 30-97.2 30-148.8 0-42.3-6.8-83.7-20.3-123.2-2.3 5.6-4.8 11.2-7.4 16.9z"
                                                    p-id="9140"></path>
                                                <path
                                                    d="M849.3 174.2c-15.2-15.2-43.8-32.6-93.5-29.2-24.7 1.7-52.4 8.3-82.5 19.7 25 11.5 48.5 25.7 70.3 42.2 9.1-1.6 17.5-2.4 25-2.4 17.3 0 30.3 4.1 38.3 12 20.6 20.6 14.4 74.8-16.4 141.4-36.4 78.7-101.7 167.3-183.9 249.5C460.1 754.1 323.2 819.8 254 819.8c-17.3 0-30.3-4.1-38.3-12-11.9-11.9-15.1-35.3-8.9-67.1-16.3-21.8-30.2-45.2-41.6-70.1-12.2 31.5-19.2 60.4-21 86.1-3.5 49.7 13.9 78.3 29.2 93.5 13.9 13.9 38.9 29.6 81 29.6 4 0 8.2-0.1 12.5-0.4 33.5-2.3 72.3-13.6 115.4-33.5C467.3 806.6 562 737 649.1 650S805.7 468.2 845 383.2c19.9-43.1 31.2-81.9 33.5-115.4 3.5-49.8-13.9-78.4-29.2-93.6z"
                                                    fill="#000002" p-id="9141"></path>
                                                <path
                                                    d="M491.022975 310.036021a30 30 0 1 0 42.425667-42.427147 30 30 0 1 0-42.425667 42.427147Z"
                                                    fill="#000002" p-id="9142"></path>
                                                <path
                                                    d="M267.537509 533.397692a30 30 0 1 0 42.425666-42.427148 30 30 0 1 0-42.425666 42.427148Z"
                                                    fill="#000002" p-id="9143"></path>
                                                <path
                                                    d="M477.9 477.3c-7.6 7.6-16.4 13.4-26.2 17.4-9.5 3.9-19.5 5.8-29.8 5.8s-20.3-2-29.8-5.8c-7.7-3.1-11.4-11.9-8.3-19.5 3.1-7.7 11.9-11.4 19.5-8.3 5.9 2.4 12.1 3.6 18.5 3.6s12.6-1.2 18.5-3.6c6.1-2.5 11.6-6.1 16.3-10.8 4.7-4.7 8.3-10.2 10.8-16.3 2.4-5.9 3.6-12.1 3.6-18.5s-1.2-12.6-3.6-18.5c-3.1-7.7 0.6-16.4 8.3-19.5 7.7-3.1 16.4 0.6 19.5 8.3 3.9 9.5 5.8 19.5 5.8 29.8s-2 20.3-5.8 29.8c-3.9 9.7-9.7 18.5-17.3 26.1z"
                                                    fill="#000002" p-id="9144"></path>
                                            </svg>

                                            <span>社区</span>

                                        </button>
                                    </router-link>
                                </li>
                                <li> 
                                    <router-link v-if="!isDisabled" :to="getPath(2)"
                                        @click.native="setActive('categories')">
                                        <button>

                                            <svg t="1731748751506" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg" p-id="10213" width="14" height="14">
                                                <path
                                                    d="M434.631111 903.395556c-18.887111 0-34.133333-15.246222-34.133333-34.133334V672.768c0-7.850667 2.730667-15.587556 7.736889-21.617778l410.510222-500.280889c9.671111-11.832889 26.055111-15.701333 40.049778-9.557333s22.186667 20.821333 20.138666 35.953778l-93.411555 664.917333c-1.479111 10.922667-8.305778 20.48-17.976889 25.486222-9.784889 5.12-21.390222 5.12-31.288889 0.113778l-213.105778-108.430222c-16.839111-8.533333-23.438222-29.127111-14.904889-45.852445 8.533333-16.839111 29.127111-23.438222 45.852445-14.904888l170.552889 86.812444 69.859555-497.208889L468.764444 685.056V869.262222c0 18.887111-15.36 34.133333-34.133333 34.133334z"
                                                    p-id="10214"></path>
                                                <path
                                                    d="M331.776 659.911111c-5.233778 0-10.581333-1.251556-15.587556-3.754667l-174.08-89.884444c-11.264-5.802667-18.432-17.408-18.432-30.151111-0.113778-12.743111 6.940444-24.348444 18.204445-30.378667l687.331555-363.406222c16.611556-8.760889 37.319111-2.389333 46.08 14.222222 8.760889 16.611556 2.389333 37.319111-14.222222 46.08L231.424 535.552l116.053333 59.960889c16.725333 8.647111 23.324444 29.240889 14.677334 45.966222-6.030222 11.719111-17.976889 18.432-30.378667 18.432z"
                                                    p-id="10215"></path>
                                            </svg>
                                            <template>

                                                <span>发布</span>

                                            </template>

                                        </button>
                                    </router-link>
                                    <div v-else @click="Indexpublish()">
                                        <svg t="1731748751506" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                            xmlns="http://www.w3.org/2000/svg" p-id="10213" width="14" height="14">
                                            <path
                                                d="M434.631111 903.395556c-18.887111 0-34.133333-15.246222-34.133333-34.133334V672.768c0-7.850667 2.730667-15.587556 7.736889-21.617778l410.510222-500.280889c9.671111-11.832889 26.055111-15.701333 40.049778-9.557333s22.186667 20.821333 20.138666 35.953778l-93.411555 664.917333c-1.479111 10.922667-8.305778 20.48-17.976889 25.486222-9.784889 5.12-21.390222 5.12-31.288889 0.113778l-213.105778-108.430222c-16.839111-8.533333-23.438222-29.127111-14.904889-45.852445 8.533333-16.839111 29.127111-23.438222 45.852445-14.904888l170.552889 86.812444 69.859555-497.208889L468.764444 685.056V869.262222c0 18.887111-15.36 34.133333-34.133333 34.133334z"
                                                p-id="10214"></path>
                                            <path
                                                d="M331.776 659.911111c-5.233778 0-10.581333-1.251556-15.587556-3.754667l-174.08-89.884444c-11.264-5.802667-18.432-17.408-18.432-30.151111-0.113778-12.743111 6.940444-24.348444 18.204445-30.378667l687.331555-363.406222c16.611556-8.760889 37.319111-2.389333 46.08 14.222222 8.760889 16.611556 2.389333 37.319111-14.222222 46.08L231.424 535.552l116.053333 59.960889c16.725333 8.647111 23.324444 29.240889 14.677334 45.966222-6.030222 11.719111-17.976889 18.432-30.378667 18.432z"
                                                p-id="10215"></path>
                                        </svg>
                                        <span>发布</span>
                                    </div>

                                </li>
                                <li v-if="!isDisabled">
                                    <router-link :to="getPath(3)" @click.native="setActive('AppUser')">
                                    <button>
                                        
                                        <svg t="1731814009258" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2391" width="14" height="14"><path d="M512.451579 545.507144c-148.479097 0-269.140942-120.842477-269.140942-269.140942S363.972482 7.22526 512.451579 7.22526s269.140942 120.842477 269.140942 269.140942-120.661845 269.140942-269.140942 269.140942z m0-477.589698c-114.881637 0-208.448756 93.567119-208.448757 208.448756s93.567119 208.448756 208.448757 208.448757S720.900335 391.247839 720.900335 276.366202 627.333216 67.917446 512.451579 67.917446zM896.654789 1016.232845H128.248368c-47.506086 0-85.980596-38.655142-85.980596-85.980596v-58.163344l1.806315-5.057683c57.802081-160.220145 250.355265-272.211678 468.377492-272.211677S923.026989 706.811078 980.82907 867.031222l1.806315 5.057683V930.252249c0 47.506086-38.655142 85.980596-85.980596 85.980596zM103.140589 882.926795V930.252249c0 13.908626 11.379785 25.288411 25.288411 25.288411h768.225789c13.908626 0 25.288411-11.379785 25.288411-25.288411v-47.506086C870.463221 748.717587 703.017816 655.692362 512.451579 655.692362S154.439936 748.717587 103.140589 882.926795z"  p-id="2392"></path></svg>
                                            <span>个人</span>
                                       
                                    </button>
                                </router-link>
                                </li>
                            </ul>
                        </nav>
                    </label>

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
                    :lastViewedArticleZi="lastViewedArticle" :JingDuTiaoZi="JingDuTiao" @call-parent="logout">
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
            return `http://localhost:3000/uploads/${imageName}`;
        },
        //获取文章
        async fetchArticles() {
            try {
                const response = await axios.get("/api/articles");
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
                    "/api/user/viewed-articles",
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
                console.log('333', this.lastViewedArticle);

                if (this.lastViewedArticle) {
                    this.JingDuTiao = this.calculateProgress(
                        this.lastViewedArticle.scrollPosition,
                        this.lastViewedArticle.maxScrollPosition
                    );
                    console.log('进度条', this.JingDuTiao);

                } else {
                    console.log('出错了，要改变状态了');

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
                3: '/Index/AppUser',     // AppUser 路由
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
                case 'AppUser':
                    path = '/Index/AppUser';
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
        },
        Indexpublish() {
            this.$notify({
                title: '警告',
                message: '请先登录',
                type: 'warning'
            });
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
    width: 70%;
    padding: 0;

    flex-direction: column;
}

.sidebar {
    flex: 1;
    width: 100%;
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
    width: 83px;
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


    transition: background-color 0.5s ease, color 0.5s ease;
    color: var(--active-background-color) !important;

}

.menu>li:nth-child(3) {
    color: var(--text-color);
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

    width: 80px;
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

/* From Uiverse.io by devkatyall */
/* The design is inspired from Galahhad*/

.popup {
    --burger-line-width: 1.125em;
    --burger-line-height: 0.125em;
    --burger-offset: 0.625em;
    --burger-bg: #00bf63;
    --burger-color: #333;
    --burger-line-border-radius: 0.1875em;
    --burger-diameter: 2.5em;
    --burger-btn-border-radius: 15px;
    --burger-line-transition: 0.3s;
    --burger-transition: all 0.1s ease-in-out;
    --burger-hover-scale: 1.1;
    --burger-active-scale: 0.95;
    --burger-enable-outline-color: var(--burger-bg);
    --burger-enable-outline-width: 0.125em;
    --burger-enable-outline-offset: var(--burger-enable-outline-width);
    /* nav */
    --nav-padding-x: 0.25em;
    --nav-padding-y: 0.625em;
    --nav-border-radius: 0.375em;
    --nav-border-color: #ccc;
    --nav-border-width: 0.0625em;
    --nav-shadow-color: rgba(0, 0, 0, 0.2);
    --nav-shadow-width: 0 1px 5px;
    --nav-bg: #eee;
    --nav-font-family: "Poppins", sans-serif;
    --nav-default-scale: 0.8;
    --nav-active-scale: 1;
    --nav-position-left: 0;
    --nav-position-right: unset;
    /* if you want to change sides just switch one property */
    /* from properties to "unset" and the other to 0 */
    /* title */
    --nav-title-size: 0.625em;
    --nav-title-color: #777;
    --nav-title-padding-x: 1rem;
    --nav-title-padding-y: 0.25em;
    /* nav button */
    --nav-button-padding-x: 1rem;
    --nav-button-padding-y: 0.375em;
    --nav-button-border-radius: 0.375em;
    --nav-button-font-size: 17px;
    --nav-button-hover-bg: var(--active-background-color);
    --nav-button-hover-text-color: #fff;
    --nav-button-distance: 0.875em;
    /* underline */
    --underline-border-width: 0.0625em;
    --underline-border-color: #ccc;
    --underline-margin-y: 0.3125em;
}

/* popup settings 👆 */

.popup {
    display: inline-block;
    text-rendering: optimizeLegibility;
    position: relative;
}

.popup input {
    display: none;
}

.burger {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    background: var(--active-background-color);
    width: var(--burger-diameter);
    height: var(--burger-diameter);
    border-radius: var(--burger-btn-border-radius);
    border: none;
    cursor: pointer;
    overflow: hidden;
    transition: var(--burger-transition);
    outline: var(--burger-enable-outline-width) solid transparent;
    outline-offset: 0;
}

.popup-window {
    transform: scale(var(--nav-default-scale));
    visibility: hidden;
    opacity: 0;
    position: absolute;
    padding: var(--nav-padding-y) var(--nav-padding-x);
    background: var(--nav-bg);
    font-family: var(--nav-font-family);
    color: var(--nav-text-color);
    border-radius: var(--nav-border-radius);
    box-shadow: var(--nav-shadow-width) var(--nav-shadow-color);
    border: var(--nav-border-width) solid var(--nav-border-color);
    top: calc(var(--burger-diameter) + var(--burger-enable-outline-width) + var(--burger-enable-outline-offset));
    left: -70px;
    right: 0;
    transition: var(--burger-transition);
    margin-top: 10px;
    z-index: 10;
}

.popup-window legend {
    padding: var(--nav-title-padding-y) var(--nav-title-padding-x);
    margin: 0;
    color: var(--nav-title-color);
    font-size: var(--nav-title-size);
    text-transform: uppercase;
}

.popup-window span {
    color: var(--active-background-color);
}

.popup-window ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
}

.popup-window ul li div {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6.3px 16px;
}

.popup-window ul button {
    outline: none;
    width: 100%;
    height: 35px;
    border: none;
    background: none;
    display: flex;
    align-items: center;
    color: var(--burger-color);
    font-size: var(--nav-button-font-size);
    padding: var(--nav-button-padding-y) var(--nav-button-padding-x);
    white-space: nowrap;
    border-radius: var(--nav-button-border-radius);
    cursor: pointer;
    column-gap: var(--nav-button-distance);
    justify-content: space-between;
}

.popup-window svg {
    color: #000;
    fill: var(--active-background-color);
}

.popup-window ul li:nth-child(4) svg,
.popup-window ul li:nth-child(5) svg {
    color: rgb(153, 153, 153);
}

.popup-window ul li:nth-child(7) svg {
    color: red;
}

.popup-window hr {
    margin: var(--underline-margin-y) 0;
    border: none;
    border-bottom: var(--underline-border-width) solid var(--underline-border-color);
}

/* actions */

.popup-window ul button:hover,
.popup-window ul button:focus-visible,


.popup-window ul button:focus-visible svg {

    color: var(--nav-button-hover-text-color);
    background: var(--nav-button-hover-bg);
}

.popup-window ul button:hover svg {
    fill: #ffffff;
}

.popup-window ul button:hover span {
    color: var(--nav-button-hover-text-color);
}

.burger:hover {
    transform: scale(var(--burger-hover-scale));
}

.burger:active {
    transform: scale(var(--burger-active-scale));
}

.burger:focus:not(:hover) {
    outline-color: var(--burger-enable-outline-color);
    outline-offset: var(--burger-enable-outline-offset);
}

.popup input:checked+.burger span:nth-child(1) {
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
}

.popup input:checked+.burger span:nth-child(2) {
    bottom: 50%;
    transform: translateY(50%) rotate(-45deg);
}

.popup input:checked+.burger span:nth-child(3) {
    transform: translateX(calc(var(--burger-diameter) * -1 - var(--burger-line-width)));
}

.popup input:checked~nav {
    transform: scale(var(--nav-active-scale));
    visibility: visible;
    opacity: 1;
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
    /* min-width: 12.5rem; */
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

    .menu {
        display: none !important;
    }

    .Index-content {
        width: 100%;
    }

    .container {
        width: 100%;
    }

    .Index-Login {
        display: none;
    }

    .LogoAndMenu {
        justify-content: space-between;
        padding: 10px;
    }
}

/* 小屏幕（手机横屏） */
@media (min-width: 577px) and (max-width: 768px) {
    .user-info-wrapper {
        display: none;
    }

    .popup {
        display: none;
    }
}

/* 中等屏幕（平板） */
@media (min-width: 769px) and (max-width: 992px) {
    .popup {
        display: none;
    }
}

/* 大屏幕（小笔记本） */
@media (min-width: 993px) and (max-width: 1200px) {
    .popup {
        display: none;
    }
}

/* 超大屏幕（台式机） */
@media (min-width: 1201px) {
    .popup {
        display: none;
    }
}
</style>
