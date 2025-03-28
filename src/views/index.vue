<template>
    <div class="PackageContent" @click="handleClickIndexContent">
        <!-- 左侧导航栏和主要内容区域 -->
        <div class="header">
            <!-- 原有的Logo和菜单内容 -->
            <div class="LogoAndMenu">
                <div class="logo-menu-container">
                    <div class="logo">
                        <img src="../assets/logo.png" alt="Logo" />
                        <span>云端轻语</span>
                    </div>
                    <ul class="menu">
                        <li :class="{ active: activeSection === 'home' }">
                            <router-link :to="getPath(0)" @click.native="setActive('home')">
                                <span>首页</span>
                            </router-link>
                        </li>
                        <li :class="{ active: activeSection === 'discover' }">
                            <router-link :to="getPath(1)" @click.native="setActive('discover')">
                                <span>发现</span>
                            </router-link>
                        </li>

                        <li :class="{ active: activeSection === 'my' }">
                            <router-link :to="getPath(3)" @click.native="setActive('my')">
                                <span>我的</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
               
                <div class="right-container">
                    <ThemeToggle />
                    <div class="InputContainer" :class="{ 'expanded': isSearchExpanded }" @click.stop="toggleSearch">
                        <input placeholder="搜索" id="input" class="input" name="text" type="text" v-model="keyword"
                            @keyup.enter="searchArticles" @input="onInputChange" @focus="highlightButton"
                            @blur="resetButton" />

                        <label class="labelforsearch" for="input" @click.stop="handleSearchClick">
                            <svg class="searchIcon" viewBox="0 0 512 512">
                                <path
                                    d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z">
                                </path>
                            </svg>
                        </label>
                        <ul v-show="SouSuoContent">
                            <svg @click="CloseSearch" t="1734760992680" class="icon" viewBox="0 0 1024 1024"
                                version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4142" width="15" height="15">
                                <path
                                    d="M593.976284 490.054855l359.392196 359.549238a74.516756 74.516756 0 1 1-105.454166 105.454166L488.443597 595.587542l-359.470718 359.470717a74.438235 74.438235 0 0 1-105.532687 0 74.595278 74.595278 0 0 1 0-105.454166L382.910909 490.054855 23.440192 130.584137A74.595278 74.595278 0 0 1 128.972879 25.129971L488.443597 384.600688 847.914314 25.129971a74.595278 74.595278 0 1 1 105.454166 105.454166L593.976284 490.054855z"
                                    fill="#2C2F46" p-id="4143"></path>
                            </svg>
                            <li v-for="article in SouSuoarticles" :key="article._id">
                                <router-link :to="{ name: 'Article', params: { id: article._id } }" class="search-result-item">
                                    <h3 v-html="article.title"></h3>
                                    <p v-html="article.BriefIntroduction"></p>
                                </router-link>
                            </li>
                        </ul>
                    </div>

                    <label class="popup" @click.prevent>
                        <div tabindex="0" class="burger" @click.prevent="openPopup">
                            <svg t="1731742925320" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="4265" width="20" height="200">
                                <path
                                    d="M61.44 238.933333h901.12c27.306667 0 47.786667-20.48 47.786667-47.786666 0-27.306667-20.48-47.786667-47.786667-47.786667H61.44C34.133333 143.36 13.653333 163.84 13.653333 191.146667 13.653333 218.453333 34.133333 238.933333 61.44 238.933333z m901.12 225.28H61.44C34.133333 464.213333 13.653333 484.693333 13.653333 512s20.48 47.786667 47.786667 47.786667h901.12c27.306667 0 47.786667-20.48 47.786667-47.786667s-23.893333-47.786667-47.786667-47.786667z m0 320.853334H61.44c-27.306667 0-47.786667 20.48-47.786667 47.786666 0 27.306667 20.48 47.786667 47.786667 47.786667h901.12c27.306667 0 47.786667-20.48 47.786667-47.786667 0-27.306667-23.893333-47.786667-47.786667-47.786666z"
                                    p-id="4266" fill="#ffffff"></path>
                            </svg>
                        </div>
                        <nav class="popup-window" v-show="isPopupVisible" @click.stop="handlePopupClick">
                            <ul>
                                <li>
                                    <router-link :to="getPath(0)" @click.native="setActive('home')">
                                        <button :class="{ active: activeSection === 'home' }">
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
                                    <router-link :to="getPath(1)" @click.native="setActive('discover')">
                                        <button :class="{ active: activeSection === 'discover' }">
                                            <svg t="1731747976102" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg" p-id="9138" width="14" height="14">
                                                <path
                                                    d="M597.7 566.2m-352.5 0a352.5 352.5 0 1 0 705 0 352.5 352.5 0 1 0-705 0Z"
                                                    p-id="9139">
                                                </path>
                                                <path
                                                    d="M242.7 782.1c5.4 5.4 10.9 10.5 16.5 15.5 19.8-3.6 42.9-10.9 68.7-22.1-82.9-58.4-137.2-154.8-154.8-263.6 0-177.7 144.5-322.2 322.2-322.2 108.2 0 204 53.6 262.5 135.6 11-25.9 18-49.6 21-69.7-4.3-4.7-8.7-9.4-13.2-13.9-35.1-35.1-76-62.6-121.5-81.9-47.1-19.9-97.2-30-148.8-30-51.6 0-101.6 10.1-148.8 30-45.5 19.3-86.4 46.8-121.5 81.9-35.1 35.1-62.6 76-81.9 121.5-19.9 47.1-30 97.2-30 148.8 0 51.6 10.1 101.6 30 148.8 19.4 45.3 47 86.2 82 121.3zM867.5 405.5c-9.8 21.2-21.5 43-34.9 65.2 1.7 13.5 2.6 27.2 2.6 41.1C835.2 689.5 690.7 834 513 834c-13.6 0-26.9-0.9-40.1-2.5-23.2 14.1-46 26.4-68.1 36.7-4.6 2.1-9.1 4.1-13.6 6 39.1 13.1 80 19.8 121.8 19.8 51.6 0 101.6-10.1 148.8-30 45.5-19.3 86.4-46.8 121.5-81.9 35.1-35.1 62.6-76 81.9-121.5 19.9-47.1 30-97.2 30-148.8 0-42.3-6.8-83.7-20.3-123.2-2.3 5.6-4.8 11.2-7.4 16.9z"
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
                                            <span>发现</span>
                                        </button>
                                    </router-link>
                                </li>

                                <li v-if="!isDisabled">
                                    <router-link :to="getPath(3)" @click.native="setActive('my')">
                                        <button :class="{ active: activeSection === 'my' }">
                                            <svg t="1731814009258" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg" p-id="2391" width="14" height="14">
                                                <path
                                                    d="M512.451579 545.507144c-148.479097 0-269.140942-120.842477-269.140942-269.140942S363.972482 7.22526 512.451579 7.22526s269.140942 120.842477 269.140942 269.140942-120.661845 269.140942-269.140942 269.140942z m0-477.589698c-114.881637 0-208.448756 93.567119-208.448757 208.448756s93.567119 208.448756 208.448757 208.448757S720.900335 391.247839 720.900335 276.366202 627.333216 67.917446 512.451579 67.917446zM896.654789 1016.232845H128.248368c-47.506086 0-85.980596-38.655142-85.980596-85.980596v-58.163344l1.806315-5.057683c57.802081-160.220145 250.355265-272.211678 468.377492-272.211677S923.026989 706.811078 980.82907 867.031222l1.806315 5.057683V930.252249c0 47.506086-38.655142 85.980596-85.980596 85.980596zM103.140589 882.926795V930.252249c0 13.908626 11.379785 25.288411 25.288411 25.288411h768.225789c13.908626 0 25.288411-11.379785 25.288411-25.288411v-47.506086C870.463221 748.717587 703.017816 655.692362 512.451579 655.692362S154.439936 748.717587 103.140589 882.926795z"
                                                    p-id="2392"></path>
                                            </svg>
                                            <span>我的</span>
                                        </button>
                                    </router-link>
                                </li>
                                <li v-else>
                                    <router-link :to="getPath(4)" @click.native="setActive('login')">
                                        <button :class="{ active: activeSection === 'login' }">
                                            <svg t="1733543439950" class="icon" viewBox="0 0 1084 1024" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg" p-id="8145" width="14" height="14">
                                                <path
                                                    d="M655.380078 298.927686a34.354196 34.354196 0 0 1 0-48.268549 33.731765 33.731765 0 0 1 47.947295 0l233.773176 235.52c7.027451 7.087686 10.039216 16.524549 9.59749 25.820863 0.461804 9.296314-2.549961 18.733176-9.59749 25.86102l-233.773176 235.52a33.731765 33.731765 0 0 1-47.947295 0 34.374275 34.374275 0 0 1 0-48.288628L833.054118 546.133333H33.872314C15.199373 546.133333 0 530.873725 0 512c0-18.833569 15.179294-34.133333 33.872314-34.133333H833.054118l-177.653961-178.938981zM948.725961 1024H271.058824c-74.852392 0-135.529412-61.138824-135.529412-136.533333v-136.533334h67.764706v136.533334c0 37.707294 30.33851 68.266667 67.764706 68.266666h677.647058c37.426196 0 67.764706-30.579451 67.764706-68.266666V136.533333c0-37.707294-30.33851-68.266667-67.764706-68.266666H271.058824c-37.426196 0-67.764706 30.559373-67.764706 68.266666v136.533334H135.529412V136.533333C135.529412 61.138824 196.206431 0 271.058824 0h677.647058C1023.558275 0 1084.235294 61.138824 1084.235294 136.533333v750.933334c0 75.39451-60.67702 136.533333-135.529412 136.533333z"
                                                    p-id="8146"></path>
                                            </svg>
                                            <span>登录</span>
                                        </button>
                                    </router-link>
                                </li>
                            </ul>
                        </nav>
                    </label>
                </div>
            </div>
        </div>
        <!-- 主要内容区域 -->
        <div class="main-container">
            <div class="content-wrapper">
                <router-view 
                    :getImageUrl="getImageUrl" 
                    :key="$route.fullPath" 
                    @themeChanged="updateTheme"
                    :lastViewedArticleZi="lastViewedArticle" 
                    @call-parent="logout">
                </router-view>
            </div>
            <!-- <Footer /> -->
        </div>
    </div>

</template>

<script>
import "slick-carousel";
import ThemeToggle from '../components/ThemeToggle.vue';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import '../utils/index'
import { mapState, mapGetters, mapActions } from "vuex";

import { Notification } from "element-ui"; // 确保你已经引入了 Notification
import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import Loader from "@/components/Loader.vue";
import Footer from "@/components/Footer.vue";

export default {
    components: {
        ThemeToggle,
        Footer
    },
    data() {
        return {
            articles: [], // 用于存储文章列表
            filteredArticles: [], // 根据分类筛选后的文章
            latestArticle: {}, // 最新文章，初始化为空对象
            isDisabled: false, // 控制按钮是否禁用，初始化为 false
            activeSection: "home", // 当前激活的菜单项
            LoginActive: null,
            currentTheme: 'light',  // 默认主题，updateTheme（）函数会根据用户设置的主题更新这个值
            // 主题配置
            themes: {
                light: {
                    '--primary-color': '#3498db',
                    '--secondary-background': '#f8f9ff',  // 原 --ZiBaiBgc
                    '--active-background': '#f7f7f8',     // 原 --ActiveBgc
                    '--background-color': '#ffffff',
                    '--border-color': '#f0f1fb',          // 原 --Border
                    '--text-color': '#000000',
                    '--button-color': '#1988fa',          // 原 --active-background-color
                    '--card-background': '#f5f5f5',       // 原 --article-card-background-color
                    '--gradient-primary': 'linear-gradient(to right, #1988fa 0%, #33c4f9 50%, #00f2fe 100%)'  // 原 --Business-card-gradient
                },
                dark: {
                    '--primary-color': '#808080',
                    '--secondary-background': '#1a1a1a',
                    '--active-background': '#2a2a2a',
                    '--background-color': '#121212',
                    '--border-color': '#333333',
                    '--text-color': '#e0e0e0',
                    '--button-color': '#666666',
                    '--card-background': '#1f1f1f',
                    '--gradient-primary': 'linear-gradient(to right, #4a4a4a 0%, #666666 50%, #808080 100%)'
                }
            },
            DisplayContinueReading: false, // 是否显示"继续阅读"部分
            // defaultCategoryId: "all", // 默认分类 ID
            viewedArticles: [], //浏览记录
            lastViewedArticle: null, // 要显示的文章
            noArticlesMessage: false, // 是否显示"继续去发现好的文章""消息
            scrollPosition: 0, // 当前文章的滚动位置
            maxScrollPosition: 0, // 当前文章的最大滚动高度
            // isLoading: true, // 是否显示加载器
            JingDuTiao: 0, // 进度条
            isPopupVisible: false, // 控制弹窗的显示与隐藏
            keyword: '',
            isButtonHighlighted: false, // 搜索按钮高亮状态
            SouSuoarticles: [], // 用于存储搜索后的文章列表
            SouSuoContent: false,
            isSearchExpanded: false,

           
        };
    },

    computed: {
        ...mapGetters(["isLoggedIn", "getUser"]),
        // 获取收藏数据
        ...mapState(['favorites']),
         // 判断当前路由是否为发布页
    isPublishPage() {
      return this.$route.path === '/Index/Content';
    },
    // 判断当前路由是否为用户页
    isUserPage() {
      return this.$route.path === '/Index/User';
    }
    },

    watch: {
        '$route': {
            handler(to) {
                // 根据路由路径设置activeSection
                if (to.path.includes('/Index/Home')) {
                    this.activeSection = 'home';
                } else if (to.path.includes('/Index/Discover')) {
                    this.activeSection = 'discover';

                } else if (to.path.includes('/Index/My')) {
                    this.activeSection = 'my';
                }
            },
            immediate: true
        }
    },

    created() {
        const token = localStorage.getItem("authToken");
        if (token) {
            this.$store.dispatch("updateUser", { token, details: {} }); // 更新用户信息
        }


    },

    methods: {
        ...mapActions(["logout", "VuexloadFavorites"]),
        // 触发 Vuex 中的 VuexloadFavorites 动作
  


        goToRegister() {
            this.$router.push("/Login");
        },
        openPopup(event) {
            event.stopPropagation(); // 阻止事件冒泡
            this.isPopupVisible = !this.isPopupVisible;
        },
        // 点击空白区域关闭弹窗
        handleClickIndexContent(event) {
            // 检查点击事件是否来自popup-window内部
            const popupWindow = event.target.closest('.popup-window');
            if (!popupWindow && this.isPopupVisible) {
                this.isPopupVisible = false;
            }
        },
        // 添加popup-window内部点击事件处理
        handlePopupClick(event) {
            event.stopPropagation(); // 阻止事件冒泡到外层
        },
        async logout() {
            try {
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
                // setTimeout(() => {
                //     this.isLoading = false;
                // }, 2000);

                this.articles = response.data; // 存储文章列表

                this.filteredArticles = this.articles; // 默认显示所有文章
                this.latestArticle = this.articles.length > 0
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


                this.viewedArticles = response.data; // 假设 API 返回的数据是一个数组



                // 更新 noArticlesMessage 的状态
                if (this.viewedArticles.length === 0) {
                    this.noArticlesMessage = true; // 没有文章时显示消息
                    this.lastViewedArticle = null; // 没有文章时清空 lastViewedArticle
                    return;
                }


                // 根据 lastViewedAt 时间排序
                const sortedArticles = [...this.viewedArticles].sort(
                    (a, b) => new Date(b.lastViewedAt) - new Date(a.lastViewedAt)
                );



                // 查找未完成的文章,将未完成的文章放在最前面，通过filter来排序
                const unfinishedArticles = sortedArticles.filter((article) => this.calculateProgress(article.scrollPosition, article.maxScrollPosition) < 100
                );


                if (unfinishedArticles.length > 0) {

                    // 有未完成的文章，设置 lastViewedArticle 为最近浏览的未完成文章
                    this.lastViewedArticle = unfinishedArticles[0]; // 由于已经按时间排序，直接取第一个
                    

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


                this.noArticlesMessage = true; // 发生错误时显示消息
            }
        },

        calculateProgress(scrollPosition, maxScrollPosition) {

            if (maxScrollPosition === 0) return 0; // 防止除以0的情况
            // 计算进度条的宽度百分比
            const percentage = (scrollPosition / maxScrollPosition) * 100;


            return Math.min(percentage, 100); // 防止超过100%
        },


        setActive(section) {

            this.activeSection = section; // 设置当前激活的菜单项
        },
        LoginActiveCLick(button) {//登陆是否显示
            this.LoginActive = button;
        },
        getPath(key) {
            const paths = {
                0: '/Index/Home',         // Home 路由
                1: '/Index/Discover',     // Discover 路由 

                3: '/Index/My',           // My 路由
                4: '/Login'
            };
            return paths[key] || '/Index/Home'; // 默认路径
        },
        setActiveSection() {//页面刷新就启动，路由跳转也算，作用是在页面刷新后根据当前按钮来跳转路由
            // 检查当前路由是否有效，如果是有效路由则不进行重定向
            if (this.$route.matched.length > 0) {
                return;
            }

            const section = this.activeSection
            let path = '';
            switch (section) {
                case 'home':
                    path = '/Index/Home';
                    break;
                case 'discover':
                    path = '/Index/Discover';
                    break;

                case 'my':
                    path = '/Index/My';
                    break;
                
                default:
                    path = '/Index/Home'; // 默认路由
            }

            // 通过 Vue Router 的 push 方法进行导航
            this.$router.push(path);
        },
        toggleTheme() {


            // 切换主题状态
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';

            // 更新页面的 CSS 变量或样式
            this.updateTheme(this.currentTheme);
            // 将当前主题保存到 localStorage
            localStorage.setItem('theme', this.currentTheme);
        },
        updateTheme(themeName) {


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
        },
        //搜索
        async searchArticles() {
            if (!this.keyword) {
                this.message = '请输入关键词进行搜索';
                Notification.info({
                    title: "注意",
                    message: "请输入关键词进行搜索",
                    duration: 3000,
                });
                return;
            }
            try {
                const response = await fetch(`/api/articles/search?keyword=${encodeURIComponent(this.keyword)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        // 处理搜索结果，添加高亮
                        this.SouSuoarticles = data.map(article => ({
                            ...article,
                            title: this.highlightKeyword(article.title),
                            BriefIntroduction: this.highlightKeyword(article.BriefIntroduction)
                        }));
                        this.SouSuoContent = true;
                        this.message = '';
                    } else {
                        this.message = '没有找到相关的文章';
                        this.SouSuoContent = false;
                    }
                } else if (response.status === 404) {
                    this.message = '没有找到相关的文章';
                    this.SouSuoContent = false;
                    Notification.error({
                        title: "提示",
                        message: "没有找到相关的文章",
                        duration: 3000,
                    });
                } else {
                    this.message = '服务器出错，请稍后再试';
                    Notification.error({
                        title: "错误",
                        message: "服务器出错，请稍后再试",
                        duration: 3000,
                    });
                }
            } catch (error) {
                console.error(error);
                this.message = '网络错误，请检查网络连接';
                Notification.error({
                    title: "错误",
                    message: "网络错误，请检查网络连接",
                    duration: 3000,
                });
            }
        },
        highlightKeyword(text) {
            if (!this.keyword || !text) return text;
            const regex = new RegExp(this.keyword, 'gi');
            return text.replace(regex, match => `<span class="highlight">${match}</span>`);
        },
        onInputChange() {
            if (!this.keyword.trim()) {
                // 输入框为空时清空结果和提示
                this.SouSuoarticles = [];
                this.message = '请输入关键词进行搜索';
            }
        },
        highlightButton() {
            this.isButtonHighlighted = true; // 设置按钮为高亮状态
        },
        resetButton() {
            this.isButtonHighlighted = false; // 取消按钮高亮状态
        },
        CloseSearch() {
            this.SouSuoContent = false;
        },
        handleSearchClick(event) {
            if (window.innerWidth <= 768) {
                // 移动端点击搜索图标时执行搜索
                if (this.keyword.trim()) {
                    this.searchArticles();
                }
                // 切换展开/收起状态
                this.isSearchExpanded = !this.isSearchExpanded;
                if (this.isSearchExpanded) {
                    // 展开时自动聚焦输入框
                    this.$nextTick(() => {
                        const input = this.$el.querySelector('.input');
                        if (input) {
                            input.focus();
                        }
                    });
                }
            } else {
                // PC端点击搜索图标时执行搜索
                this.searchArticles();
            }
        },
        toggleSearch(event) {
            // 如果点击的是搜索图标，不处理
            if (event.target.closest('.labelforsearch')) {
                return;
            }
            
            if (window.innerWidth <= 768) {
                // 移动端点击搜索框时，如果未展开则展开
                if (!this.isSearchExpanded) {
                    this.isSearchExpanded = true;
                    // 展开时自动聚焦输入框
                    this.$nextTick(() => {
                        const input = this.$el.querySelector('.input');
                        if (input) {
                            input.focus();
                        }
                    });
                }
            }
        },

        handleDocumentClick(event) {
            // 只在移动端处理
            if (window.innerWidth <= 768) {
                // 检查点击是否在搜索框容器外
                const searchContainer = this.$el.querySelector('.InputContainer');
                if (searchContainer && !searchContainer.contains(event.target)) {
                    this.isSearchExpanded = false;
                }
            }
        },
    },

    mounted() {
        this.isDisabled = localStorage.getItem('token') ? false : true
        // 初始化时从 localStorage 获取用户上次选择的主题
        const savedTheme = localStorage.getItem('theme') || 'light';

        this.updateTheme(savedTheme);
        // 初始化时获取本地存储的主题状态

        this.VuexloadFavorites();// 获取收藏
        this.fetchArticles(); // 获取文章
        this.setActiveSection()
        // 在组件挂载后执行获取浏览记录
        this.fetchViewedArticles();
        // 组件挂载时检查 token过期没有
        // this.isTokenExpired()

        
        // 添加点击事件监听器，用于收起搜索框
        document.addEventListener('click', this.handleDocumentClick);
    },

    beforeDestroy() {
        // 移除点击事件监听器
        document.removeEventListener('click', this.handleDocumentClick);
    },
};
</script>
<style scoped>
/* 子路由的动画。 */

.el-card__body{
  padding: 0 !important;
}
body,
html {
    height: 100%;
    overflow: hidden;
    /* 禁止页面滚动 */
    font-size: 16px;
    /* 1rem = 16px */
}

.PackageContent {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    margin-bottom: 20px;
}

/* LogoAndMenu样式调整 */
.LogoAndMenu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    width: 100%;
}

.logo-menu-container {
    display: flex;
    align-items: center;
    gap: 40px;
}

.right-container {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo img {
    width: 40px;
    height: 40px;
}

.logo span {
    font-size: 20px;
    font-weight: bold;
    color: var(--text-color);
}

.menu {
    display: flex;
    gap: 20px;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
}

.menu li {
    position: relative;
}

.menu li a {
    display: flex;
    align-items: center;
    padding: 16px 15px;
    color: var(--text-color);
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    white-space: nowrap;
    min-width: 60px;
    justify-content: flex-start;
}

.menu li.active a {
    background: var(--button-color);
    color: white;
    padding: 20px 20px;
}
.main-container{
    width: 100%;
}
/* 响应式布局调整 */
/* 超小屏幕（手机竖屏） */
@media (max-width: 576px) {
    .user-info-wrapper,
    .menu,
    .Index-Login,
    .IN-icons {
        display: none;
    }

    .Index-content {
        width: 100%;
    }

    .header {
        width: 95%;
    }

    .LogoAndMenu {
        justify-content: space-between;
        padding: 10px;
    }

    .logo span {
        display: none;
    }
    
    .logo-menu-container {
        gap: 0;
    }
    
    .right-container {
        gap: 5px;
    }

    .main-container {
        padding: 5px;
        width: 95%;
    }
    
    .content-wrapper {
        /* padding: 10px; */
    }

    .popup-window ul li button {
        padding: 15px;
        font-size: 18px;
    }
}

/* 小屏幕（手机横屏） */
@media (min-width: 577px) and (max-width: 768px) {
    .user-info-wrapper,
    .Index-Login,
    .menu,
    .IN-icons {
        display: none;
    }

    .LogoAndMenu {
        justify-content: space-between;
        padding: 10px;
    }

    .logo-menu-container {
        gap: 0;
    }
    
    .right-container {
        gap: 10px;
    }
    
    .LogoAndMenu {
        padding: 10px;
    }

    .main-container {
        padding: 10px;
        width: 95%;
    }
      .header {
        width: 95%;
    }
    .content-wrapper {
        /* padding: 15px; */
    }

    .IN-icons {
        margin-left: 10px;
    }
    
    .tooltip {
        width: 250px;
    }
}

/* 中等屏幕（平板） */
@media (min-width: 769px) and (max-width: 992px) {
    .popup {
        display: none;
    }

    .IN-icons {
        margin-left: 10px;
    }
      .main-container {
        width: 85%;
    }
      .header {
        width: 85%;
    }
    .InputContainer {
  
  width: 100px !important;
  }
}

/* 大屏幕（小笔记本） */
@media (min-width: 993px) and (max-width: 1200px) {
    .InputContainer {
  
    width: 230px !important;
    }
    .popup {
        display: none;
    }
     .main-container {
        width: 75%;
    }
      .header {
        width: 75%;
    }
}

/* 超大屏幕（台式机） */
@media (min-width: 1201px) {
 .popup {
        display: none;
    }

    .header {
        width: 65%;
    }

    .main-container {
        width: 65%;
    }
}

/* 滚动条样式 */
.content-wrapper::-webkit-scrollbar {
    width: 6px;
}

.content-wrapper::-webkit-scrollbar-track {
    background: transparent;
}

.content-wrapper::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

.content-wrapper::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
}

/* 主要内容区域样式 */
.content-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    background: var(--background-color);
    border-radius: 12px;
    box-shadow: 0 2px 12px var(--shadow-color);
}

/* IN-icons样式 */
.IN-icons {
    display: flex;
    align-items: center;
    margin-left: 20px;
}

.tooltip-container {
    position: relative;
    cursor: pointer;
}

.tooltip-container .text {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.tooltip-container .text:hover {
    background: var(--active-background);
}

.tooltip-container .text img {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
}

.tooltip-container:hover .text img {
    transform: scale(1.1);
}

.tooltip {
    position: absolute;
    top: 100%;
    right: -123px;
    width: 300px;
    background: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 4px 20px var(--shadow-color);
    padding: 15px;
    margin-top: 10px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.3s ease;
    z-index: 1000;
}

.tooltip-container:hover .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.tooltip h2 {
    font-size: 16px;
    margin: 10px 0;
    color: var(--text-color);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.tooltip img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
}

.tooltip span {
    display: block;
    text-align: center;
    color: var(--text-color);
    opacity: 0.7;
    font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .IN-icons {
        margin-left: 10px;
    }
    
    .tooltip {
        width: 250px;
    }
}

@media (max-width: 576px) {
    .IN-icons {
        margin-left: 5px;
    }
    
    .tooltip {
        width: 200px;
    }
    
    .tooltip img {
        height: 120px;
    }
}

.popup {
    display: none;
    position: relative;
    z-index: 1000;
    margin-bottom: 0 !important;
}

.burger {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 5px;
}

.burger .icon {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease;
}

.burger .icon path {
    fill: var(--text-color);
}

.popup-window {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--background-color);
    box-shadow: -2px 0 10px var(--shadow-color);
    transition: right 0.3s ease;
    z-index: 1014;
    padding: 0px 6px 0px;
    overflow-y: auto;
    min-width: 100px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
}
.popup-window svg{
    width: 15px;
    height: 15px;
    margin-right: 5px;
}
.popup-window[style*="display: block"] {
    right: 0;
}

.popup-window ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.popup-window ul li {
    margin: 10px 0;
}

.popup-window ul li button {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 12px 15px;
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 16px;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.popup-window ul li button.active {
    background: var(--button-color);
    color: white;
}

.popup-window ul li button:hover {
    background: var(--active-background);
}

.popup-window ul li button.active:hover {
    background: var(--button-color);
    color: white;
}

/* 移动端显示汉堡菜单 */
@media (max-width: 768px) {
    .popup {
        display: block;
    }
    
    .menu {
        display: none;
    }
}

/* 小屏幕适配 */
@media (max-width: 576px) {
    
    
    .popup-window ul li button {
        padding: 15px;
        font-size: 18px;
    }
}

/* 搜索框样式 */
.InputContainer {
    position: relative;
    width: 300px;
    height: 40px;
    border-radius: 12px;
    /* background: var(); */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 12px var(--shadow-color);
}

@media (max-width: 768px) {
    .InputContainer {
        width: 40px;
        transition: width 0.3s ease;
    }

    .InputContainer.expanded {
        width: 300px;
    }

    .InputContainer:not(.expanded) .input {
        opacity: 0;
        width: 0;
        padding: 0;
    }
}

.input {
    width: 100%;
    height: 100%;
    border: none;
    background: none;
    outline: none;
    padding: 0 40px 0 15px;
    font-size: 16px;
    color: var(--text-color);
    border-radius: 12px;
}

.labelforsearch {
    position: absolute;
    right: 1px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 2;
    margin: 0 !important;
}

.searchIcon {
    width: 20px;
    height: 20px;
    fill: var(--text-color);
    transition: all 0.3s ease;
}

.InputContainer:hover .searchIcon {
    transform: scale(1.1);
}

.InputContainer ul {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--background-color);
    border-radius: 10px;
    box-shadow: 0 2px 12px var(--shadow-color);
    z-index: 1000;
    max-height: 400px;
    overflow-y: auto;
    padding: 10px 0;
    margin-top: 5px;
    scrollbar-width: thin;
    scrollbar-color: var(--text-color) transparent;
}

.InputContainer ul::-webkit-scrollbar {
    width: 6px;
}

.InputContainer ul::-webkit-scrollbar-track {
    background: transparent;
}

.InputContainer ul::-webkit-scrollbar-thumb {
    background-color: var(--text-color);
    border-radius: 3px;
}

.InputContainer ul li {
    padding: 8px 15px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.InputContainer ul li:hover {
    background-color: var(--ActiveBgc);
}

.InputContainer ul li a.search-result-item {
    color: var(--text-color);
    text-decoration: none;
    display: block;
    width: 100%;
    padding: 10px 15px;
}

.InputContainer ul li a.search-result-item h3 {
    margin: 0 0 5px;
    font-size: 16px;
    font-weight: 500;
}

.InputContainer ul li a.search-result-item p {
    margin: 0;
    font-size: 14px;
    color: #666;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@media (max-width: 768px) {
    .InputContainer ul {
        width: 250px;
        left: 50%;
        transform: translateX(-50%);
    }
}

.highlight {
    background-color: rgba(255, 193, 7, 0.3);
    padding: 0 2px;
    border-radius: 2px;

    transition: all 0.3s ease;
}

.InputContainer ul li:hover {
    background: var(--active-background);
}

.InputContainer ul li a {
    color: var(--text-color);
    text-decoration: none;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.InputContainer ul svg {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.InputContainer ul svg:hover {
    transform: scale(1.1);
}

/* 移动端样式 */
@media (max-width: 768px) {
    .InputContainer {
        width: 40px;
        border-radius: 50%;
    }

    .InputContainer.expanded {
        width: 250px;
        border-radius: 20px;
    }

    .input {
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .InputContainer.expanded .input {
        opacity: 1;
    }

    .InputContainer ul {
        width: 250px;
    }
}

@media (max-width: 576px) {
    .InputContainer.expanded {
        width: 200px;
    }
    
    .input {
        font-size: 14px;
    }

    .InputContainer ul {
        width: 200px;
    }
}
</style>
