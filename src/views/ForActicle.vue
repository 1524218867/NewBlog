<template>
    <div>
        <h1>All Articles</h1>
        <!-- 使用 v-for 遍历文章列表 -->
        <ul>
            <li v-for="article in articles" :key="article._id">
                <!-- 使用 router-link 导航到文章详情页面 -->
                <router-link :to="{ name: 'Article', params: { id: article._id } }">{{ article.title }}</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            articles: [] // 用于存储文章列表
        };
    },
    created() {
        this.fetchArticles();
    },
    methods: {
        async fetchArticles() {
            try {
                const response = await axios.get('/api/articles');
                this.articles = response.data;
                console.log(this.articles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        }
    }
};
</script>