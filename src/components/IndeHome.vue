<template>

    <div class="content-section" id="section1">
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

                    <div class="wrapper">
                        <input type="checkbox" />

                        <div class="btn">
                            <img src="../../public/Xiaoxi.png" alt="消息" />

                        </div>
                        <div class="tooltip">
                            <svg></svg>
                            <svg></svg>
                            <svg></svg>
                        </div>
                        <svg></svg>
                    </div>

                    <div class="wrapper">
                        <input type="checkbox" />

                        <div class="btn">
                            <img src="../../public/ShouCang.png" alt="收藏" />

                        </div>
                        <div class="tooltip">
                            <svg></svg>
                            <svg></svg>
                            <svg></svg>
                        </div>
                        <svg></svg>
                    </div>



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
                                <h2 class="article-title">{{ HomelatestArticle.title || 'No title available'
                                    }}</h2>
                                <button class="article-button">现在阅读</button>
                            </router-link>
                        </div>
                        <div>
                            <img :src="HomegetImageUrl(HomelatestArticle.coverImage || '')" alt="Article Cover"
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

                <div class="articles">
                    <router-link v-for="article in HomefilteredArticles" :key="article._id"
                        :to="{ name: 'Article', params: { id: article._id } }" class="article-link">
                        <div class="article">

                            <div class="article-img">
                                <img :src="HomegetImageUrl(article.coverImage)" alt="Article Image" />
                            </div>

                            <h3>{{ article.title }}</h3>
                            <div class="IH-articlesImgAndName">
                                <img :src="getUser.avatar" />
                                <p>{{ article.author }}</p>


                            </div>


                        </div>
                    </router-link>
                </div>
            </section>
        </div>
    </div>


</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import axios from "axios";
import { mapGetters } from "vuex";
export default {


    components: {

    },
    data() {
        return {
            Homearticles: [], // 用于存储文章列表
            HomefilteredArticles: [], // 根据分类筛选后的文章
            HomelatestArticle: {}, // 最新文章，初始化为空对象
            isButtonHighlighted: false, // 按钮高亮状态

            articleCategories: [], // 存储文章分类

            selectedCategory: { _id: "all", name: "全部" }, // 默认选中“全部”分类
        };
    },
    computed: {
        ...mapGetters(["isLoggedIn", "getUser"]),
    },
    methods: {

        async fetchCategories() {
            try {
                // 发送GET请求获取文章分类
                const response = await axios.get("http://localhost:5000/api/categories");
                this.articleCategories = response.data; // 存储文章分类

                // 默认选择第一个分类作为“全部”分类
                if (this.articleCategories.length > 0) {
                    this.selectedCategory = this.articleCategories[0]; // 默认选择第一个分类
                    this.filterArticlesByCategory(this.selectedCategory); // 根据默认分类筛选文章
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        },
        filterArticlesByCategory(selectedCategory) {
            this.selectedCategory = selectedCategory; // 更新当前选择的分类

            if (selectedCategory.name === "全部") {
                this.HomefilteredArticles = this.Homearticles; // 显示所有文章
            } else {
            console.log('获取到文章分类：',selectedCategory.HomefilteredArticles);
            
                this.HomefilteredArticles = this.Homearticles.filter((article) =>
                    article.categories.some(
                        (category) => category._id === selectedCategory._id
                    )
                );
            }
        },
        highlightButton() {
            this.isButtonHighlighted = true; // 设置按钮为高亮状态
        },
        resetButton() {
            this.isButtonHighlighted = false; // 取消按钮高亮状态
        },
        // 拼接图片 URL
        HomegetImageUrl(imageName) {
            return `http://localhost:5000/uploads/${imageName}`;
        },
        //获取文章
        // 异步获取文章列表
        async HomefetchArticles() {

            try {
                // 发送GET请求，获取文章列表
                const response = await axios.get("http://localhost:5000/api/articles");
                this.Homearticles = response.data; // 存储文章列表
                console.log(response.data);
                this.HomefilteredArticles = this.Homearticles; // 默认显示所有文章
                this.HomelatestArticle =
                    this.Homearticles.length > 0
                        ? this.Homearticles[this.Homearticles.length - 1]
                        : {}; // 设置最新文章
                console.log(this.HomelatestArticle.title);

            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        },
    },
    created() {
        // 在获取数据之前，设置默认的 "全部" 分类
        this.selectedCategory = { _id: "all", name: "全部" };

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
    text-decoration: none;
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
    width: 80%;
    display: flex;
}

.search-bar {
    width: 60%;
    padding: 18px;
    border-radius: 20px 0 0 20px;
    border-top: 1px solid var(--Border);
    border-left: 1px solid var(--Border);
    border-bottom: 1px solid var(--Border);
    background-color: var(--background-color);
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
    border-top: 1px solid var(--Border);
    border-right: 1px solid var(--Border);

    border-bottom: 1px solid var(--Border);

    border-radius: 0px 20px 20px 0px;
    background-color: var(--background-color);
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

.icons {
    display: flex;
}

.icons img {
    width: 30px;

    cursor: pointer;
}

/* From Uiverse.io by neerajbaniwal */
.wrapper {
    --background: #62abff;
    --icon-color: #414856;
    --shape-color-01: #b8cbee;
    --shape-color-02: #7691e8;
    --shape-color-03: #fdd053;
    --width: 90px;
    --height: 90px;
    --border-radius: var(--height);
    width: var(--width);
    height: var(--height);
    position: relative;
    border-radius: var(--border-radius);
    display: flex;
    justify-content: center;
    align-items: center;
}

.wrapper .btn {

    width: 30px;
    height: 30px;
    position: relative;
    z-index: 3;
    border-radius: var(--border-radius);
    box-shadow: 0 10px 30px rgba(65, 72, 86, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-animation: plus-animation-reverse 0.5s ease-out forwards;
    animation: plus-animation-reverse 0.5s ease-out forwards;
}


.wrapper .tooltip {
    width: 90px;
    height: 75px;
    border-radius: 70px;
    position: absolute;
    background: #fff;
    z-index: 2;
    padding: 0 15px;
    box-shadow: 0 10px 30px rgba(65, 72, 86, 0.05);
    opacity: 0;
    top: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition: opacity 0.15s ease-in, top 0.15s ease-in, width 0.15s ease-in;
}


.wrapper .tooltip::after {
    content: "";
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    left: 45%;
    margin-top: -70px;
    /* bottom: -8px; */
    transform: rotate(131deg);
    z-index: 0;
}

.wrapper>svg {
    width: 300px;
    height: 300px;
    position: absolute;
    z-index: 1;
    transform: scale(0);
}

.wrapper>svg .shape {
    fill: none;
    stroke: none;
    stroke-width: 3px;
    stroke-linecap: round;
    stroke-linejoin: round;
    transform-origin: 50% 20%;
}

.wrapper input {
    height: 20px;
    width: 20px;
    border-radius: var(--border-radius);
    cursor: pointer;
    position: absolute;
    z-index: 5;
    opacity: 0;
}

.wrapper input:checked~svg {
    -webkit-animation: pang-animation 1.2s ease-out forwards;
    animation: pang-animation 1.2s ease-out forwards;
}

.wrapper input:checked~svg .shape:nth-of-type(1) {
    transform: translate(25px, 30%) rotate(40deg);
}

.wrapper input:checked~svg .shape:nth-of-type(2) {
    transform: translate(-4px, 30%) rotate(80deg);
}

.wrapper input:checked~svg .shape:nth-of-type(3) {
    transform: translate(12px, 30%) rotate(120deg);
}

.wrapper input:checked~svg .shape:nth-of-type(4) {
    transform: translate(8px, 30%) rotate(160deg);
}

.wrapper input:checked~svg .shape:nth-of-type(5) {
    transform: translate(21px, 30%) rotate(200deg);
}

.wrapper input:checked~svg .shape:nth-of-type(6) {
    transform: translate(0px, 30%) rotate(240deg);
}

.wrapper input:checked~svg .shape:nth-of-type(7) {
    transform: translate(17px, 30%) rotate(280deg);
}

.wrapper input:checked~svg .shape:nth-of-type(8) {
    transform: translate(-3px, 30%) rotate(320deg);
}

.wrapper input:checked~svg .shape:nth-of-type(9) {
    transform: translate(25px, 30%) rotate(360deg);
}

.wrapper input:checked~.btn {
    -webkit-animation: plus-animation 0.5s ease-out forwards;
    animation: plus-animation 0.5s ease-out forwards;
}

.wrapper input:checked~.tooltip {
    width: 190px;
    height: 70px;
    -webkit-animation: stretch-animation 1s ease-out forwards 0.15s;
    animation: stretch-animation 1s ease-out forwards 0.15s;
    top: 90px;
    opacity: 1;
}

@-webkit-keyframes pang-animation {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    40% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        transform: scale(1.1);
        opacity: 0;
    }
}

@keyframes pang-animation {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    40% {
        transform: scale(1);
        opacity: 1;
    }

    100% {
        transform: scale(1.1);
        opacity: 0;
    }
}

@-webkit-keyframes plus-animation {
    0% {
        transform: rotate(0) scale(1);
    }

    20% {
        transform: rotate(60deg) scale(0.93);
    }

    55% {
        transform: rotate(35deg) scale(0.97);
    }

    80% {
        transform: rotate(48deg) scale(0.94);
    }

    100% {
        transform: rotate(45deg) scale(0.95);
    }
}

@keyframes plus-animation {
    0% {
        transform: rotate(0) scale(1);
    }

    20% {
        transform: rotate(60deg) scale(0.93);
    }

    55% {
        transform: rotate(35deg) scale(0.97);
    }

    80% {
        transform: rotate(48deg) scale(0.94);
    }

    100% {
        transform: rotate(45deg) scale(0.95);
    }
}

@-webkit-keyframes plus-animation-reverse {
    0% {
        transform: rotate(45deg) scale(0.95);
    }

    20% {
        transform: rotate(-15deg);
    }

    55% {
        transform: rotate(10deg);
    }

    80% {
        transform: rotate(-3deg);
    }

    100% {
        transform: rotate(0) scale(1);
    }
}

@keyframes plus-animation-reverse {
    0% {
        transform: rotate(45deg) scale(0.95);
    }

    20% {
        transform: rotate(-15deg);
    }

    55% {
        transform: rotate(10deg);
    }

    80% {
        transform: rotate(-3deg);
    }

    100% {
        transform: rotate(0) scale(1);
    }
}

@-webkit-keyframes stretch-animation {
    0% {
        transform: scale(1, 1);
    }

    10% {
        transform: scale(1.1, 0.9);
    }

    30% {
        transform: scale(0.9, 1.1);
    }

    50% {
        transform: scale(1.05, 0.95);
    }

    100% {
        transform: scale(1, 1);
    }
}

@keyframes stretch-animation {
    0% {
        transform: scale(1, 1);
    }

    10% {
        transform: scale(1.1, 0.9);
    }

    30% {
        transform: scale(0.9, 1.1);
    }

    50% {
        transform: scale(1.05, 0.95);
    }

    100% {
        transform: scale(1, 1);
    }
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
    width: 50%;


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
    overflow: hidden;
    border-radius: 30px 30px 50px 50px;
    /* min-width: 184px;
    min-height:  90px; */
    display: flex;
    align-items: center;
    justify-content: center;

}

article-cover>div:nth-child(2):hover {
    transform: scale(1.021);
}

article-cover>div:nth-child(2):active {
    transform: scale(0.95) rotateZ(1.1deg);
}

.article-cover>div:nth-child(2)>img {
    width: 100%;
    height: 100%;
    object-fit: cover;

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

.article-title {
    color: var(--font-color);
    font-size: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* 单行文本 */
    /* 如果需要，可以让超出部分显示省略号 */
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

.topic-match {
    color: var(--text-color);
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

.article-link {
    /* margin: 0 20px 0 20px; */
    width : 48%;
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

    padding: 15px 0px;
    font-size: 16px;
    font-weight: 600;
    line-height: 30px;
}

.IH-articlesImgAndName p {
    padding: 0 0px;
    margin: 0;
    display: block;
    width: 100%;
    line-height: 10px;
    font-size: .625rem ;
}

.author-info {
    padding: 10px 20px;

}

@media (max-width: 577px) {
    .article-cover {

        flex-direction: column-reverse;
    }
    .article-cover>div[data-v-1c819015]:nth-child(1) {
        width: 100%;
    }
    .article-cover h2{
        width: 100%;
    }
}

/* 小屏幕（手机横屏） */
@media (min-width: 577px) and (max-width: 768px) {
    .article-cover {

        flex-direction: column-reverse;
    }

}

/* 中等屏幕（平板） */
@media (min-width: 769px) and (max-width: 992px) {}

/* 大屏幕（小笔记本） */
@media (min-width: 993px) and (max-width: 1200px) {}

/* 超大屏幕（台式机） */
@media (min-width: 1201px) {}
</style>
