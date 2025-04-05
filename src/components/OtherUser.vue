<template>
  <div class="other-user">
    <div class="header">
            <button @click="goBack" class="back-button"><i class="back-icon">←</i><span class="back-text">返回</span></button>
            <span class="separator">/</span>
            <span class="title">用户主页</span>
        </div>
    <!-- 用户信息卡片 -->
    <section class="user-profile-card">
      
      <div class="profile-header">
        <div class="profile-avatar">
          <img :src="getImageUrl(userInfo?.avatar, 'UserImg') || defaultAvatar" alt="用户头像" />
        </div>
        <div class="profile-info">
          <h2 class="user-name">{{ userInfo.username }}</h2>
          <p class="user-bio">{{ userBio }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">{{ articlesCount }}</span>
              <span class="stat-label">文章</span>
            </div>
            <div class="stat-item clickable" @click="showFollowers">
              <span class="stat-value">{{ followersCount }}</span>
              <span class="stat-label">关注者</span>
            </div>
            <div class="stat-item clickable" @click="showFollowing">
              <span class="stat-value">{{ followingCount }}</span>
              <span class="stat-label">关注</span>
            </div>
          </div>
          <div class="action-buttons">
            <el-button 
              type="primary" 
              class="follow-btn"
              :class="{ 'is-following': isFollowing }"
              @click="handleFollow"
              :loading="loading"
              :disabled="isSelfProfile || loading"
            >
              {{ isFollowing ? '已关注' : '关注' }}
            </el-button>
            <el-button 
              type="success" 
              icon="el-icon-message"
              class="message-btn"
              @click="handleSendMessage"
            >
              发消息
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 文章列表区域 -->
    <section class="user-articles">
      <div class="section-header">
        <h3 class="section-title">发布的文章</h3>
        <div class="view-options">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="grid">网格视图</el-radio-button>
            <el-radio-button label="list">列表视图</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="articles-container" :class="viewMode">
        <article v-for="article in articles" 
                 :key="article.id" 
                 class="article-card">
          <div class="article-cover">
            <img :src="getImageUrl(article.coverImage, 'uploads')" :alt="article.title">
          </div>
          <div class="article-content">
            <h4 class="article-title">{{ article.title }}</h4>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <div class="article-meta">
              <span class="publish-date">
                <i class="el-icon-date"></i>
                {{ formatDate(article.publishDate) }}
              </span>
              <span class="read-count">
                <i class="el-icon-view"></i>
                {{ article.viewCount }}
              </span>
              <span class="like-count">
                <i class="el-icon-star-off"></i>
                {{ article.favoriteCount }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- 分页器 -->
      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalArticles"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
    </section>

    <!-- 关注者列表对话框 -->
    <el-dialog
      title="关注者"
      :visible.sync="followersDialogVisible"
      width="30%"
      center
    >
      <div v-loading="loadingFollowers">
        <div v-if="followersList.length > 0" class="user-list">
          <div v-for="user in followersList" :key="user._id" class="user-list-item" @click="navigateToUser(user._id)">
            <div class="user-avatar">
              <img :src="getImageUrl(user.avatar, 'UserImg') || defaultAvatar" :alt="user.username">
            </div>
            <div class="user-info">
              <span class="user-name">{{ user.username }}</span>
              <span class="user-bio" v-if="user.bio">{{ user.bio }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="!loadingFollowers" class="empty-list">
          暂无关注者
        </div>
      </div>
    </el-dialog>

    <!-- 关注列表对话框 -->
    <el-dialog
      title="关注"
      :visible.sync="followingDialogVisible"
      width="30%"
      center
    >
      <div v-loading="loadingFollowing">
        <div v-if="followingList.length > 0" class="user-list">
          <div v-for="user in followingList" :key="user._id" class="user-list-item" @click="navigateToUser(user._id)">
            <div class="user-avatar">
              <img :src="getImageUrl(user.avatar, 'UserImg') || defaultAvatar" :alt="user.username">
            </div>
            <div class="user-info">
              <span class="user-name">{{ user.username }}</span>
              <span class="user-bio" v-if="user.bio">{{ user.bio }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="!loadingFollowing" class="empty-list">
          暂无关注
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'OtherUser',
  
  data() {
    return {
      userName: '访问用户',
      userBio: '这是一段个人简介',
      userAvatar: '',
      defaultAvatar: '/UserImg/default-avatar.png',
      articlesCount: 0,
      followersCount: 0,
      followingCount: 0,
      isFollowing: false,
      viewMode: 'grid',
      articles: [],
      currentPage: 1,
      pageSize: 12,
      totalArticles: 0,
      userInfo: {},
      userStats: {},
      activeTab: 'articles',
      loading: false,
      followersDialogVisible: false,
      followingDialogVisible: false,
      followersList: [],
      followingList: [],
      loadingFollowers: false,
      loadingFollowing: false
    }
  },

  computed: {
    ...mapGetters(['isLoggedIn', 'getUser']),
    
    currentUserId() {
      const user = this.getUser;
      return user && user._id ? user._id : null;
    },
    
    targetUserId() {
      return this.$route.params.id;
    },
    
    isSelfProfile() {
      return this.currentUserId === this.targetUserId;
    }
  },
  
  created() {
    this.fetchUserInfo();
    this.fetchUserArticles();
    if (this.isLoggedIn && this.currentUserId) {
      this.checkFollowStatus();
    }
  },
  
  methods: {
    async handleFollow() {
      if (!this.isLoggedIn) {
        this.$message.warning('请先登录后再关注用户');
        this.$router.push('/login');
        return;
      }
      
      if (this.isSelfProfile) {
        this.$message.warning('不能关注自己');
        return;
      }
      
      this.loading = true;
      
      try {
        if (this.isFollowing) {
          await this.unfollowUser();
        } else {
          await this.followUser();
        }
      } catch (error) {
        console.error('关注操作失败:', error);
        this.$message.error('操作失败，请稍后再试');
      } finally {
        this.loading = false;
      }
    },
    
    async followUser() {
      try {
        const response = await axios.post('/api/follow', {
          followeeId: this.targetUserId
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          this.isFollowing = true;
          this.followersCount++;
          this.$message.success(`已关注 ${this.userInfo.username}`);
        } else {
          throw new Error(response.data.message || '关注失败');
        }
      } catch (error) {
        console.error('关注失败:', error);
        this.$message.error(error.response?.data?.message || '关注失败，请稍后再试');
        throw error;
      }
    },
    
    async unfollowUser() {
      try {
        const response = await axios.delete('/api/follow', {
          data: { followeeId: this.targetUserId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          this.isFollowing = false;
          this.followersCount = Math.max(0, this.followersCount - 1);
          this.$message.success(`已取消关注 ${this.userInfo.username}`);
        } else {
          throw new Error(response.data.message || '取消关注失败');
        }
      } catch (error) {
        console.error('取消关注失败:', error);
        this.$message.error(error.response?.data?.message || '取消关注失败，请稍后再试');
        throw error;
      }
    },
    
    async checkFollowStatus() {
      if (!this.isLoggedIn || !this.currentUserId || this.isSelfProfile) return;
      
      try {
        const response = await axios.get(`/api/follow/check/${this.targetUserId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        this.isFollowing = response.data.isFollowing;
        console.log('关注状态:', this.isFollowing);
      } catch (error) {
        console.error('检查关注状态失败:', error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },

    handlePageChange(page) {
      this.currentPage = page
      // 实现分页加载逻辑
    },
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
        const userId = this.targetUserId;
        const response = await axios.get(`/api/public-user-info/${userId}`);
        console.log('用户信息',response.data);
        this.userInfo = response.data;
        
        this.userName = this.userInfo.username || '访问用户';
        this.userBio = this.userInfo.bio || '这位用户很神秘，暂未设置个人简介';
        this.userAvatar = this.userInfo.avatar;
        
        this.fetchUserStats();
      } catch (error) {
        console.error('Error fetching user info:', error);
        this.$message.error('获取用户信息失败');
      }
    },
    async fetchUserStats() {
      try {
        const response = await axios.get(`/api/user-stats/${this.targetUserId}`);
        const stats = response.data;
        
        this.articlesCount = stats.articlesCount || this.articles.length;
        this.followersCount = stats.followersCount || 0;
        this.followingCount = stats.followingCount || 0;
        
        this.userStats = {
          ...stats,
          articles: this.articlesCount
        };
        
        console.log('用户统计信息', this.userStats);
      } catch (error) {
        console.error('获取用户统计信息失败:', error);
        this.$message.error('获取用户统计信息失败');
      }
    },
    async fetchUserArticles() {
      try {
        const userId = this.targetUserId;
        const response = await axios.get(`/api/users/${userId}/articles`);
        this.articles = response.data;
        console.log('用户文章列表',this.articles);
      } catch (error) {
        console.error('Error fetching user articles:', error);
        this.$message.error('获取文章列表失败');
      }
    },
    viewArticle(articleId) {
      this.$router.push(`/Article/${articleId}`);
    },
    handleSendMessage() {
      // 获取用户ID
      const userId = this.$route.params.id;
      
      // 检查是否已登录
      if (!this.$store.getters.isLoggedIn) {
        this.$message.warning('请先登录后再发送消息');
        this.$router.push('/login');
        return;
      }
      
      // 跳转到消息页面，带上目标用户ID
      this.$router.push({
        path: '/messages',
        query: { 
          createChat: 'true',
          userId: userId,
          userName: this.userInfo.username,
          userAvatar: this.userInfo.avatar
        }
      });
    },
    async showFollowers() {
      if (this.followersCount === 0) {
        this.$message.info('暂无关注者');
        return;
      }
      
      this.followersDialogVisible = true;
      this.loadingFollowers = true;
      
      try {
        const response = await axios.get(`/api/follow/followers/${this.targetUserId}`);
        this.followersList = response.data;
      } catch (error) {
        console.error('获取关注者列表失败:', error);
        this.$message.error('获取关注者列表失败');
      } finally {
        this.loadingFollowers = false;
      }
    },
    async showFollowing() {
      if (this.followingCount === 0) {
        this.$message.info('暂无关注');
        return;
      }
      
      this.followingDialogVisible = true;
      this.loadingFollowing = true;
      
      try {
        const response = await axios.get(`/api/follow/following/${this.targetUserId}`);
        this.followingList = response.data;
      } catch (error) {
        console.error('获取关注列表失败:', error);
        this.$message.error('获取关注列表失败');
      } finally {
        this.loadingFollowing = false;
      }
    },
    navigateToUser(userId) {
      if (userId === this.currentUserId) {
        this.$router.push('/Index/My'); // 如果是当前用户，跳转到个人主页
      } else {
        this.$router.push(`/user/${userId}`); // 修改为正确的路径
        
        // 如果当前已经在用户页面，需要刷新数据
        if (this.$route.name === 'OtherUser') {
          this.fetchUserInfo();
          this.fetchUserArticles();
          if (this.isLoggedIn) {
            this.checkFollowStatus();
          }
        }
      }
    }
  }
}
</script>

<style scoped>

.header {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    color: var(--text-color);
    position: sticky;
    top: 0;
    padding: 20px;
    background-color: var(--background-color);
    z-index: 100;
    box-shadow: 0 4px 15px var(--shadow-color);
    
    border-radius: 0 0 20px 20px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    margin-bottom: 25px;
    border: 1px solid var(--border-color);
}

.back-button {
    border: none;
    background-color: var(--button-color);
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 16px;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px var(--shadow-color-strong);
}

.back-button:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 15px var(--shadow-color-strong);
    background-color: var(--button-color);
}

.back-icon {
    font-style: normal;
    margin-right: 8px;
    font-weight: bold;
    transition: transform 0.3s ease;
}

.back-button:hover .back-icon {
    transform: translateX(-3px);
}

.back-text {
    font-weight: 500;
    letter-spacing: 0.5px;
}

.separator {
    margin: 0 15px;
    font-size: 18px;
    color: var(--text-color);
    opacity: 0.5;
    font-weight: 300;
}

.title {
    font-size: 22px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70%;
    transition: all 0.3s ease;
    color: right;
}

.other-user {
  --primary-color: var(--active-background-color);
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --border-radius: 12px;
  --spacing-unit: 1rem;
  
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-unit);
}

/* 用户信息卡片样式 */
.user-profile-card {
  background: var(--background-color);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 2);
  margin-bottom: calc(var(--spacing-unit) * 2);
  box-shadow: var(--card-shadow);
}

.profile-header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: calc(var(--spacing-unit) * 2);
  align-items: center;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}
.profile-avatar>img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar-img:hover {
  transform: scale(1.05);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-unit);
}

.user-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.user-bio {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.user-stats {
  display: flex;
  gap: calc(var(--spacing-unit) * 2);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.follow-btn, .message-btn {
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.follow-btn.is-following {
  background-color: #67c23a;
}

.message-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 文章列表区域样式 */
.user-articles {
  background: var(--background-color);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing-unit) * 2);
  box-shadow: var(--card-shadow);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: calc(var(--spacing-unit) * 2);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.articles-container {
  display: grid;
  gap: calc(var(--spacing-unit) * 2);
}

.articles-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.articles-container.list {
  grid-template-columns: 1fr;
}

.articles-container.list .article-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
}

.articles-container.list .article-cover {
  height: 100%;
  aspect-ratio: auto;
}

.articles-container.list .article-excerpt {
  -webkit-line-clamp: 2;
}

.article-card {
  background: var(--ActiveBgc);
  border-radius: calc(var(--border-radius) / 2);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-4px);
}

.article-cover {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-cover img {
  transform: scale(1.05);
}

.article-content {
  padding: var(--spacing-unit);
}

.article-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-excerpt {
  color: #666;
  font-size: 0.875rem;
  margin: 0 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: var(--spacing-unit);
  color: #999;
  font-size: 0.875rem;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-wrapper {
  margin-top: calc(var(--spacing-unit) * 2);
  display: flex;
  justify-content: center;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .profile-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .profile-avatar {
    margin: 0 auto;
  }

  .user-stats {
    justify-content: center;
  }

  .action-buttons {
    flex-direction: row;
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    gap: var(--spacing-unit);
  }

  .articles-container.grid {
    grid-template-columns: 1fr;
  }
  
  /* 移动端列表视图样式优化 */
  .articles-container.list .article-card {
    grid-template-columns: 120px 1fr;
  }
}

@media (max-width: 480px) {
  .other-user {
    padding: calc(var(--spacing-unit) / 2);
  }

  .user-profile-card,
  .user-articles {
    padding: var(--spacing-unit);
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
  }

  .user-stats {
    flex-wrap: wrap;
    gap: var(--spacing-unit);
  }
  
  /* 在小屏幕上进一步优化列表视图 */
  .articles-container.list .article-card {
    grid-template-columns: 100px 1fr;
    gap: 10px;
  }
  
  .articles-container.list .article-meta {
    flex-wrap: wrap;
    gap: 6px;
  }
}

/* 添加关注者和关注列表的样式 */
.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable:hover {
  transform: translateY(-2px);
  color: var(--primary-color);
}

.user-list {
  max-height: 60vh;
  overflow-y: auto;
}

.user-list-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-list-item:hover {
  background-color: var(--ActiveBgc);
}

.user-list-item .user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
}

.user-list-item .user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-list-item .user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-list-item .user-name {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-color);
}

.user-list-item .user-bio {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-list {
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>