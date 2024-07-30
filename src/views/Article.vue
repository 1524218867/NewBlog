<template>
    <div class="articleBox">
        <!-- 顶部返回按钮和标题 -->
        <div class="header">
            <button @click="goBack" class="back-button">←</button>
            <span class="separator">/</span>
            <span class="title">{{ article?.title }}</span>
        </div>

        <div class="articleText" v-if="article">
            <div class="articleImgTle">
                <div class="img-container">
                    <img :src="getRandomImage()" alt="Random Image" class="article-image" />
                    <div class="overlay">
                        <span class="title">{{ article?.title }}</span>
                        <p class="article-author"><strong>作者 : </strong> {{ article.author }}</p>
                    </div>
                </div>
            </div>

            <div class="articleContent">
                <div class="articletextS" v-html="article.content"></div>
            </div>
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>
    </div>
</template>

<script>
// Article.vue
import axios from 'axios';

export default {
    data() {
        return {
            article: null,
            images: [
                { src: require("../assets/1.jpg") },
                { src: require("../assets/2.jpg") },
            ],
        };
    },
    created() {
        this.fetchArticleData();
    },
    methods: {
        goBack() {
            this.$router.go(-1); // 使用 Vue Router 返回上一页
        },
        getRandomImage() {
            const randomIndex = Math.floor(Math.random() * this.images.length);
            return this.images[randomIndex].src;
        },
        async fetchArticleData() {
            try {
                const articleId = this.$route.params.id;

                const token = localStorage.getItem('token'); // 从 localStorage 获取 Token
                console.log(token);
                const response = await axios.get(`http://localhost:5000/api/articles/${articleId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(token);
                this.article = response.data;
            } catch (error) {
                console.error('Error fetching article data:', error);
            }
        }
    }
};
</script>

<style scoped>
.articleBox {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    margin: auto;
    background-color: #f5f5f57d;
}

.header {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.back-button {
    border: none;
    background-color: #000000;
    color: white;
    padding: 10px 30px;
    /* 增加按钮的长度 */
    border-radius: 25px;
    /* 更圆的圆角 */
    cursor: pointer;
    font-size: 16px;
    margin-right: 10px;
    /* 按钮和分隔符之间的间距 */
}

.separator {
    margin: 0 10px;
    /* 分隔符的左右间距 */
    font-size: 18px;
    /* 分隔符的字体大小 */
}

.title {
    font-size: 24px;
    font-weight: bold;
}

.articleText {
    width: 100%;
    border-radius: 10px;
}

.articleImgTle {
    border-radius: 10px;
    position: relative;
}

.img-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    overflow: hidden;
    border-radius: 15px;
}

.article-image {
    width: 100%;
    height: auto;
    border-radius: 15px;
}

.overlay {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    color: black;
    width: calc(100% - 40px);
    padding: 20px;
    border-radius: 10px;
    box-sizing: border-box;
    color: white;
    gap: 20px;
    border-radius: 10px;
    backdrop-filter: blur(5px);
    background-color: rgba(255, 255, 255, 0.075);
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
}

.article-author {
    margin-top: 10px;
}

.articleContent {
    width: 100%;

    margin: 30px auto 0;

    background-color: #fff;
    border-radius: 10px;

}

.articleContent>>>p {
    color: #333333;
    /* 文本颜色 */
    font-family: 'Arial', sans-serif;
    /* 字体 */
    font-size: 16px;
    /* 字体大小 */
    line-height: 2;
    /* 行间距 */
    text-indent: 40px;
    /* 首行缩进 */

    /* 背景颜色 */
    padding: 20px;
    /* 内边距 */
    margin-bottom: 20px;
    /* 下边距 */
}


.articletextS {
    padding-top: 20px;
    padding-bottom: 30px;
    text-indent: 2em;
}

@media (min-width: 1200px) {
    .articleBox {
        width: 1100px;
    }
}

@media (max-width: 690px) {
    .articleBox {
        width: 100%;
        padding: 20px;
    }

    .title {
        font-size: 20px;
    }
}
</style>
