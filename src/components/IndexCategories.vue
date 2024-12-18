<template>
    <div class="categories-section">
        <div class="categories-container">
            <div class="category-card" v-for="(category, index) in categorieslatestArticles" :key="index">
                <div class="category-image-wrapper">
                    <router-link :to="{
                        name: 'Article',
                        params: { id: category._id || '' },
                    }">
                        <img :src="getImageUrl(category.coverImage, 'uploads')" alt="Category cover"
                            class="category-cover" />
                        <div class="category-info">
                            <h3 class="category-title">{{ category.title }}</h3>
                            <p class="category-author">
                                <img :src="getImageUrl(authorAvatars[category.user], 'UserImg')" alt="Author Avatar"
                                    class="author-avatar" />
                                <span>{{ category.author }}</span>
                            </p>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>

        <div class="all-articles-container">
            <!-- <h2>所有文章</h2> -->
            <div class="article-card" v-for="(article, index) in paginatedArticles" :key="index">
                <div class="article-cover">
                    <img :src="getImageUrl(article.coverImage, 'uploads')" alt="Article cover"
                        class="article-cover-image" />

                </div>

                <div class="article-details">
                    <router-link :to="{
                        name: 'Article',
                        params: { id: article._id || '' },
                    }">
                        <h3 class="article-title">{{ article.title }}</h3>
                        <p class="article-date">{{ article.BriefIntroduction }}</p>
                        <p class="article-description">{{ article.description }}</p>
                        <p class="article-author">
                            <img :src="getImageUrl(authorAvatars[article.user], 'UserImg')" alt="Author avatar"
                                class="author-avatar" />
                            <span>{{ article.author }}</span>
                        </p>



                    </router-link>
                </div>
                <div>
                    <span v-if="userInformation" class="favorite-button" @click="toggleFavorite(article._id)">
                        <img :src="require(`@/assets/ShouCang-Huang.png`)" v-if="article.isFavorite" />
                        <img :src="require(`@/assets/ShouCang-Bai.png`)" v-else />
                    </span>
                    <span v-else></span>
                </div>

            </div>

            <!-- Element UI Pagination -->
            <el-pagination background layout="prev, pager, next" :total="categoriesarticles.length"
                :page-size="pageSize" :current-page="currentPage" @current-change="handlePageChange"></el-pagination>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

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
        }
    },

    components: {},
    computed: {
        // 计算当前页要显示的文章
        paginatedArticles() {
            const start = (this.currentPage - 1) * this.pageSize
            const end = start + this.pageSize
            return this.categoriesarticles.slice(start, end)
        },
    },
    watch: {},
    methods: {
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

            console.log('拼接后的请求路径是', imageUrl);
            return imageUrl;
        },
        async categoriesfetchArticles() {
            try {
                // 发送GET请求，获取文章列表
                const response = await axios.get('/api/articles')
                this.categoriesarticles = response.data // 存储文章列表
                // console.log('获取到了所有文章', response.data)

                // 设置最新文章（假设你想获取最新的两篇文章）
                this.categorieslatestArticles = this.categoriesarticles.slice(-1) // 获取最后两篇文章
                // 获取每篇文章的作者信息
                for (let article of this.categoriesarticles) {
                    if (article.user) {
                        this.fetchAuthorAvatar(article.user) // 获取作者头像
                    }
                }
            } catch (error) {
                console.error('Error fetching articles:', error)
            }
        },
        // 获取用户头像
        async fetchAuthorAvatar(userId) {
            try {
                const userResponse = await axios.get(`/api/public-user-info/${userId}`)
                this.$set(this.authorAvatars, userId, userResponse.data.avatar) // 存储用户的头像信息

                // console.log('打印了authorAvatars', this.authorAvatars)
            } catch (error) {
                console.error('Error fetching user avatar:', error)
            }
        },
        //拼接封面图片
        // HomegetImageUrl(imageName) {
        //     return `http://localhost:3000/uploads/${imageName}`
        // },
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
                }
            } catch (error) {
                console.error('请求失败:', error)
            }
        },
        //获取用户信息用来或得到用户id，然后通过用户id获取用户收藏的文章id，然后对比文章id，如果相同则显示收藏按钮，否则显示未收藏按钮。
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
                console.log('在持久化中获取到用户的收藏记录', this.favorites);
              
                // 如果没有数据，直接返回
                if (!Array.isArray(this.favorites)) {
                    console.error("返回的收藏数据不是数组", this.favorites);
                    return;
                }



                this.categoriesarticles.forEach((article) => {
                    // 检查 this.favorites 中是否有与当前 article._id 匹配的收藏记录
                    article.isFavorite = this.favorites.some((fav) => {
                        console.log("正在检查的收藏:", fav.articleId._id);  // 打印当前收藏的 articleId
                        console.log("当前文章的 _id:", article._id);      // 打印当前文章的 _id
                        return String(fav.articleId._id) === String(article._id);
                    });

                    // 打印检查后的收藏状态
                    console.log("更改后的状态", article.isFavorite, article._id);
                });


            } catch (error) {
                console.error('加载收藏失败:', error)
            }
        },
    },

    created() {
        this.getuser()
        this.loadFavorites()
        this.categoriesfetchArticles()
        // 监听登录成功事件
        
    },
    
}
</script>

<style scoped>
.categories-section {
    padding: 30px 25px 30px 25px;
}

.categories-container {
    display: flex;
    justify-content: space-between;
    object-fit: cover;
    height: 400px;
}

.category-card {
    border-radius: 15px;
    overflow: hidden;
    width: 100%;

    position: relative;

}

.category-image-wrapper {


    padding-top: 100%;
    /* 1:1 aspect ratio */
}

.category-cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;

}

.category-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    color: white;

    background: rgba(255, 255, 255, 0.5);
    /* 半透明的白色背景 */
    /* backdrop-filter: blur(3px); */
    /* 模糊程度，越大越模糊 */
    /* border-radius: 10px; */
    /* 可选，增加圆角让效果更柔和 */
    border: 1px solid rgba(255, 255, 255, 0.3);
    /* 可选，增加边框增强视觉 */
    padding: 20px;
    /* 内边距 */
    color: #fff;
    /* 根据需要调整文字颜色 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* 可选，为容器增加阴影 */
    /* Semi-transparent overlay */
}

.category-title {
    margin: 0px 0 20px 0;
    font-size: 25px;
    font-weight: 700;
}

.category-author {
    margin: 10px 0 10px 0;
    display: flex;
    margin: 0;
    font-size: 14px;
    align-items: center;
}

.category-author img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
}

.article-author {
    display: flex;
    margin: 0;
    font-size: 14px;
    align-items: center;
    line-height: 16px;
}

.article-author img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
}

.all-articles-container {
    margin-top: 20px;
    z-index: 10;
}

.article-card {

    /* height: 200px; */
    margin-bottom: 20px;
    margin-top: 55px;

    padding: 2vw;

    background-color: var(--ActiveBgc);

    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: var(--text-color);
    overflow: hidden;
    /* height: auto;  */
}

.article-card:hover {
    /* border: 1px solid black; */
    transform: scale(1.05);
}

.article-card:active {
    transform: scale(0.95) rotateZ(1.7deg);
}

.article-cover {
    border-radius: 10px;
    width: 100%;
    /* 设置宽度为父容器的100% */
    aspect-ratio: 1 / 1;
    /* 宽高比为1:1，保持正方形 */
    margin-right: 20px;
    flex: 1;
}

.article-cover>img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}

.article-details {

    width: 100%;
    aspect-ratio: 2 / 1;
    /* height: 100% !important; */

    flex: 2;
}

.article-details>a {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    text-decoration: none;
    color: var(--font-color);

}

.article-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    text-align: left;
}

.article-description {
    margin: 5px 0;
    font-size: 14px;
}

.article-date {
    margin: 0;
    display: -webkit-box;
    /* 必须设置为 -webkit-box 才能配合 line-clamp 使用 */
    -webkit-box-orient: vertical;
    /* 设置垂直排列 */
    overflow: hidden;
    /* 隐藏超出部分 */
    -webkit-line-clamp: 1;
    /* 限制显示行数，这里设置为 2 行，超出部分用省略号表示 */
    height: 20px;
    /* 固定高度 */
    line-height: 20px;
    font-size: 10px;
    color: gray;
}

.favorite-button {
    /* width: 100px;
    height: 100%;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: 1; */
}

.favorite-button img {

    width: 30px;
    height: 30px;
}

.el-pagination {
    text-align: center;
}

@media (max-width: 576px) {
    .article-title {

        font-size: 10px;

    }

    .article-author {
        font-size: .5rem;
    }

}

/* 小屏幕（手机横屏） */
@media (min-width: 577px) and (max-width: 768px) {
    .article-title {

        font-size: 13px;

    }
}

/* 中等屏幕（平板） */
@media (min-width: 769px) and (max-width: 992px) {
    .article-title {

        font-size: 13px;

    }

    .article-author {
        font-size: .625rem;
    }
}

/* 大屏幕（小笔记本） */
@media (min-width: 993px) and (max-width: 1200px) {
    .article-author {
        font-size: .625rem;
    }
}

/* 超大屏幕（台式机） */
@media (min-width: 1201px) {}
</style>