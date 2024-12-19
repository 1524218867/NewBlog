<template>

    <div class="content-section" id="section1">
        <div class="Zhong-container">
            <header>
                <div class="Input-but">
                    <input type="text" v-model="keyword" @keyup.enter="searchArticles" placeholder="输入关键词搜索..."
                        @input="onInputChange" class="search-bar" @focus="highlightButton" @blur="resetButton" />
                    <button class="search-button" @click="searchArticles" :class="{ highlight: isButtonHighlighted }">
                        <img src="../../public/SouSuo.png" alt="搜索" />
                    </button>
                    <ul>
                        <li v-for="article in articles" :key="article._id">
                            <router-link :to="{ name: 'Article', params: { id: article._id } }">
                                {{ article.title }}
                            </router-link>
                        </li>
                    </ul>
                </div>

                <div class="IN-icons">

                    <div class="tooltip-container">
                        <div class="tooltip">
                            <div v-if="UserColl.length > 0">
                                <div v-for="article in UserColl" :key="article.articleId._id">
                                    <img :src="getImageUrl(article.articleId.coverImage, 'uploads')" alt="文章封面" />
                                    <router-link :to="{ name: 'Article', params: { id: article.articleId._id } }">
                                        <h2>{{ article.articleId.title }}</h2>
                                    </router-link>
                                </div>
                            </div>
                            <span v-else>暂无收藏文章哦！</span>
                        </div>

                        <span class="text"><img src="../../public/ShouCang.png" alt="收藏" /></span>
                    </div>
                    <!-- <div class="tooltip-container">
                        <div class="tooltip">
                            111
                        </div>
                        <span class="text">
                            <img src="../../public/Xiaoxi.png" alt="消息" />
                        </span>
                    </div> -->
                </div>
            </header>

            <section class="article-of-the-day">

                <div class="main-article">

                    <div class="article-cover">

                        <div>
                            <router-link :to="{
                                name: 'Article',
                                params: { id: HomelatestArticle._id || '' },
                            }">
                                <div class="article-content">
                                    <h2 class="article-title">{{ HomelatestArticle.title || 'No title available'
                                        }}</h2>
                                    <h3 class="article-brief">{{ HomelatestArticle.BriefIntroduction }}</h3>
                                    <div class="article-info">
                                        <img :src="getImageUrl(SpecifyUserInformation.avatar, 'UserImg')">
                                        <span>{{ SpecifyUserInformation.username }}</span>
                                    </div>
                                </div>

                                <button class="article-button">现在阅读</button>
                            </router-link>
                        </div>
                        <div>
                            <img :src="getImageUrl(HomelatestArticle.coverImage, 'uploads')" alt="Article Cover"
                                class="cover-image" />
                        </div>
                    </div>

                </div>
            </section>

            <section class="topic-match">
                <h2>适合你的话题</h2>
                <div class="tags">

                    <button v-for="category in articleCategories" :key="category._id"
                        @click="filterArticlesByCategory(category)"
                        :class="{ active: selectedCategory && selectedCategory._id === category._id, }" class="tag">{{
                            category.name }}</button>
                </div>

                <div class="articles" v-if="!IsDisplay">
                    <router-link v-for="article in HomefilteredArticles" :key="article._id"
                        :to="{ name: 'Article', params: { id: article._id } }" class="article-link">
                        <div class="article">

                            <div class="article-img">
                                <img :src="getImageUrl(article.coverImage, 'uploads')" alt="Article Image" />
                            </div>

                            <h3>{{ article.title }}</h3>
                            <span>{{ article.BriefIntroduction }}</span>
                            <div class="IH-articlesImgAndName">
                                <img :src="getImageUrl(getUser.avatar, 'UserImg')" />
                                <p>{{ article.author }}</p>


                            </div>


                        </div>
                    </router-link>

                </div>
                <div v-else class="no-articles">快去发布文章吧！</div>
            </section>
        </div>
    </div>


</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import axios from "axios";
import { mapGetters } from "vuex";
import { Notification } from "element-ui";
import router from "@/router";
export default {


    components: {

    },
    data() {
        return {
            keyword: '',
            articles: [],
            IsDisplay: null,
            Homearticles: [], // 用于存储文章列表
            HomefilteredArticles: [], // 根据分类筛选后的文章
            HomelatestArticle: {}, // 最新文章，初始化为空对象
            isButtonHighlighted: false, // 按钮高亮状态
            SpecifyUserInformation: '',
            articleCategories: [], // 存储文章分类
            allactive: {
                _id: "all",
                name: "全部"
            },
            selectedCategory: { _id: "all", name: "全部" }, // 默认选中“全部”分类
            UserColl: [],
        };
    },
    computed: {
        ...mapGetters(["isLoggedIn", "getUser"]),

    },
    methods: {
        //搜索
        async searchArticles() {
            if (!this.keyword) {
                this.message = '请输入关键词进行搜索'; // 提示输入关键词
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
                        this.articles = data; // 展示搜索结果
                        this.message = ''; // 清空提示
                    } else {
                        this.message = '没有找到相关的文章'; // 提示无结果
                    }
                } else if (response.status === 404) {
                    this.message = '没有找到相关的文章'; // 后端显式返回 404
                    console.log('没有找到相关的文章');
                    Notification.error({
                        title: "错误",
                        message: "没有找到相关的文章",
                        duration: 3000,
                    });

                } else if (response.status === 400) {
                    this.message = '请输入关键词进行搜索'; // 关键词为空
                    Notification.info({
                        title: "错误",
                        message: "请输入关键词进行搜索",
                        duration: 3000,
                    });
                } else {
                    this.message = '服务器出错，请稍后再试'; // 其他错误
                    Notification.error({
                        title: "错误",
                        message: "服务器出错，请稍后再试",
                        duration: 3000,
                    });
                }
            } catch (error) {
                console.error(error);
                this.message = '网络错误，请检查网络连接'; // 网络问题
                Notification.error({
                    title: "错误",
                    message: "网络错误，请检查网络连接",
                    duration: 3000,
                });
            }
        },

        onInputChange() {
            if (!this.keyword.trim()) {
                // 输入框为空时清空结果和提示
                this.articles = [];
                this.message = '请输入关键词进行搜索';
            }
        },
        //获取分类文章
        async fetchCategories() {
            try {
                // 发送GET请求获取文章分类
                const response = await axios.get("/api/categories");
                this.articleCategories = response.data; // 存储文章分类

                this.articleCategories.unshift(this.allactive);// 添加全部分类


                // 默认选择第一个分类作为“全部”分类
                if (this.articleCategories.length > 0) {
                    this.selectedCategory = this.articleCategories[0]; // 默认选择第一个分类
                    this.filterArticlesByCategory(this.selectedCategory); // 根据默认分类筛选文章
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        },
        //获取分类
        filterArticlesByCategory(selectedCategory) {


            this.selectedCategory = selectedCategory; // 更新当前选择的分类
            // console.log('当前选择的分类', this.selectedCategory);

            if (selectedCategory.name === "全部") {
                // console.log('进入到了全部分类里面');
                this.IsDisplay = false;
                this.HomefilteredArticles = this.Homearticles; // 显示所有文章
                // console.log('获取到全部分类的文章', this.HomefilteredArticles);

            } else {
                // console.log('获取到当前分类', this.selectedCategory);

                this.HomefilteredArticles = this.Homearticles.filter((article) =>
                    article.categories.some(
                        (category) => category._id === selectedCategory._id
                    )

                );
                if (this.HomefilteredArticles.length === 0) {//如果当前分类没有文章，则显示
                    this.IsDisplay = true;


                } else {
                    this.IsDisplay = false;

                }
                // console.log('获取到当前分类的文章', this.HomefilteredArticles);

            }
        },
        highlightButton() {
            this.isButtonHighlighted = true; // 设置按钮为高亮状态
        },
        resetButton() {
            this.isButtonHighlighted = false; // 取消按钮高亮状态
        },
        getImageUrl(imageName, type = 'uploads') {
            if (!imageName) {
                // 如果 imageName 为空，返回 null 或空字符串
                return null;
            }

            // 判断当前环境
            const isDevelopment = process.env.NODE_ENV === 'development';

            // 根据环境拼接图片路径
            let imageUrl;
            if (isDevelopment) {
                // 开发环境使用 localhost:3000
                imageUrl = `http://localhost:3000/${type}/${imageName}`;
            } else {
                // 生产环境使用当前域名
                imageUrl = `${window.location.origin}/${type}/${imageName}`;
            }

            // console.log('拼接后的请求路径是', imageUrl);
            return imageUrl;
        },
        //获取文章
        // 异步获取文章列表
        async HomefetchArticles() {

            try {
                // 发送GET请求，获取文章列表
                const response = await axios.get("/api/articles");
                this.Homearticles = response.data; // 存储文章列表
                // console.log(response.data);
                this.HomefilteredArticles = this.Homearticles; // 默认显示所有文章
                this.HomelatestArticle =
                    this.Homearticles.length > 0
                        ? this.Homearticles[this.Homearticles.length - 1]
                        : {}; // 设置最新文章
                console.log('文章的所有属性', this.HomelatestArticle);
                if (this.HomelatestArticle.user == undefined) {
                    return
                }
                this.getUserImgOrObject(this.HomelatestArticle.user);
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        },
        async getUserImgOrObject(userId) {//获取指定用户的信息


            try {
                const response = await axios.get(`/api/public-user-info/${userId}`);
                this.SpecifyUserInformation = response.data;
                // console.log('获取特定用户信息成功:', response.data);

                return response.data;
            } catch (error) {
                console.error('获取特定用户信息失败:', error);
            }
        },
        //获取用户收藏记录
        async loadFavorites() {


            if (!localStorage.getItem('token')) {
                return;
            }
            const response = await axios.get('/api/user', {
                //获取用户信息。
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            const LoaduserId = response.data._id // 获取当前用户的 ID

            try {
                const response = await axios.get(`/api/favorites/${LoaduserId}`)

                this.favorites = response.data; // 确保这是一个数组
                this.UserColl = this.favorites
                console.log('在持久化中获取到用户的收藏记录', this.UserColl);


            } catch (error) {
                console.error('加载收藏失败:', error)
            }
        },
    },
    created() {
        // 在获取数据之前，设置默认的 "全部" 分类
        this.selectedCategory = { _id: "all", name: "全部" };
        this.loadFavorites();
        // 获取文章和分类数据
        this.HomefetchArticles(); // 获取文章
        this.fetchCategories(); // 获取分类

        // 因为已经手动设置了默认的 "全部" 分类，所以不需要重复调用
    },


    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {

    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped>
a {
    text-decoration: none !important;
    color: #000;
}

.content-section {
    padding: 0px 25px 30px 25px;

}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30px;
    border-bottom: 1px solid var(--article-card-background-color);
}

.Input-but {
    width: 65%;
    display: flex;
    position: relative;
    justify-content: space-between;
}

.Input-but ul {
    position: absolute;
    top: 70px;
    width: 100%;
    background-color: var(--ActiveBgc);

    border-radius: 20px;
    list-style: none;
    /* box-sizing: border-box; */
}

.Input-but ul>li:hover {
    background-color: var(--background-color);

}

.Input-but ul li {
    margin: 10px;
    border-radius: 15px;
    padding: 10px;
    transition: all 250ms;
}

.search-bar {
    width: 100%;
    padding: 18px;
    border-radius: 20px 0 0 20px;
    border-top: 1px solid var(--Border);
    border-left: 1px solid var(--Border);
    border-bottom: 1px solid var(--Border);
    background-color: var(--background-color);
    color: var(--text-color);
}

.search-bar:focus {
    border-color: var(--Border);
    outline: none;
    /* box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); */
    border-right-color: transparent;
    /* 设置左边框颜色为透明 */
}

.search-button {
    padding: 18px;
    border-top: 1px solid var(--Border);
    border-right: 1px solid var(--Border);

    border-bottom: 1px solid var(--Border);

    border-radius: 0px 20px 20px 0px;
    background-color: var(--background-color);
}

.search-button.highlight {
    border-color: var(--Border);
    /* 点击时的边框颜色 */
    /* box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); */
    /* 添加阴影效果 */
    border-left-color: transparent;
}

.search-button>img {
    width: 23px;
}

.IN-icons {
    display: flex;
}

.IN-icons img {
    width: 30px;

    cursor: pointer;
}

.IN-icons {
    position: relative;
    /* height: 30px; */
    width: 20%;
    display: flex;
    justify-content: space-evenly;
}


/* From Uiverse.io by Pipo-13 */
.tooltip-container {
    /* --background: #d87639; */
    position: relative;
    /* background: var(--background); */
    cursor: pointer;
    transition: all 0.2s;
    /* font-size: 17px; */
    /* padding: 0.7em 1.8em; */
    border-radius: 0.2rem;
}
.tooltip span {
    display: block;
    width: 100%;
    margin-top:50% ;
    text-align: center;
  
}
.tooltip {
    position: absolute;
    top: 50px;
    left: -75%;
    transform: translateX(-50%) rotateX(90deg);
    padding: 0.6em;
    opacity: 0.6;
    transition: all 0.5s ease;
    background: var(--ActiveBgc);
    height: 0px;
    width: 200px;
    cursor: default;
    border-radius: 25px;
    overflow: auto;
}

.tooltip>div {
    display: flex;
    align-items: center;
    background-color: var(--background-color);
    padding: 5px 10px;
    border-radius: 20px;
    margin-bottom: 10px;
    transition: all 250ms;
}

.tooltip>div:hover {
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    color: rgba(0, 0, 0, 0.65);
    transform: translateY(-1px);
}

.tooltip>div>a>h2 {
    margin-left: 5px;
    font-size: 15px;
    color: gray;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    height: 40px;
    line-height: 21px;
}

.tooltip>div>img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
}


/* 这里隐藏滚动条 */
.tooltip::-webkit-scrollbar {
    display: none;
    /* 隐藏滚动条 */
}

.tooltip-container:hover .tooltip {
    opacity: 1;
    pointer-events: auto;
    /* background: none; */
    height: 300px;
    width: 200px;
    transform: translateX(-50%) rotateX(0deg);
    /* overflow:auto; */
}

.IN-Shoubtn {
    position: relative;
    padding: 20px 0 20px 0;
}

.IN-Shou {
    position: absolute;
    display: none;
    /* opacity: 0; */
    width: 100px;
    height: 100px;
    background-color: #fff;
    right: 20%;

    top: 69px;
}

.IN-Shou::after {
    content: "";
    width: 13px;
    height: 13px;
    background-color: #fff;
    transform: rotate(45deg);
    position: absolute;
    top: -6px;
    right: 10px;
}

.IN-Shoubtn:hover .IN-Shou {
    display: block;
    /* opacity: 1; */
    width: 100px;
    /* height: 100px; */
    background-color: #fff;
}

.socials {
    position: fixed;
    display: block;
    left: 20px;
    bottom: 20px;
}

.socials>a {
    display: block;
    width: 30px;
    opacity: 0.2;
    transform: scale(var(--scale, 0.8));
    transition: transform 0.3s cubic-bezier(0.38, -0.12, 0.24, 1.91);
}

.socials>a:hover {
    --scale: 1;
}



.article-of-the-day {
    margin-top: 20px;
}

.section-header {
    color: var(--text-color);
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
    margin-bottom: 80px;
    color: var(--text-color);

}


.article-cover {

    display: flex;

    width: 100%;
    justify-content: space-between;
    aspect-ratio: 2 / 1;
    background-color: var(--font-color);
    /* 大盒子的宽高比为2:1 */
}

.article-cover>div:nth-child(1) {
    height: 100%;
    flex: 1;
    overflow: overlay;

    box-sizing: border-box;
}

.article-cover>div:nth-child(1)>a {

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    height: 100%;
    color: var(--text-color);
}

.article-cover h2 {
    width: 85%;
    text-decoration: none;
}

.article-cover>div:nth-child(2) {
    /* height:;
    width: ; */
    flex: 1;
    overflow: hidden;
    border-radius: 30px 30px 50px 50px;
    /* min-width: 184px;
    min-height:  90px; */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 250ms;
}

.article-cover>div:nth-child(2):hover {
    transform: scale(1.021);
    transition: all 250ms;
}

.article-cover>div:nth-child(2):active {
    transform: scale(0.95) rotateZ(1.1deg);
}

.article-cover>div:nth-child(2)>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 250ms;
    /* 让图片完整覆盖容器，保持比例 */
}

.article-button {
    background-color: var(--active-background-color);


    /* color: #000000; */
    padding: 10px 30px;
    border-radius: 30px;
}

/* From Uiverse.io by cssbuttons-io */
.article-button {
    position: relative;
    font-size: 17px;
    text-transform: uppercase;
    text-decoration: none;
    padding: 1.5em;
    display: inline-block;
    border-radius: 6em;
    transition: all 0.2s;
    border: none;
    font-family: inherit;
    font-weight: 500;
    color: #fff;

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
    transition: all 1s;
}

.article-button::after {
    background-color: #fff;
}

.article-button:hover::after {
    transform: scaleX(1.4) scaleY(1.6);
    opacity: 0;
}

.article-content {
    width: 100%;
}

.article-title {
    color: var(--font-color);
    font-size: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 15px;
    /* 单行文本 */
    /* 如果需要，可以让超出部分显示省略号 */
}

.article-brief {
    font-size: .9375rem;
    margin-bottom: 10px;
    color: gray;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}


.article-info>img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
}

.article-info>span {

    font-size: .8125rem;
}

.article-info {
    max-width: 100%;
    margin-bottom: 10px;
}

.article-info h3 {
    margin: 20px 0;
    color: #000;
    font-size: 24px;
}

.article-info p {
    color: #666;
}

.topic-match {
    color: var(--text-color);
    margin-top: 40px;
}

.no-articles {
    height: 100px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
    border: 1px solid var(--Border);
    border-radius: 20px;
    cursor: pointer;
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

.tag.active {
    background: var(--active-background-color);
    color: var(--background-color);
}

.articles {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    justify-content: space-between;
    width: 100%;
}

.articles>div {
    height: 300px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.article-link {
    /* margin: 0 20px 0 20px; */
    width: 48%;
    display: block;
}

.article {
    width: 100%;
    color: var(--text-color);
    overflow: hidden;
    margin-bottom: 55px;
    /* margin: 20px; */
    padding: 10px;
    /* background-color: var(--ActiveBgc); */
    border-radius: 30px;

}

.article:nth-child(2n) {
    margin-right: 0;
}


.article-img>img {
    width: 100%;
    height: 100%;
    height: auto;
    overflow: hidden;
    transition: all 0.5s;
    object-fit: cover;
    /* 保持图标比例并裁剪 */
}

.article-img {
    /* height: 269px; */

    border-radius: 30px;
    overflow: hidden;

    /* 1:1 比例 */
}

.article-img>img:hover {
    transform: scale(1.021);
}

.article-img>:active {
    transform: scale(0.95) rotateZ(1.1deg);
}

.IH-articlesImgAndName {
    display: flex;
    align-items: center;
}

.IH-articlesImgAndName>img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
}

.article h3 {
    margin: 0;

    padding: 15px 0px 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
}

.article span {
    font-size: 13px;
    color: gray;
    display: -webkit-box;
    /* 必须设置为 -webkit-box 才能配合 line-clamp 使用 */
    -webkit-box-orient: vertical;
    /* 设置垂直排列 */
    overflow: hidden;
    /* 隐藏超出部分 */
    -webkit-line-clamp: 2;
    /* 限制显示行数，这里设置为 2 行，超出部分用省略号表示 */
    height: 40px;
    /* 固定高度 */
    line-height: 20px;
}

.IH-articlesImgAndName p {
    padding: 0 0px;
    margin: 0;
    display: block;
    width: 100%;
    line-height: 10px;
    font-size: .625rem;
}

.author-info {
    padding: 10px 20px;

}

@media (max-width: 577px) {
    .article-cover {
        height: 400px;
        flex-direction: column-reverse;
    }

    .article-cover>div[data-v-1c819015]:nth-child(1) {
        width: 100%;
    }

    .article-cover h2 {
        width: 100%;
    }

    .IN-icons {
        display: none !important;
    }

    .Input-but {
        width: 100%;
    }

    .search-bar {
        width: 100%;
    }

    .article-cover>div:nth-child(2) {

        margin-bottom: 10px;
    }

}

/* 小屏幕（手机横屏） */
@media (min-width: 577px) and (max-width: 768px) {
    .article-cover {
        height: 500px;
        flex-direction: column-reverse;
    }


    .IN-icons {
        display: none !important;
    }

    .Input-but {
        width: 100%;
    }

    .search-bar {
        width: 100%;
    }

    .article-cover>div:nth-child(2) {

        margin-bottom: 10px;
    }
}

/* 中等屏幕（平板） */
@media (min-width: 769px) and (max-width: 992px) {}

/* 大屏幕（小笔记本） */
@media (min-width: 993px) and (max-width: 1200px) {}

/* 超大屏幕（台式机） */
@media (min-width: 1201px) {}
</style>
