<template>
    <div class="categories-page">
        <!-- 顶部最新文章展示区 -->
        <section class="latest-article-section">
            <div class="latest-article-wrapper">
                <div class="latest-article-content">
                    <router-link :to="{
                        name: 'Article',
                        params: { id: categorieslatestArticles[0]?._id || '' },
                    }">
                        <span class="article-label">最新文章</span>
                        <h1 class="article-title">{{ categorieslatestArticles[0]?.title || '暂无文章' }}</h1>
                        <p class="article-brief">{{ categorieslatestArticles[0]?.BriefIntroduction }}</p>
                        <div class="article-meta">
                            <div class="article-author">
                                <img :src="getImageUrl(authorAvatars[categorieslatestArticles[0]?.user], 'UserImg')" alt="作者头像">
                                <span>{{ categorieslatestArticles[0]?.authorName }}</span>
                            </div>
                            <div class="article-stats">
                                <span><i class="el-icon-view"></i> {{ categorieslatestArticles[0]?.viewCount || 0 }}</span>
                                <span><i class="el-icon-star-off"></i> {{ categorieslatestArticles[0]?.favoriteCount || 0 }}</span>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div class="latest-article-image">
                    <img :src="getImageUrl(categorieslatestArticles[0]?.coverImage, 'uploads')" alt="最新文章封面">
                    <div class="image-overlay"></div>
                </div>
            </div>
        </section>

        <!-- 文章列表区域 -->
        <section class="articles-section">
            <div class="section-header">
                <h2>所有文章</h2>
                <div class="section-filters">
                    <el-select v-model="selectedCategory" placeholder="选择分类" clearable @change="handleCategoryChange">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="category in categories" :key="category._id" :label="category.name" :value="category._id">
                            <span class="category-option">
                                <i :class="getCategoryIcon(category.name)"></i>
                                <span class="category-name">{{ category.name }}</span>
                            </span>
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="articles-grid">
                <div v-if="isLoading" class="loading-state">
                    <i class="el-icon-loading"></i>
                    <p>加载中...</p>
                </div>
                <div v-else-if="error" class="error-state">
                    <i class="el-icon-warning"></i>
                    <p>{{ error }}</p>
                </div>
                <div v-else-if="filteredArticles.length === 0" class="empty-state">
                    <div class="empty-state-content">
                        <i class="el-icon-document-delete empty-icon"></i>
                        <h3>这里空空如也</h3>
                        <p>这个分类下还没有文章发布<br>不如先去看看其他精彩内容吧</p>
                        <el-button type="primary" class="browse-button" @click="selectedCategory = ''">
                            <i class="el-icon-discover"></i>
                            浏览全部文章
                        </el-button>
                    </div>
                </div>
                <template v-else>
                    <article v-for="article in filteredArticles" 
                             :key="article._id" 
                             class="article-card">
                        <router-link :to="{ name: 'Article', params: { id: article._id } }">
                            <div class="article-image">
                                <img :src="getImageUrl(article.coverImage, 'uploads')" alt="文章封面">
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
                                        <img :src="getImageUrl(authorAvatars[article.user], 'UserImg')" alt="作者头像">
                                        <span>{{ article.authorName }}</span>
                                    </div>
                                    <div class="article-stats">
                                        <span><i class="el-icon-view"></i> {{ article.viewCount || 0 }}</span>
                                        <span><i class="el-icon-star-off"></i> {{ article.favoriteCount || 0 }}</span>
                                    </div>
                                </div>
                            </div>
                        </router-link>
                        <div class="article-actions">
                            <span v-if="userInformation" 
                                  class="favorite-button" 
                                  @click.stop="toggleFavorite(article._id)">
                                <i :class="article.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
                            </span>
                        </div>
                    </article>
                </template>
            </div>

            <!-- 分页 -->
            <div class="pagination-wrapper">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="categoriesarticles.length"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </section>
    </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex';
export default {
    data() {
        return {
            categoriesarticles: [], // 用于存储文章列表
            categorieslatestArticles: [], // 最新文章，初始化为空对象
            authorAvatars: {}, // 用于存储文章作者的头像，key 为用户ID
            userInformation: '', // 当前用户的ID
            currentPage: 1, // 当前页
            pageSize: 5, // 每页显示文章的数量
            favorites: [], // 初始化为空数组
            isLoading: false, // 加载状态
            error: null, // 错误信息
            selectedCategory: '', // 当前选中的分类
            categories: [] // 存储分类列表
        };
    },
    components: {},
    computed: {
        // 计算当前页要显示的文章
        paginatedArticles() {
            const start = (this.currentPage - 1) * this.pageSize
            const end = start + this.pageSize
            return this.filteredArticles.slice(start, end)
        },
        filteredArticles() {
            if (!this.selectedCategory) {
                return this.categoriesarticles;
            }
            return this.categoriesarticles.filter(article => {
                return article.categories && article.categories.some(cat => cat._id === this.selectedCategory);
            });
        },
    },
    watch: {},
    methods: {
        ...mapActions(["VuexloadFavorites"]),
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
        async categoriesfetchArticles() {
            this.isLoading = true;
            this.error = null;
            try {
                // 发送GET请求，获取文章列表
                const response = await axios.get('/api/articles')
                this.categoriesarticles = response.data // 存储文章列表
                this.categorieslatestArticles = this.categoriesarticles.slice(-1) // 获取最新文章
                
                // 获取每篇文章的作者信息
                await Promise.all(this.categoriesarticles.map(article => {
                    if (article.user) {
                        return this.fetchAuthorAvatar(article.user)
                    }
                    return Promise.resolve()
                }))
            } catch (error) {
                this.error = '加载文章失败，请稍后重试'
                console.error('Error fetching articles:', error)
            } finally {
                this.isLoading = false
            }
        },
        // 获取用户头像
        async fetchAuthorAvatar(userId) {
            try {
                const userResponse = await axios.get(`/api/public-user-info/${userId}`)
                this.$set(this.authorAvatars, userId, userResponse.data.avatar) // 存储用户的头像信息


            } catch (error) {
                console.error('Error fetching user avatar:', error)
            }
        },
       
        // 跳转到文章详情页
        handlePageChange(page) {
            this.currentPage = page
        },
        async getuser() {
            if (!localStorage.getItem('token')) {//如果用户没有登陆就不显示收藏按钮
                return;
            }
            const response = await axios.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            this.userInformation = response.data._id // 从 response.data 中提取 _id
            // console.log('打印了用户id', response.data);

            // console.log('获取到了用户信息', this.userInformation);
        },

        async toggleFavorite(articleId) {
            const userId = this.userInformation // 获取当前用户的 ID
            // console.log('打印了用户id', userId);

            try {
                // 发送请求检查当前用户是否收藏了该文章
                const response = await axios.get(`/api/favorites/${userId}/${articleId}`)

                console.log('打印从后台获取回来的状态', response);

                const isFavorite = response.data // 从后端返回的收藏状态
                console.log('打印了收藏状态', isFavorite);

                if (isFavorite) {
                    // 文章已被收藏，执行取消收藏逻辑
                    await axios.delete(`/api/favorites`, {
                        data: { userId, articleId },
                    })
                    this.$notify({
                        title: '收藏',
                        message: '取消收藏',
                        type: 'warning'
                    });
                    const article = this.categoriesarticles.find((a) => a._id === articleId)
                    if (article) {
                        article.isFavorite = false // 设置为已收藏
                    }
                    this.VuexloadFavorites()
                } else {
                    // 文章未被收藏，执行添加收藏逻辑
                    await axios.post(`/api/favorites`, {
                        userId,
                        articleId,
                    })

                    const article = this.categoriesarticles.find((a) => a._id === articleId)
                    this.$notify({
                        title: '收藏',
                        message: '收藏成功',
                        type: 'success'
                    });
                    console.log('收藏成功')
                    // console.log('打印了文章', article);

                    if (article) {
                        article.isFavorite = true // 设置为已收藏
                    }
                    this.VuexloadFavorites()
                }
            } catch (error) {
                console.error('请求失败:', error)
            }
        },
        //获取用户信息用来或得到用户id，然后通过用户id获取用户收藏的文章id，然后对比文章id，如果相同则显示收藏按钮，否则显示未收藏按钮。
        async loadFavorites() {
            console.log('调用了loadFavorites');
            

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
                console.log('在持久化中获取到用户的收藏记录', this.favorites);
              
                // 如果没有数据，直接返回
                if (!Array.isArray(this.favorites)) {
                    console.error("返回的收藏数据不是数组", this.favorites);
                    return;
                }

                this.categoriesarticles.forEach((article) => {
                    // 检查 this.favorites 中是否有与当前 article._id 匹配的收藏记录
                    article.isFavorite = this.favorites.some((fav) => {
                        // 添加防御性检查，确保fav.articleId不为null
                        if (!fav.articleId) {
                            return false;
                        }
                        // console.log("正在检查的收藏:", fav.articleId._id);  // 打印当前收藏的 articleId
                        // console.log("当前文章的 _id:", article._id);      // 打印当前文章的 _id
                        return String(fav.articleId._id) === String(article._id);
                    });

                    // 打印检查后的收藏状态
                    // console.log("更改后的状态", article.isFavorite, article._id);
                });


            } catch (error) {
                console.error('加载收藏失败:', error)
            }
        },

        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        getArticleCategories(article) {
            if (!article.categories) return '';
            return article.categories.map(cat => cat.name).join(', ');
        },
        async fetchCategories() {
            try {
                const response = await axios.get('/api/categories');
                this.categories = response.data;
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        getCategoryIcon(categoryName) {
            const iconMap = {
                '技术': 'el-icon-cpu',
                '生活': 'el-icon-coffee-cup',
                '笔记': 'el-icon-notebook-2',
                '分享': 'el-icon-share',
                '其他': 'el-icon-more'
            };
            return iconMap[categoryName] || 'el-icon-folder';
        },
        handleCategoryChange() {
            this.currentPage = 1; // 重置页码
        }
    },

    created() {
        this.getuser()
        this.loadFavorites()
        this.categoriesfetchArticles()
        this.fetchCategories()
    },

}
</script>

<style scoped>
.categories-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 最新文章区域 */
.latest-article-section {
    margin: 20px -20px 40px;
    position: relative;
}

.latest-article-wrapper {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    min-height: 500px;
    background: linear-gradient(135deg, var(--ActiveBgc) 0%, rgba(255,255,255,0.1) 100%);
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0 20px 40px var(--shadow-color);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.latest-article-wrapper:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px var(--shadow-color-strong);
}

.latest-article-content {
    padding: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
}

.article-label {
    display: inline-block;
    padding: 17px 20px;
    background: linear-gradient(135deg, var(--active-background-color) 0%, #4a90e2 100%);
    color: white;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.article-title {
    font-size: 2.8rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 25px;
    color: var(--text-color);
    letter-spacing: -0.5px;
    transition: transform 0.3s ease;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.latest-article-wrapper:hover .article-title {
    transform: translateX(10px);
}

.article-brief {
    font-size: 1.2rem;
    color: var(--text-color-secondary);
    margin-bottom: 35px;
    line-height: 1.7;
    opacity: 0.9;
    max-width: 90%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.article-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0;
    padding: 20px 0;
    border-top: 1px solid rgba(0,0,0,0.1);
}

.article-author {
    display: flex;
    align-items: center;
    transition: transform 0.3s ease;
}

.latest-article-wrapper:hover .article-author {
    transform: translateX(5px);
}

.article-author img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 15px;
    border: 3px solid var(--active-background-color);
    transition: transform 0.3s ease;
}

.article-author img:hover {
    transform: scale(1.1);
}

.article-author span {
    font-size: 1rem;
    color: var(--text-color);
    font-weight: 500;
}

.article-stats {
    display: flex;
    gap: 20px;
}

.article-stats span {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-color-secondary);
    font-size: 0.9rem;
}

.article-stats i {
    font-size: 1.1rem;
}

.latest-article-image {
    position: relative;
    overflow: hidden;
}

.latest-article-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0));
}

/* 文章列表区域 */
.articles-section {
    margin: 60px 0;
}



.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.section-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-color);
}

.section-filters {
    width: 300px;
}

.articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
}

.article-card {
    background: var(--card-background);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 6px var(--shadow-color)
}

.article-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px var(--shadow-color-strong);
}

.article-card:hover .article-image img {
    transform: scale(1.05);
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
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
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
}

.article-description {
    font-size: 0.95rem;
    color: var(--text-color-secondary);
    margin-bottom: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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

.article-actions {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 2;
}

.favorite-button {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.favorite-button:hover {
    background: white;
    transform: scale(1.1);
}

.favorite-button i {
    font-size: 1.2rem;
    color: var(--button-color);
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 40px;
}

@media (max-width: 992px) {
    .latest-article-wrapper {
        grid-template-columns: 1fr;
    }

    .latest-article-content {
        padding: 40px;
    }

    .article-title {
        font-size: 2rem;
    }

    .section-header {
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
    }

    .section-filters {
        width: 100%;
    }
}

@media (max-width: 768px) {
    .categories-page {
        padding: 0 15px;
    }

    .latest-article-section {
        margin: 0 -15px 30px;
    }

    .latest-article-content {
        padding: 30px;
    }

    .article-title {
        font-size: 1.8rem;
    }

    .articles-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}

@media (max-width: 576px) {
    .categories-page {
        padding: 0 10px;
    }

    .latest-article-section {
        margin: 0 -10px 20px;
    }

    .latest-article-content {
        padding: 20px;
    }

    .article-label {
        padding: 17px 10px;
        font-size: 0.8rem;
    }

    .article-title {
        font-size: 1.5rem;
    }

    .article-brief {
        font-size: 0.9rem;
    }

    .article-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .article-author img {
        width: 32px;
        height: 32px;
    }

    .article-content {
        padding: 15px;
    }

    .article-title {
        font-size: 1.1rem;
    }

    .article-description {
        font-size: 0.85rem;
    }

    .favorite-button {
        width: 32px;
        height: 32px;
    }

    .favorite-button i {
        font-size: 1rem;
    }
}

/* 加载状态样式 */
.loading-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    background: var(--ActiveBgc);
    border-radius: 16px;
}

.loading-state i {
    font-size: 2rem;
    color: var(--active-background-color);
    margin-bottom: 10px;
}

.loading-state p {
    color: var(--text-color-secondary);
    font-size: 1rem;
}

/* 错误状态样式 */
.empty-state {
    grid-column: 1 / -1;
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
    box-shadow: 0 6px 20px var(--shadow-color);
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

.error-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    background: var(--card-background);
    border-radius: 16px;
    border: 1px solid var(--border-color);
}

.error-state i {
    font-size: 2rem;
    color: var(--button-color);
    margin-bottom: 10px;
}

.error-state p {
    color: var(--text-color-secondary);
    font-size: 1rem;
}

/* 优化文章卡片动画效果 */
.article-card {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-image img {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-overlay {
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(2px);
}

.read-more {
    color: white;
    font-size: 1rem;
    font-weight: 500;
    padding: 12px 16px;
    border: 2px solid white;
    border-radius: 20px;
    transition: all 0.3s ease;
}

.article-card:hover .read-more {
    background: white;
    color: var(--active-background-color);
}
</style>