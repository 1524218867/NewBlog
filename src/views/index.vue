<template>
    <div>
        <div class="container">
            <div class="sidebar">
                <div class="LogoAndMenu">
                    <div class="logo">
                        <img src="../../public/logo.png" alt="Logo" />
                    </div>
                    <ul class="menu">
                        <li v-for="(image, key, index) in currentImages" :key="key" @click="
                            index === Object.keys(currentImages).length - 1
                                ? logout()
                                : changeImage(key)
                            " :class="{ active: key === activeSection }">
                            <img :src="key === activeSection ? activeImages[key] : image" :alt="key" />
                        </li>
                    </ul>
                </div>
            </div>

            <div class="content-wrapper">
                <div class="main-content" id="main-content">
                    <div class="content-section" v-if="currentSection === 'home'" id="section1">
                        <!-- <ForActicle></ForActicle> -->
                        <div class="Zhong-container">
                            <header>
                                <div class="Input-but">
                                    <input type="text" placeholder="Search article you want..." class="search-bar"
                                        @focus="highlightButton" @blur="resetButton" />
                                    <button class="search-button" :class="{ highlight: isButtonHighlighted }">
                                        <img src="../../public/SouSuo.png" alt="搜索" />
                                    </button>
                                </div>

                                <div class="icons">
                                    <img src="../../public/Xiaoxi.png" alt="消息" />
                                    <img src="../../public/ShouCang.png" alt="收藏" />
                                </div>
                            </header>

                            <section class="article-of-the-day">
                                <div class="section-header">
                                    <h2>今日文章</h2>
                                    <button class="view-more">查看更多</button>
                                </div>
                                <div class="main-article">
                                    <router-link :to="{
                                        name: 'Article',
                                        params: { id: latestArticle._id || '' },
                                    }">
                                        <div class="article-cover">
                                            <!-- 确保图片路径包含 '/uploads/' 前缀 -->
                                            <div>
                                                <h2 class="article-title">
                                                    {{ latestArticle.title || 'No title available' }}
                                                </h2>
                                                <button class="article-button">现在阅读</button>
                                            </div>
                                            <div>
                                                <img :src="getImageUrl(latestArticle.coverImage || '')" alt="Article Cover"
                                                    class="cover-image" />
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </section>

                            <section class="topic-match">
                                <h2>适合你的话题</h2>
                                <div class="tags">
                                    <!-- 遍历分类按钮 -->
                                    <button v-for="category in articleCategories" :key="category._id"
                                        @click="filterArticlesByCategory(category)" :class="{
                                            active:
                                                selectedCategory &&
                                                selectedCategory._id === category._id,
                                        }" class="tag">
                                        {{ category.name }}
                                    </button>
                                </div>

                                <div class="articles">
                                    <router-link v-for="article in filteredArticles" :key="article._id"
                                        :to="{ name: 'Article', params: { id: article._id } }" class="article-link">
                                        <div class="article">
                                            <!-- 确保图片路径包含 '/uploads/' 前缀 -->
                                            <div class="article-img">
                                                <img :src="getImageUrl(article.coverImage)" alt="Article Image" />
                                            </div>

                                            <h3>{{ article.title }}</h3>
                                            <p>{{ article.author }}</p>
                                            <!-- <div class="author-info">
                                                <span>by {{ article.author }}</span>
                                                <span>{{ article.readingTime }} min read</span>
                                            </div> -->
                                        </div>
                                    </router-link>
                                </div>
                            </section>
                        </div>
                    </div>
                    <div class="content-section" v-if="currentSection === 'categories'" id="section2">
                        <!-- 第二个内容块 -->
                        <h2>第二个内容块</h2>
                    </div>
                    <div class="content-section" v-if="currentSection === 'favorites'" id="section3">
                        <Content></Content>
                    </div>
                    <div class="content-section" v-if="currentSection === 'settings'" id="section4">
                        <!-- 第三个内容块 -->
                        <h2>第4个内容块</h2>
                        <img :src="getUser.avatar" alt="当前头像" />
                        <input type="file" @change="uploadAvatar" />
                    </div>
                </div>
            </div>

            <div class="user-info-wrapper">
                <div class="user-info">
                    <div class="user-card">
                        <!-- <img src="user.jpg" alt="User Image">
                        <h3>Emir Abiyy</h3>
                        <p>Member</p> -->
                        <div v-if="!isLoggedIn" id="loginSection" class="logo">
                            <div v-on:click="goToLogin" class="glass-container" id="glass">
                                登录
                            </div>
                            <!-- <div v-on:click="goToRegister" class="glass-container" id="glass">注册</div> -->
                        </div>

                        <div v-else id="welcomeSection" class="userlogo">
                            <div class="LogoImg">
                                <img :src="getUser.avatar" alt="用户头像" />
                            </div>

                            <span> 欢迎, {{ getUser.username }}! </span>
                        </div>
                    </div>
                    <div class="premium-promo">
                        <p>Wanna read more? Be a Premium Member</p>
                        <button>Learn more</button>
                    </div>
                    <div class="continue-reading">
                        <h4>继续阅读</h4>
                        <div v-if="!noArticlesMessage" class="reading-article">
                            <!-- 显示最近浏览的未完成文章 -->
                            <div v-if="lastViewedArticle" class="article-preview">
                                <router-link :to="`/article/${lastViewedArticle.articleId}`">
                                    <div class="article-image">
                                        <img :src="getImageUrl(lastViewedArticle.coverImage)" alt="Article Cover">
                                    </div>
                                    <div class="article-info">
                                        <h3>{{ lastViewedArticle.title }}</h3>
                                        <div class="progress-container">
                                            <div class="progress"
                                                :style="{ width: calculateProgress(lastViewedArticle.scrollPosition, lastViewedArticle.maxScrollPosition) + '%' }">
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                        <div v-else>
                            <p>继续去发现好的文章吧</p>
                        </div>
                    </div>




                    <div class="more-topics">
                        <h4>More Interesting Topic</h4>
                        <div class="tags">
                            <span>Health</span>
                            <span>Social Media</span>
                            <span>Politics</span>
                            <span>Productivity</span>
                            <span>Business</span>
                            <span>Money</span>
                            <span>Self Development</span>
                            <span>Programming</span>
                        </div>
                    </div>
                    <div class="user-card">
                        <!-- <img src="user.jpg" alt="User Image"> -->
                        <h3>Emir Abiyy</h3>
                        <p>Member</p>
                    </div>

                    <div class="continue-reading">
                        <h4>Continue Reading</h4>
                        <div class="reading-article">
                            <!-- <img src="robot.jpg" alt="Robot Image"> -->
                            <h4>Why You Need AI Robot for Your Office and How It Works</h4>
                            <p>
                                In this article, we'll learn about how to discuss about robot
                                and future work.
                            </p>
                            <button>Continue</button>
                        </div>
                    </div>
                    <div class="more-topics">
                        <h4>More Interesting Topic</h4>
                        <div class="tags">
                            <span>Health</span>
                            <span>Social Media</span>
                            <span>Politics</span>
                            <span>Productivity</span>
                            <span>Business</span>
                            <span>Money</span>
                            <span>Self Development</span>
                            <span>Programming</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import 'slick-carousel'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
// import '../utils/index'
import { mapGetters, mapActions } from 'vuex'
import Content from './Content.vue'
import ForActicle from './ForActicle.vue'
import { Notification } from 'element-ui' // 确保你已经引入了 Notification
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';

export default {
    data() {
        return {
            articles: [], // 用于存储文章列表
            latestArticle: {}, // 最新文章，初始化为空对象
            user: null, // 用户信息，初始化为 null
            currentSection: 'home', // 当前显示的内容块，默认显示 'home'
            activeSection: 'home', // 当前激活的菜单项
            isButtonHighlighted: false, // 按钮高亮状态
            articleCategories: [], // 存储文章分类
            filteredArticles: [], // 根据分类筛选后的文章
            selectedCategory: null, // 默认选中“全部”分类
            defaultCategoryId: 'all', // 默认分类 ID
            viewedArticles: [],//浏览记录
            lastViewedArticle: null, // 要显示的文章
            noArticlesMessage: false,// 是否显示“继续去发现好的文章”消息
            scrollPosition: 0, // 当前文章的滚动位置
            maxScrollPosition: 0,// 当前文章的最大滚动高度
            currentImages: {
                home: require('../../public/home.png'),
                categories: require('../../public/home.png'),
                favorites: require('../../public/home.png'),
                settings: require('../../public/settings.png'),
                logout: require('../../public/logout.png'),
            },
            activeImages: {
                home: require('../../public/home-Bai.png'),
                categories: require('../../public/home-Bai.png'),
                favorites: require('../../public/home-Bai.png'),
                settings: require('../../public/settings-Bai.png'),
                logout: require('../../public/logout-Bai.png'),
            },
        }
    },

    components: {
        ForActicle,
        Content,
    },

    computed: {
        ...mapGetters(['isLoggedIn', 'getUser']),
        // 计算属性，用于确保按钮的 active 类名
        activeCategory() {
            return this.selectedCategory ? this.selectedCategory._id : null;
        },

    },


    created() {

        this.fetchArticles() // 获取文章
        this.fetchCategories() // 获取分类
        this.fetchViewedArticles();
        // 默认选择“全部”分类
        this.selectedCategory = { _id: 'all', name: '全部' }
        this.filterArticlesByCategory(this.selectedCategory) // 根据默认分类筛选文章

        const token = localStorage.getItem('authToken')
        if (token) {
            this.$store.dispatch('updateUser', { token, details: {} }) // 更新用户信息
        }
    },

    methods: {
        ...mapActions(['logout']),

        goToLogin() {
            this.$router.push('/Login')
        },

        goToRegister() {
            this.$router.push('/Login')
        },

        goToSettings() {
            this.activeSection = 'settings' // 更新当前显示内容块为设置
        },

        async logout() {
            try {
                if (!this.$store.getters.isLoggedIn) {
                    Notification.warning({
                        title: '未登录',
                        message: '您尚未登录，无法执行退出操作。',
                        duration: 3000,
                    })
                    return
                }
                await this.$store.dispatch('logout') // 调用 Vuex 的 logout action
                localStorage.removeItem('token') // 清除本地存储中的 token
                Notification.success({
                    title: '退出登录成功',
                    message: '您已成功退出登录。',
                    duration: 3000,
                })
                this.$router.push('/Login') // 跳转到登录页面
            } catch (error) {
                Notification.error({
                    title: '退出登录失败',
                    message: '退出登录过程中出现错误，请稍后重试。',
                    duration: 3000,
                })
                console.error('Error:', error)
            }
        },

        changeImage(section) {
            this.currentSection = section // 设置当前显示的内容块
            this.activeSection = section // 更新激活的菜单项
        },

        highlightButton() {
            this.isButtonHighlighted = true // 设置按钮高亮
        },

        resetButton() {
            this.isButtonHighlighted = false // 重置按钮高亮
        },

        async fetchArticles() {

            try {
                const response = await axios.get('http://localhost:5000/api/articles', {

                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                this.articles = response.data // 存储文章列表
                console.log(response.data)
                this.filteredArticles = this.articles // 默认显示所有文章
                this.latestArticle =
                    this.articles.length > 0
                        ? this.articles[this.articles.length - 1]
                        : {} // 设置最新文章
            } catch (error) {
                console.error('Error fetching articles:', error)
            }
        },

        async fetchCategories() {
            try {
                const response = await axios.get('http://localhost:5000/api/categories')
                // console.log(response.data);
                this.articleCategories = response.data // 存储文章分类

                // 默认选择第一个分类作为“全部”分类
                if (this.articleCategories.length > 0) {
                    this.selectedCategory = this.articleCategories[0] // 默认选择第一个分类
                    this.filterArticlesByCategory(this.selectedCategory) // 根据默认分类筛选文章
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        },

        filterArticlesByCategory(selectedCategory) {
            this.selectedCategory = selectedCategory // 更新当前选择的分类

            if (selectedCategory.name === '全部') {
                this.filteredArticles = this.articles // 显示所有文章
            } else {
                this.filteredArticles = this.articles.filter((article) =>
                    // 遍历文章的分类，判断是否有匹配选中的分类
                    article.categories.some(
                        (category) => category._id === selectedCategory._id
                    )
                )
            }
        },

        getImageUrl(imageName) {
            return `http://localhost:5000/uploads/${imageName}` // 拼接图片 URL
        },
        async uploadAvatar(event) {

            const file = event.target.files[0]
            const formData = new FormData()
            formData.append('avatar', file)
            try {
                const response = await axios.post(
                    'http://localhost:5000/api/user/update-avatar',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                )
                this.getUser.avatar = response.data.avatar
            } catch (error) {
                console.error('Error updating avatar:', error)
            }
        },
        //获取浏览记录
        async fetchViewedArticles() {
            try {
                const response = await axios.get('http://localhost:5000/api/user/viewed-articles', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                console.log("获取到了浏览记录", response);
                this.viewedArticles = response.data; // 假设 API 返回的数据是一个数组

                // 更新 noArticlesMessage 的状态
                if (this.viewedArticles.length === 0) {
                    this.noArticlesMessage = true; // 没有文章时显示消息
                    this.lastViewedArticle = null; // 没有文章时清空 lastViewedArticle
                    return;
                }

                // 根据 lastViewedAt 时间排序
                const sortedArticles = [...this.viewedArticles].sort((a, b) => new Date(b.lastViewedAt) - new Date(a.lastViewedAt));

                // 查找未完成的文章
                const unfinishedArticles = sortedArticles.filter(article => this.calculateProgress(article.scrollPosition, article.maxScrollPosition) < 100);

                if (unfinishedArticles.length > 0) {
                    // 有未完成的文章，设置 lastViewedArticle 为最近浏览的未完成文章
                    this.lastViewedArticle = unfinishedArticles[0]; // 由于已经按时间排序，直接取第一个
                    this.noArticlesMessage = false;
                } else {
                    // 所有文章都完成了，设置 lastViewedArticle 为最后一篇文章
                    this.lastViewedArticle = sortedArticles[0]; // 由于已经按时间排序，直接取第一个
                    this.noArticlesMessage = false;
                }
            } catch (error) {
                console.error('Error fetching viewed articles:', error);
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
            console.log("");
            if (!token) return true;

            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000); // 当前时间（秒）

                // 检查当前时间是否超过 token 的过期时间
                return decodedToken.exp < currentTime;
            } catch (error) {
                console.error('Token decoding failed:', error);
                return true; // 如果解码失败，视为 token 已过期
            }
        },
        //从本地获取token，然后传给isTokenExpired处理,isTokenExpiredr如果返回true，就调用退出登录方法
        checkTokenAndRedirect() {

            const token = localStorage.getItem('token')

            if (this.isTokenExpired(token)) {
                Notification.error({
                    title: '登录信息已失效',
                    message: '请从新登录',
                    duration: 3000,
                })
                this.logout(); // 如果 token 已过期，执行退出登录操作
            }
        },

    },
    mounted() {
        // 在组件挂载后执行
        this.fetchViewedArticles()
        this.checkTokenAndRedirect(); // 组件挂载时检查 token
    },

}
</script>
<style scoped>
body,
html {
    height: 100%;
    overflow: hidden;
    /* 禁止页面滚动 */
    font-size: 16px;
    /* 1rem = 16px */
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30px;
    border-bottom: 1px solid #ccc;
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

.Input-but {
    width: 80%;
}

.search-bar {
    width: 60%;
    padding: 18px;
    border-radius: 20px 0 0 20px;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
}

.search-bar:focus {
    border-color: #000000;
    outline: none;
    /* box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); */
    border-right-color: transparent;
    /* 设置左边框颜色为透明 */
}

.search-button {
    padding: 18px;
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-radius: 0px 20px 20px 0px;
}

.search-button.highlight {
    border-color: #000000;
    /* 点击时的边框颜色 */
    /* box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); */
    /* 添加阴影效果 */
    border-left-color: transparent;
}

.search-button>img {
    width: 23px;
}

.icons img {
    width: 30px;
    margin-left: 30px;
    cursor: pointer;
}

.article-of-the-day {
    margin-top: 20px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.view-more {
    /* border: none; */
    background-color: transparent;
    color: #333;
    cursor: pointer;
    border: 1px solid;
    padding: 10px 20px;
    border-radius: 30px;
}

.main-article {
    margin-top: 40px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;

    box-shadow: rgba(0, 0, 0, 0.4) 0px 10px 30px;
    cursor: pointer;
    transition: all 0.5s;
}

.main-article:hover {
    transform: scale(1.021);
}

.main-article:active {
    transform: scale(0.95) rotateZ(1.1deg);
}

.article-cover {
    min-width: 500px;
    display: flex;
    height: 100%;
    width: 100%;
    height: auto;
    aspect-ratio: 2 / 1;
    /* 大盒子的宽高比为2:1 */
}

.article-cover>div:nth-child(1) {
    flex: 1;
    background-image: url(../../public/JinRiWengZhang.png);
    background-size: cover;
    /* 使背景图片完全覆盖容器 */
    background-position: center;
    /* 背景图片居中对齐 */
    background-repeat: no-repeat;
    /* 防止背景图片重复 */
    aspect-ratio: 1 / 1;
    /* 小盒子的宽高比为1:1 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
}

a {
    text-decoration: none;
    /* 移除所有链接的下划线 */
}

.article-cover h2 {
    width: 85%;
    text-decoration: none;
}

.article-cover>div:nth-child(2) {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1;
    /* 小盒子的宽高比为1:1 */

}

.article-cover>div:nth-child(2)>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 让图片完整覆盖容器，保持比例 */
}

.article-button {
    background-color: #ffffff;

    color: #000000;
    padding: 10px 30px;
    border-radius: 30px;
}

/* From Uiverse.io by cssbuttons-io */
.article-button {
    position: relative;
    font-size: 17px;
    text-transform: uppercase;
    text-decoration: none;
    padding: 1em 2.5em;
    display: inline-block;
    border-radius: 6em;
    transition: all .2s;
    border: none;
    font-family: inherit;
    font-weight: 500;
    color: black;
    background-color: white;
}

.article-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.article-button:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.article-button::after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 100%;
    border-radius: 100px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    transition: all .4s;
}

.article-button::after {
    background-color: #fff;
}

.article-button:hover::after {
    transform: scaleX(1.4) scaleY(1.6);
    opacity: 0;
}

.article-title {
    font-size: 2vw;
    overflow-wrap: break-word;
    color: #ffffff;

}

.article-info {

    max-width: 100%;
}

.article-info h3 {
    margin: 20px 0;
    color: #000;
    font-size: 24px;
}

.article-info p {
    color: #666;
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

.topic-match {
    margin-top: 40px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
}

.tag {
    padding: 10px 20px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    cursor: pointer;
}

.tag.active {
    background-color: #000;
    color: #fff;

}

.articles {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
}

.article-link {
    width: 48%;
    height: 100%;
}

.article {
    width: 100%;
    background-color: #fff;
    /* border-radius: 10px; */
    overflow: hidden;
    margin-bottom: 20px;
    margin-right: 4%;
    border-radius: 10px;
}

.article:nth-child(2n) {
    margin-right: 0;
}

.article img {
    width: 100%;
    height: 100%;
    height: auto;
    overflow: hidden;
    transition: all 0.5s;
}

.article-img {
    border-radius: 10px 10px 10px 10px;

    overflow: hidden;
}

.article img:hover {
    transform: scale(1.021);
}

.article img:active {
    transform: scale(0.95) rotateZ(1.1deg);
}

.article h3 {
    margin: 0;
    color: #000;
    padding: 15px 0px;
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
}

.article p {
    padding: 0 0px;
    color: #666;
}

.author-info {
    padding: 10px 20px;
    color: #999;
}

.container {
    display: flex;
    height: 100%;
    width: 100%;
    padding: 0;
    background-color: #ffffff;
}

.sidebar {
    /* margin-right: 20px; */
    width: 122px;
    background-color: #ffffff;
    min-width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid #e2e1e1;
    justify-content: space-between;
    height: 100vh;
}

.sidebar .logo {
    margin-bottom: 30px;
}

.sidebar>div>.logo>img {
    width: 100%;
    height: 100%;
}

.sidebar .menu {
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60%;
    height: 100%;
    position: relative;
}

.menu li.active {
    background-image: url(../../public/AnNiu.png);
    /* background-color: black; */
    /* 这里设置你希望的激活状态下的背景颜色 */
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);

    background-size: cover;
    /* 图片覆盖整个盒子 */
    background-position: center;
    /* 图片居中显示 */
    background-repeat: no-repeat;
    /* 防止图片重复 */
}

.menu li:nth-last-child(1) {
    position: absolute !important;
    /* 让最后1个元素固定在底部 */
    bottom: 20px;
}

.menu li:nth-last-child(2) {
    position: absolute !important;
    /* 让最后2个元素固定在底部 */
    bottom: 100px;
}

.sidebar .menu li {
    margin: 30px 0 0 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 0 10px 0;
    height: 55px;
    border-radius: 10px;
}

.sidebar .menu img {
    width: 40%;
    height: 80%;
}

.LogoAndMenu {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
}

.active {
    background-color: black;
    /* color: white; */
    /* 如果需要，设置文本颜色为白色 */
}

.article-preview {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    flex-direction: column;
}



.article-image img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-right: 20px;
}

.article-info {
    flex-grow: 1;
}



.progress-container {
    background: #e0e0e0;
    border-radius: 5px;
    height: 7px;
    width: 100%;
    /* Adjust based on your layout */
    position: relative;
}

.progress {
    background: #000000;
    height: 100%;
    border-radius: 5px;
    transition: width 0.3s ease;
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

.user-info-wrapper {
    min-width: 250px;
    flex: 1;
    background-color: #ffffff;
    overflow-y: auto;
    /* 启用垂直滚动条 */
    padding: 20px;
    height: 100vh;
    border-left: 1px solid #e2e1e1;
}

.userlogo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.LogoImg {
    border-radius: 50%;
    width: 60px;
    height: 60px;
    overflow: hidden;
}

.LogoImg>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.userlogo>span {
    flex: 1;
    padding: 20px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.tags span {
    background-color: #f0f0f0;
    padding: 5px 10px;
    border-radius: 15px;
    cursor: pointer;
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

.continue-reading {
    border-bottom: 1px solid #ccc;
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

.continue-reading img {
    width: 100%;
    height: auto;

    border-radius: 5px;
    margin-bottom: 10px;
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

@media (min-width: 1904px) {
    .container {
        max-width: 1920px;
    }
}

/* 小于是max，大于是min */
@media (max-width: 1200px) {
    .container {
        max-width: 1920px;
    }

    .article-link {
        width: 100%;
        height: 100%;
    }
}

@media (max-width: 992px) {
    .container {
        max-width: 1920px;
    }
}

@media (min-width: 768px) {
    .container {
        max-width: 1920px;
    }
}

@media (min-width: 576px) {
    .container {
        max-width: 1920px;
    }
}
</style>
