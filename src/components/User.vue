<template>
  <div class="user-page">
    <!-- 顶部个人信息卡片 -->
    <div class="user-header">
      <div class="user-banner">
        <img src="../assets/1.jpg" alt="banner">
        <div class="user-avatar">
          <img :src="getImageUrl(user.avatar, 'UserImg')" alt="头像" @click="openDialog">
        </div>
      </div>
      <div class="user-info">
        <h2>{{ user.username }}</h2>
        <p>{{ user.email }}</p>
        <el-button type="primary" @click="LU_logout">退出登录</el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="user-content">
      <!-- 左侧边栏 -->
      <div class="user-sidebar">
        <el-card class="statistics-card">
          <div class="stat-item">
            <div class="stat-value">{{ totalViews }}</div>
            <div class="stat-label">浏览量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userArticles.length }}</div>
            <div class="stat-label">文章数</div>
          </div>
        </el-card>

        <el-card class="menu-card">
          <el-tabs v-model="activeName">
            <el-tab-pane label="已发布" name="first">
              <div class="tab-content">
                <div v-if="userArticles && userArticles.length > 0" class="articles-list">
                  <div v-for="article in userArticles" :key="article._id" class="article-item">
                    <router-link :to="{ name: 'Article', params: { id: article._id }}">
                      <div class="article-content">
                        <img v-if="article.coverImage" :src="getImageUrl(article.coverImage, 'uploads')" alt="封面图片">
                        <div class="article-info">
                          <h4>{{ article.title }}</h4>
                          <p>{{ article.BriefIntroduction || '暂无简介' }}</p>
                          <div class="article-meta">
                            <span><i class="el-icon-view"></i> {{ article.viewCount || 0 }}</span>
                            <span><i class="el-icon-star-off"></i> {{ article.favoriteCount || 0 }}</span>
                            <el-button type="danger" size="mini" icon="el-icon-delete" @click.prevent="confirmDelete(article._id)">删除</el-button>
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </div>
                </div>
                <div v-else class="no-data">暂无发布文章</div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="收藏" name="second">
              <div class="tab-content">
                <div v-if="favorites && favorites.length > 0" class="favorites-list">
                  <div v-for="actions in favorites" :key="actions.articleId?._id || actions._id" class="article-item">
                    <router-link v-if="actions.articleId?._id" :to="{ name: 'Article', params: { id: actions.articleId._id }}">
                      <div class="article-content">
                        <img v-if="actions.articleId?.coverImage" :src="getImageUrl(actions.articleId.coverImage, 'uploads')" alt="封面图片">
                        <div class="article-info">
                          <h4>{{ actions.articleId?.title || '未知标题' }}</h4>
                          <p>{{ actions.articleId?.BriefIntroduction || '暂无简介' }}</p>
                          <div class="article-meta">
                            <span><i class="el-icon-view"></i> {{ actions.articleId?.viewCount || 0 }}</span>
                            <span><i class="el-icon-star-off"></i> {{ actions.articleId?.favoriteCount || 0 }}</span>
                            <el-button type="warning" size="mini" icon="el-icon-star-off" @click.prevent="confirmUnfavorite(actions._id)">取消收藏</el-button>
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </div>
                </div>
                <div v-else class="no-data">暂无收藏文章</div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>

      <!-- 右侧内容区 -->
      <div class="user-main">
        <el-card class="recent-view-card">
          <div slot="header">
            <span>最近浏览</span>
          </div>
          <div v-if="viewedArticles && viewedArticles.length > 0" class="recent-view-content">
            <div v-for="article in viewedArticles" :key="article.articleId" class="article-item">
              <router-link :to="{ name: 'Article', params: { id: article.articleId }}">
                <div class="article-content">
                  <img v-if="article.coverImage" :src="getImageUrl(article.coverImage, 'uploads')" alt="封面图片">
                  <div class="article-info article-info-title">
                    <h4>{{ article.title || '未知标题' }}</h4>
                    <div class="article-meta">
                      <span><i class="el-icon-view"></i> {{ article.viewCount || 0 }}</span>
                      <span><i class="el-icon-star-off"></i> {{ article.favoriteCount || 0 }}</span>
                      <span class="reading-progress">
                        <el-progress 
                          :percentage="calculateProgress(article.scrollPosition, article.maxScrollPosition)" 
                          :format="percent => `已读${percent}%`"
                          :stroke-width="18"
                          :show-text="true"
                          :color="['#67C23A', '#E6A23C', '#F56C6C']"
                          :text-inside="true"
                          class="custom-progress"
                        ></el-progress>
                      </span>
                      <span class="view-time">{{ new Date(article.lastViewedAt).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
          <div v-else class="no-data">暂无浏览记录</div>
        </el-card>
      </div>
    </div>

    <!-- 头像上传弹窗 -->
    <el-dialog title="修改头像" :visible.sync="dialogVisible" width="300px">
      <el-upload action="/api/update-avatar" :headers="headers" name="avatar" list-type="picture-card"
        :on-success="handleSuccess" :on-error="handleError">
        <i class="el-icon-plus"></i>
      </el-upload>
      <p>点击上传新的头像</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      title="确认删除"
      :visible.sync="deleteDialogVisible"
      width="30%">
      <span>确定要删除这篇文章吗？此操作不可恢复。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteArticle">确定</el-button>
      </span>
    </el-dialog>

    <!-- 取消收藏确认对话框 -->
    <el-dialog
      title="确认取消收藏"
      :visible.sync="unfavoriteDialogVisible"
      width="30%">
      <span>确定要取消收藏这篇文章吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unfavoriteDialogVisible = false">取消</el-button>
        <el-button type="warning" @click="unfavoriteArticle">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import router from '@/router';
export default {
  data() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // 从 localStorage 获取 token
      },
      user: "",
      dialogVisible: false, // 控制弹框显示
      deleteDialogVisible: false, // 控制删除确认弹框显示
      unfavoriteDialogVisible: false, // 控制取消收藏确认弹框显示
      articleToDelete: null, // 要删除的文章ID
      favoriteToRemove: null, // 要取消收藏的ID
      // 收藏
      favorites: [],
      // 用户文章
      userArticles: [],
      // 浏览记录
      viewedArticles: [],
      isMobile: false,// 判断是否为移动端
      activeName: 'first',
      totalViews: 0 // 添加总浏览量数据
    };
  },
  props: {
    lastViewedArticleZi: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(['getUser', 'isLoggedIn']),

  },
  created() {
    this.user = this.getUser;// 获取用户信息

    //  this.checkDeviceType();
    //  window.addEventListener('resize', this.checkDeviceType); 
    // 监听窗口大小变化
  },


  methods: {
    LU_logout() {
      this.$emit('call-parent')
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

    // 修改头像功能
    openDialog() {
      this.dialogVisible = true; // 打开弹框
    },
    handleSuccess(response, file) {
      this.$message.success('头像上传成功！');
      this.dialogVisible = false; // 关闭弹框
    },
    handleError(err) {
      this.$message.error('头像上传失败，请重试！');
    },

    // 确认删除文章
    confirmDelete(articleId) {
      this.articleToDelete = articleId;
      this.deleteDialogVisible = true;
    },

    // 删除文章
    async deleteArticle() {
      try {
        await axios.delete(`/api/articles/${this.articleToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        this.$message.success('文章删除成功');
        this.deleteDialogVisible = false;
        // 重新加载文章列表
        this.loadUserArticles();
      } catch (error) {
        console.error('删除文章失败:', error);
        this.$message.error('删除文章失败，请重试');
      }
    },

    // 确认取消收藏
    confirmUnfavorite(favoriteId) {
      this.favoriteToRemove = favoriteId;
      this.unfavoriteDialogVisible = true;
    },

    // 取消收藏
    async unfavoriteArticle() {
      try {
        const userId = this.user._id;
        const articleId = this.favorites.find(f => f._id === this.favoriteToRemove)?.articleId?._id;

        if (!userId || !articleId) {
          throw new Error('无效的用户ID或文章ID');
        }

        await axios.delete('/api/favorites', {
          data: { userId, articleId }
        });
        
        this.$notify({
          title: '收藏',
          message: '取消收藏',
          type: 'warning'
        });
        this.unfavoriteDialogVisible = false;
        // 重新加载收藏列表
        this.loadFavorites();
      } catch (error) {
        console.error('取消收藏失败:', error);
        this.$message.error('取消收藏失败，请重试');
      }
    },
    // 检查设备类型，判断是移动端还是PC端
    // checkDeviceType() {
    //   const width = window.innerWidth;
    //   this.isMobile = width <= 768; // 判断设备是否为移动端

    //   // 如果是PC端，跳转到首页
    //   if (!this.isMobile) {
    //     this.$router.push('/Index/Home');
    //   }
    // },
    // 获取用户文章列表
    async loadUserArticles() {
      try {
        if (!this.user._id) return;
        
        const response = await axios.get(`/api/users/${this.user._id}/articles`);
        this.userArticles = response.data;

      } catch (error) {
        console.error('加载用户文章失败:', error);
        this.$message.error('加载文章列表失败');
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




      } catch (error) {
        console.error('加载收藏失败:', error)
      }
    },
    // 获取用户总浏览量
    async loadTotalViews() {
      try {
        if (!this.user._id) return;
        
        const response = await axios.get(`/api/users/${this.user._id}/total-views`);
        this.totalViews = response.data.totalViews;

      } catch (error) {
        console.error('加载总浏览量失败:', error);
        this.$message.error('加载总浏览量失败');
      }
    },

    // 获取用户的所有浏览记录
    async loadViewedArticles() {
      try {
        const response = await axios.get('/api/user/viewed-articles', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.viewedArticles = response.data.sort((a, b) => new Date(b.lastViewedAt) - new Date(a.lastViewedAt));

      } catch (error) {
        console.error('加载浏览记录失败:', error);
        this.$message.error('加载浏览记录失败');
      }
    },

    // 计算阅读进度
    calculateProgress(scrollPosition, maxScrollPosition) {
      if (!maxScrollPosition) return 0;
      const progress = (scrollPosition / maxScrollPosition) * 100;
      return Math.min(Math.round(progress), 100);
    },
  },
  mounted() {

    this.loadFavorites();
    this.loadUserArticles();
    this.loadTotalViews(); // 加载总浏览量
    this.loadViewedArticles(); // 加载浏览记录
  }
};
</script>

<style scoped>
.user-page {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
 
}

.user-header {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.user-banner {
  position: relative;
  height: 200px;
}

.user-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar {
  position: absolute;
  bottom: -50px;
  left: 50px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #fff;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  padding: 60px 50px 20px;
}

.user-info h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.user-info p {
  margin: 10px 0;
  color: #666;
}

.user-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.user-sidebar {
  flex: 1;
  flex: 0 0 280px;
}

.user-main {
  flex: 1;
  min-width: 0;
}

.statistics-card {
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  color: #666;
  margin-top: 5px;
}

.menu-card {
  margin-bottom: 20px;
}

.tab-content {
  padding: 20px 10px;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.favorite-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.favorite-item:last-child {
  border-bottom: none;
}

.favorite-content {
  display: flex;
  gap: 15px;
}

.favorite-content img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.favorite-info {
  flex: 1;
}

.favorite-info h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.favorite-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
  line-height: 20px;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.article-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.article-content {
  display: flex;
  width: 100%;
  gap: 15px;
  padding: 10px;
  align-items: center;
}

.article-content > img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.article-info {
  flex: 1;
  padding: 0 15px;
  min-width: 0;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-info h4 {
  margin: 0 !important;
  font-size: 18px;
  color: #333;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  
}

.article-info p {
  margin: 0 0 10px;
  color: #666;
  font-size: 14px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
 height: 20px;
 width: 100%;
 line-height: 20px;
}
.article-info-title{
  width: 100% !important;
  max-width: 100%;

}
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  color: #999;
  font-size: 14px;
  align-items: center;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.article-meta i {
  font-size: 16px;
}

.recent-view-content .article-item {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.recent-view-content .article-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.recent-view-content .article-content {
  display: flex;
  width: 100%;
}

.recent-view-content .article-content > img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.recent-view-content .article-info {
  flex: 1;
  padding: 0 15px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recent-view-content .article-info h4 {
  margin:0 0 10px 0 !important;
  font-size: 18px;
  color: #333;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.recent-view-content .article-info p {
  margin: 0 0 10px;
  color: #666;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  height: 20px;
  width: 100%;
  line-height: 20px;
}

.view-time {
  color: #909399;
  font-size: 12px;
}

.custom-progress {
  width: 120px;
  margin-right: 10px;
}

.custom-progress .el-progress-bar__inner {
  transition: all 0.3s ease-in-out;
}

.custom-progress .el-progress__text {
  font-size: 12px !important;
  font-weight: 500;
  color: #fff;
}

@media (max-width: 576px) {
  .article-meta {
    gap: 8px;
  }
  
  .custom-progress {
    width: 100px;
  }
  
  .view-time {
    font-size: 11px;
  }
}

/* 响应式布局 */
@media (max-width: 992px) {
  .user-content {
    flex-direction: column;
  }
  
  .user-sidebar {
    flex: none;
  }
}

@media (max-width: 768px) {
  .user-page {
    padding: 15px;
  }
  
  .user-header {
    margin-bottom: 15px;
  }

  .user-avatar {
    left: 20px;
  }

  .user-info {
    padding: 60px 20px 20px;
  }
}

@media (max-width: 576px) {
  .user-page {
    padding: 10px;
  }
  
  .user-banner {
    height: 150px;
  }
  
  .user-avatar {
    width: 100px;
    height: 100px;
    bottom: -40px;
    left: 15px;
  }
  
  .user-info {
    padding: 50px 15px 15px;
  }
  
  .user-info h2 {
    font-size: 20px;
  }
}
</style>
