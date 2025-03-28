<template>
    <div class="home-container">
        <!-- 顶部特色文章区域 -->
        <section class="featured-section">
            <div class="featured-wrapper">
                <div class="featured-background">
                    <img :src="getImageUrl(HomelatestArticle.coverImage, 'uploads')" alt="Featured Article">
                    <div class="gradient-overlay"></div>
                </div>
                <div class="featured-content">
                    <div class="featured-text">
                        <router-link :to="{ name: 'Article', params: { id: HomelatestArticle._id || '' } }">
                            <!-- <span class="featured-label">精选文章</span> -->
                            <h1 class="featured-title">{{ HomelatestArticle.title || 'No title available' }}</h1>
                            <p class="featured-brief">{{ HomelatestArticle.BriefIntroduction }}</p>
                            <div class="featured-meta">
                                <div class="featured-author">
                                    <img :src="getImageUrl(SpecifyUserInformation.avatar, 'UserImg')" alt="作者头像">
                                    <span>{{ SpecifyUserInformation.username }}</span>
                                </div>
                                <div class="featured-stats">
                                    <span><i class="el-icon-view"></i> {{ HomelatestArticle.viewCount || 0 }}</span>
                                    <span><i class="el-icon-star-off"></i> {{ HomelatestArticle.favoriteCount || 0 }}</span>
                                </div>
                            </div>
                            <button class="read-more-btn">
                                阅读全文
                                <i class="el-icon-arrow-right"></i>
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <!-- 分类导航区域 -->
        <section class="categories-section">
            <div class="section-header">
                <h2>探索分类</h2>
                <p>发现你感兴趣的内容</p>
            </div>
            <div class="categories-grid">
                <button v-for="category in articleCategories" 
                        :key="category._id"
                        @click="filterArticlesByCategory(category)"
                        :class="{ active: selectedCategory && selectedCategory._id === category._id }" 
                        class="category-card">
                    <span class="category-name">{{ category.name }}</span>
                    <span class="category-count">{{ getCategoryCount(category) }}</span>
                </button>
            </div>
        </section>

        <!-- 文章列表区域 -->
        <section class="articles-section">
            <div class="section-header">
                <h2>最新文章</h2>
                <p>发现更多精彩内容</p>
            </div>
            <div class="articles-grid" v-if="!IsDisplay">
                <article v-for="article in HomefilteredArticles" 
                         :key="article._id" 
                         class="article-card">
                    <router-link :to="{ name: 'Article', params:{ id: article._id } }">
                        <div class="article-image">
                            <img :src="getImageUrl(article.coverImage, 'uploads')" alt="Article Image">
                            <div class="article-overlay">
                                <span class="read-more">阅读更多</span>
                            </div>
                        </div>
                        <div class="article-content">
                            <div class="article-meta">
                                <span class="article-category">{{ getArticleCategories(article) }}</span>
                                <span class="article-date">{{ formatDate(article.createdAt) }}</span>
                            </div>
                            <h3 class="article-title">{{ article.title }}</h3>
                            <p class="article-description">{{ article.BriefIntroduction }}</p>
                            <div class="article-footer">
                                <div class="article-author">
                                    <img :src="getImageUrl(article.authorInfo?.avatar, 'UserImg')" alt="作者头像">
                                    <span>{{ article.authorInfo?.username }}</span>
                                </div>
                                <div class="article-stats">
                                    <span><i class="el-icon-view"></i> {{ article.viewCount || 0 }}</span>
                                    <span><i class="el-icon-star-off"></i> {{ article.favoriteCount || 0 }}</span>
                                   
                                </div>
                            </div>
                        </div>
                    </router-link>
                </article>
            </div>
            <div v-else class="empty-state">
                <div class="empty-state-content">
                    <i class="el-icon-document-delete empty-icon"></i>
                    <h3>这里空空如也</h3>
                    <p>这个分类下还没有文章发布<br>不如先去看看其他精彩内容吧</p>
                    <el-button type="primary" class="browse-button" @click="filterArticlesByCategory(allactive)">
                        <i class="el-icon-discover"></i>
                        浏览全部文章
                    </el-button>
                </div>
            </div>
        </section>
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
          
            articles: [],
            IsDisplay: null,
            Homearticles: [], // 用于存储文章列表
            HomefilteredArticles: [], // 根据分类筛选后的文章
            HomelatestArticle: {}, // 最新文章，初始化为空对象
           
            SpecifyUserInformation: '',
            articleCategories: [], // 存储文章分类
            allactive: {
                _id: "all",
                name: "全部"
            },
            selectedCategory: { _id: "all", name: "全部" }, // 默认选中"全部"分类
            UserColl: [],
        };
    },
    computed: {
        ...mapGetters(["isLoggedIn", "getUser"]),

    },
    methods: {
       

       
        //获取分类文章
        async fetchCategories() {
            try {
                // 发送GET请求获取文章分类
                const response = await axios.get("/api/categories");
                this.articleCategories = response.data; // 存储文章分类
                this.articleCategories.unshift(this.allactive);// 添加全部分类


                // 默认选择第一个分类作为"全部"分类
                if (this.articleCategories.length > 0) {
                    this.selectedCategory = this.articleCategories[0]; // 默认选择第一个分类
                    this.filterArticlesByCategory(this.selectedCategory); // 根据默认分类筛选文章
                }
            } catch (error) {
            }
        },
        //获取分类
        filterArticlesByCategory(selectedCategory) {
            this.selectedCategory = selectedCategory;
            if (selectedCategory.name === "全部") {
                this.IsDisplay = false;
                this.HomefilteredArticles = this.Homearticles;
            } else {
                this.HomefilteredArticles = this.Homearticles.filter((article) => {
                    if (Array.isArray(article.categories)) {
                        return article.categories.some(cat => (cat.name || cat) === selectedCategory.name);
                    }
                    return article.categories === selectedCategory.name;
                });
                if (this.HomefilteredArticles.length === 0) {
                    this.IsDisplay = true;
                } else {
                    this.IsDisplay = false;
                }
            }
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
                this.HomefilteredArticles = this.Homearticles; // 默认显示所有文章
                this.HomelatestArticle =
                    this.Homearticles.length > 0
                        ? this.Homearticles[this.Homearticles.length - 1]
                        : {}; // 设置最新文章

                // 获取每篇文章作者的信息
                await Promise.all(this.Homearticles.map(async (article) => {
                    if (article.user) {
                        const authorInfo = await this.getUserImgOrObject(article.user);
                        article.authorInfo = authorInfo;
                    }
                }));

                // 获取最新文章作者信息
                if (this.HomelatestArticle.user) {
                    this.SpecifyUserInformation = await this.getUserImgOrObject(this.HomelatestArticle.user);
                }
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
                
                // 如果没有数据，直接返回
                if (!Array.isArray(this.favorites)) {
                    console.error("返回的收藏数据不是数组", this.favorites);
                    return;
                }
                
                // 检查收藏数据中是否有无效记录
                this.favorites.forEach(fav => {
                    // 移除无效收藏记录的检测代码
                });
                
                this.UserColl = this.favorites


            } catch (error) {
                console.error('加载收藏失败:', error)
            }
        },
        getCategoryCount(category) {
            if (category.name === "全部") {
                return this.Homearticles.length;
            }
            return this.Homearticles.filter(article => {
                if (Array.isArray(article.categories)) {
                    return article.categories.some(cat => (cat.name || cat) === category.name);
                }
                return article.categories === category.name;
            }).length;
        },

        getArticleCategories(article) {
            if (!article || !article.categories) return '';
            if (typeof article.categories === 'string') return article.categories;
            if (Array.isArray(article.categories)) {
                return article.categories.map(cat => cat.name || cat).join(', ');
            }
            return '';
        },

        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
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
    color: var(--text-color);
}

.home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 特色文章区域 */
.featured-section {
    margin:10px -20px 40px -20px;
    position: relative;
    height: 80vh;
    min-height: 600px;
    max-height: 800px;
    overflow: hidden;
    border-radius: 12px;
}

.featured-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.featured-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.featured-background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.1);
    transition: transform 0.8s ease;
}

.featured-section:hover .featured-background img {
    transform: scale(1.2);
}

.gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.8) 0%,
        rgba(0, 0, 0, 0.4) 50%,
        rgba(0, 0, 0, 0.2) 100%
    );
}

.featured-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 10%;
}

.featured-text {
    max-width: 600px;
    color: white;
    padding: 20px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.featured-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 20px;
    color: white;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.featured-brief {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 1.2rem;
    color: var(--text-color-secondary);
    margin-bottom: 30px;
    line-height: 1.6;

    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.featured-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
}

.featured-author {
    display: flex;
    align-items: center;
}

.featured-author img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
    border: 2px solid white;
}

.featured-author span {
    font-size: 1rem;
    color: white;
    font-weight: 500;
}

.featured-stats {
    display: flex;
    gap: 20px;
}

.featured-stats span {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--background-color);
    font-size: 0.9rem;
}

.featured-stats i {
    font-size: 1.1rem;
}
.read-more {
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    padding: 12px 24px;
    border: 2px solid white;
    background: rgba(0,0,0,0.4);
    border-radius: 30px;
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.read-more-btn {
    background: transparent;
    color: white;
    border: 2px solid white;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.read-more-btn:hover {
    background: white;
    color: var(--active-background-color);
    transform: translateY(-2px);
}

.read-more-btn i {
    transition: transform 0.3s ease;
}

.read-more-btn:hover i {
    transform: translateX(4px);
}

/* 分类区域 */
.categories-section {
    margin: 60px 0;
}

.section-header {
    margin-bottom: 30px;
}

.section-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-color);
    margin-bottom: 10px;
}

.section-header p {
    color: var(--text-color-secondary);
    font-size: 1.1rem;
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.category-card {
    background: var(--card-background);
    border: none;
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    backdrop-filter: blur(10px);
}

.category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.category-card.active {
    background: var(--button-color);
    color: white;
}

.category-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-color);
}

.category-count {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
}

/* 文章列表区域 */
.articles-section {
    margin: 60px 0;
}

.articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
}

.article-card {
    background: var(--card-background);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 6px var(--shadow-color);
    position: relative;
    z-index: 1;
}

.article-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px var(--shadow-color-strong);
    /* box-shadow: 0 8px 25px rgba(0,0,0,0.15); */
    /* border-color: var(--button-color); */
}

.article-image {
    position: relative;
    padding-top: 60%;
    overflow: hidden;
}

.article-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.article-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
}
.article-card:hover .article-image img {
    transform: scale(1.05);
}
.article-card:hover .article-overlay {
    opacity: 1;
}

.article-content {
    padding: 20px;
}

.article-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 0.9rem;
    color: var(--text-color-secondary);
}

.article-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--text-color);
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.article-description {
    color: var(--text-color-secondary);
    font-size: 0.9rem;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    max-height: 3em;
}

.article-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.article-author {
    display: flex;
    align-items: center;
}

.article-author img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 8px;
}

.article-author span {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
}

.article-stats {
    display: flex;
    gap: 12px;
    font-size: 0.9rem;
    color: var(--text-color-secondary);
}

.article-stats span {
    display: flex;
    align-items: center;
    gap: 4px;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    background: var(--ActiveBgc);
    border-radius: 16px;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-state-content {
    animation: fadeInUp 0.6s ease-out;
}

.empty-icon {
    font-size: 4rem;
    color: var(--active-background-color);
    margin-bottom: 20px;
    opacity: 0.8;
    animation: float 3s ease-in-out infinite;
}

.empty-state h3 {
    font-size: 1.5rem;
    color: var(--text-color);
    margin-bottom: 12px;
    font-weight: 600;
}

.empty-state p {
    color: var(--text-color-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 24px;
}

.browse-button {
    padding: 12px 24px;
    font-size: 1rem;
    border-radius: 24px;
    transition: all 0.3s ease;
}

.browse-button i {
    margin-right: 8px;
}

.browse-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 992px) {
    .featured-section {
        height: 70vh;
        min-height: 500px;
        margin: 0 -15px 30px;
    }

    .featured-content {
        padding: 0 5%;
    }

    .featured-title {
        font-size: 2.8rem;
    }

    .featured-brief {
        font-size: 1.1rem;
    }
}

@media (max-width: 768px) {
    .featured-text {
        max-width: 100%;
        padding: 15px;
    }

    .featured-title {
        font-size: 2rem;
        margin-bottom: 15px;
    }

    .featured-brief {
        font-size: 1rem;
        margin-bottom: 20px;
    }

    .featured-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .featured-stats {
        width: 100%;
        justify-content: space-between;
    }

    .read-more-btn {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .home-container {
        padding: 0 15px;
    }

    .featured-section {
        height: 60vh;
        min-height: 400px;
        margin: 0 -15px 20px;
    }

    .featured-content {
        padding: 0 20px;
        align-items: flex-start;
        padding-top: 40px;
    }

    .featured-title {
        font-size: 2rem;
        line-height: 1.3;
    }

    .featured-brief {
        font-size: 1rem;
        line-height: 1.5;
    }

    .featured-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .featured-stats {
        gap: 15px;
    }

    .read-more-btn {
        padding: 10px 25px;
        font-size: 0.9rem;
    }

    .categories-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 15px;
    }

    .category-card {
        padding: 15px;
    }

    .category-name {
        font-size: 1rem;
    }

    .articles-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}

@media (max-width: 576px) {
    .home-container {
        padding: 0 10px;
    }

    .featured-section {
        height: 50vh;
        min-height: 300px;
        margin: 0 -10px 15px;
    }

    .featured-content {
        padding: 0 15px;
        padding-top: 30px;
    }

    .featured-label {
        padding: 15px 10px;
        font-size: 0.8rem;
    }

    .featured-title {
        font-size: 1.6rem;
        margin-bottom: 15px;
    }

    .featured-brief {
        font-size: 0.9rem;
        margin-bottom: 20px;
    }

    .featured-author img {
        width: 32px;
        height: 32px;
    }

    .featured-author span {
        font-size: 0.9rem;
    }

    .featured-stats span {
        font-size: 0.8rem;
    }

    .featured-stats i {
        font-size: 1rem;
    }

    .read-more-btn {
        padding: 8px 20px;
        font-size: 0.85rem;
    }

    .section-header h2 {
        font-size: 1.5rem;
        margin-bottom: 8px;
    }

    .section-header p {
        font-size: 0.9rem;
    }

    .categories-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
    }

    .category-card {
        padding: 12px;
    }

    .category-name {
        font-size: 0.9rem;
    }

    .category-count {
        font-size: 0.8rem;
    }

    .article-card {
        margin-bottom: 15px;
    }

    .article-content {
        padding: 15px;
    }

    .article-title {
        font-size: 1.1rem;
        margin-bottom: 8px;
    }

    .article-description {
        font-size: 0.85rem;
        margin-bottom: 15px;
    }

    .article-meta {
        font-size: 0.8rem;
    }

    .article-author img {
        width: 20px;
        height: 20px;
    }

    .article-author span {
        font-size: 0.8rem;
    }

    .article-stats {
        font-size: 0.8rem;
    }
}
</style>

