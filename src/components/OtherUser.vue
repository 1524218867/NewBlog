<template>
  <div class="user-page">
    <!-- 顶部返回按钮和标题 -->
    <div class="header">
      <button @click="goBack" class="back-button"><i class="back-icon">←</i><span class="back-text">返回</span></button>
      <span class="separator">/</span>
      <span class="title">用户主页</span>
    </div>

    <!-- 用户横幅 -->
    <div class="user-banner" :style="{ backgroundImage: `url(${getImageUrl(userInfo?.banner, 'uploads') || defaultBanner})` }">
      <div class="user-avatar">
        <img :src="getImageUrl(userInfo?.avatar, 'UserImg') || defaultAvatar" alt="用户头像" />
      </div>
    </div>

    <!-- 用户信息 -->
    <div class="user-info">
      <h2>{{ userInfo?.username || '未知用户' }}</h2>
      <!-- <p>{{ userInfo?.bio || '这个人很懒，什么都没有写~' }}</p> -->
    </div>

    <!-- 主要内容区域 -->
    <div class="user-content">
      <!-- 侧边栏 -->
      <div class="user-sidebar">
        <!-- 统计卡片 -->
        <div class="statistics-card">
          <h3>数据统计</h3>
          <div class="statistics-grid">
            <div class="stat-item">
              <div class="stat-value">{{ userStats?.articles || 0 }}</div>
              <div class="stat-label">文章</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章列表区域 -->
      <div class="main-content">
        <el-tabs v-model="activeTab" class="custom-tabs">
          <el-tab-pane label="文章" name="articles">
            <div class="articles-list" v-if="articles.length > 0">
              <div v-for="article in articles" :key="article?._id" class="article-card">
                <div class="article-content">
                  <div class="article-info">
                    <div class="article-info-title">
                      <h4>{{ article?.title || '无标题' }}</h4>
                    </div>
                    <p>{{ article?.summary || '暂无简介' }}</p>
                    <div class="article-meta">
                      <span>{{ article?.viewCount || 0 }} 阅读</span>
                      <span>{{ article?.likes || 0 }} 点赞</span>
                      <span>{{ article?.favoriteCount || 0 }} 收藏</span>
                      <el-button size="small" type="primary" @click="viewArticle(article?._id)">阅读全文</el-button>
                    </div>
                  </div>
                  <div class="article-image" v-if="article?.cover">
                    <img :src="article.cover" :alt="article?.title || '文章图片'" />
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>暂无文章</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OtherUser',
  data() {
    return {
      userInfo: {},
      userStats: {},
      articles: [],
      activeTab: 'articles',
      defaultAvatar: require('@/assets/Nologing.png'),
      defaultBanner: require('@/assets/LunBoTuImg1.jpg')
    };
  },
  created() {
    this.fetchUserInfo();
    this.fetchUserArticles();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getImageUrl(imageName, type) {
      if (!imageName) {
        return null;
      }

      const baseUrl = window.location.origin;
      
      // 根据type参数决定图片存储的位置
      const imagePath = type === 'UserImg' ? `UserImg/${imageName}` : `uploads/${imageName}`;
      const url = new URL(imagePath, baseUrl);

      return url.toString();
    },
    async fetchUserInfo() {
      try {
        const userId = this.$route.params.id;
        const response = await axios.get(`/api/public-user-info/${userId}`);
        console.log(response.data);
        this.userInfo = response.data;
        this.fetchUserStats();
      } catch (error) {
        console.error('Error fetching user info:', error);
        this.$message.error('获取用户信息失败');
      }
    },
    async fetchUserStats() {
      try {
        const userId = this.$route.params.id;
        const response = await axios.get(`/api/users/${userId}/total-views`);
        this.userStats = {
          ...response.data,
          articles: this.articles.length
        };
      } catch (error) {
        console.error('Error fetching user stats:', error);
        this.$message.error('获取用户统计信息失败');
      }
    },
    async fetchUserArticles() {
      try {
        const userId = this.$route.params.id;
        const response = await axios.get(`/api/users/${userId}/articles`);
        this.articles = response.data;
      } catch (error) {
        console.error('Error fetching user articles:', error);
        this.$message.error('获取文章列表失败');
      }
    },
    viewArticle(articleId) {
      this.$router.push(`/Article/${articleId}`);
    }
  }
};
</script>

<style scoped>
.user-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: var(--card-background);
  transform: translateY(-1px);
}

.back-icon {
  font-style: normal;
  font-size: 16px;
}

.separator {
  color: var(--text-color);
  margin: 0 10px;
  opacity: 0.6;
}

.title {
  font-size: 16px;
  color: var(--text-color);
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-banner {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 8px;
}

.user-avatar {
  position: absolute;
  bottom: -50px;
  left: 30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--background-color);
  box-shadow: var(--shadow-color);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  padding: 60px 30px 30px;
  background: var(--background-color);
  border-radius: 0 0 8px 8px;
  margin-bottom: 30px;
  box-shadow: var(--shadow-color);
}

.user-info h2 {
  margin: 0 0 10px;
  font-size: 24px;
}

.user-info p {
  margin: 0;
  color: var(--text-color-secondary);
}

.user-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
}

.statistics-card {
  background: var(--background-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-color);
  border: 1px solid var(--border-color);
}

.statistics-card h3 {
  margin: 0 0 20px;
  font-size: 18px;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  color: var(--text-color-secondary);
}
.articles-list{
    padding: 10px;
}
.article-card {
  background: var(--background-color);
  border-radius: 8px;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-color);
  border: 1px solid var(--border-color);
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-color);
  border-color: var(--border-color);
}

.article-content {
  display: flex;
  padding: 20px;
  gap: 20px;
}

.article-info {
  flex: 1;
}

.article-info h4 {
  margin: 0 0 10px;
  font-size: 18px;
}

.article-info p {
  margin: 0 0 15px;
  color: var(--text-color);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: var(--text-color-secondary);
}

.article-image {
  width: 200px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-color-secondary);
}

@media (max-width: 1200px) {
  .user-content {
    grid-template-columns: 250px 1fr;
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .user-content {
    grid-template-columns: 1fr;
  }

  .user-sidebar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .user-page {
    padding: 15px;
  }

  .user-banner {
    height: 150px;
  }

  .user-avatar {
    width: 80px;
    height: 80px;
    bottom: -40px;
  }

  .user-info {
    padding: 50px 20px 20px;
  }

  .article-content {
    flex-direction: column;
    padding: 15px;
  }

  .article-image {
    width: 100%;
    height: 150px;
  }
}
</style>