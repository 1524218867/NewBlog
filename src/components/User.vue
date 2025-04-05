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
        <div class="user-details">
          <div class="username-container">
            <h2>{{ user.username }}</h2>
            <el-button type="text" icon="el-icon-edit" @click="openEditUsernameDialog"></el-button>
          </div>
          <p>{{ user.email }}</p>
          <el-button type="text" class="change-password-btn" @click="openChangePasswordDialog">修改密码</el-button>
        </div>
        <el-button type="primary" @click="LU_logout" style="margin-left: auto;">退出登录</el-button>
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
          <div class="stat-item clickable" @click="showFollowers">
            <div class="stat-value">{{ followersCount }}</div>
            <div class="stat-label">关注者</div>
          </div>
          <div class="stat-item clickable" @click="showFollowing">
            <div class="stat-value">{{ followingCount }}</div>
            <div class="stat-label">关注</div>
          </div>
          <el-button type="primary" class="create-article-btn" @click="openCreateArticleDialog">
            <i class="el-icon-edit"></i> 创作文章
          </el-button>
        </el-card>

        <el-card class="menu-card">
          <el-tabs v-model="activeName">
            <el-tab-pane label="已发布" name="first">
              <div class="tab-content">
                <div v-if="userArticles && userArticles.length > 0" class="articles-list">
                  <div v-for="article in paginatedArticles" :key="article._id" class="article-item">
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
                  
                  <!-- 文章分页器 -->
                  <div class="pagination-container">
                    <el-pagination
                      @current-change="handleArticlesPageChange"
                      :current-page.sync="articlesCurrentPage"
                      :page-size="pageSize"
                      layout="prev, pager, next"
                      :total="userArticles.length">
                    </el-pagination>
                  </div>
                </div>
                <div v-else class="no-data">暂无发布文章</div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="收藏" name="second">
              <div class="tab-content">
                <div v-if="favorites && favorites.length > 0" class="favorites-list">
                  <div v-for="actions in paginatedFavorites" :key="actions.articleId?._id || actions._id" class="article-item">
                    <!-- 处理有效的收藏记录 -->
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
                    <!-- 处理无效的收藏记录 -->
                    <div v-else class="article-content invalid-favorite">
                      <div class="article-info">
                        <h4>无效收藏记录</h4>
                        <p>此收藏记录的文章可能已被删除</p>
                        <div class="article-meta">
                          <el-button type="danger" size="mini" icon="el-icon-delete" @click.prevent="confirmUnfavorite(actions._id)">删除无效记录</el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 收藏分页器 -->
                  <div class="pagination-container">
                    <el-pagination
                      @current-change="handleFavoritesPageChange"
                      :current-page.sync="favoritesCurrentPage"
                      :page-size="pageSize"
                      layout="prev, pager, next"
                      :total="favorites.length">
                    </el-pagination>
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
            <div v-for="article in paginatedViewedArticles" :key="article.articleId" class="article-item">
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
            
            <!-- 浏览记录分页器 -->
            <div class="pagination-container">
              <el-pagination
                @current-change="handleViewedArticlesPageChange"
                :current-page.sync="viewedArticlesCurrentPage"
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="viewedArticles.length">
              </el-pagination>
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
    <!-- 修改昵称对话框 -->
    <el-dialog
      title="修改昵称"
      :visible.sync="editUsernameDialogVisible"
      width="400px"
      custom-class="custom-dialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="usernameForm"
        :rules="usernameRules"
        ref="usernameForm"
        label-position="top"
        class="custom-form"
      >
        <el-form-item label="新昵称" prop="newUsername">
          <el-input
            v-model="usernameForm.newUsername"
            placeholder="请输入新昵称"
            prefix-icon="el-icon-user"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="editUsernameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUsername">确定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordDialogVisible"
      width="400px"
      custom-class="custom-dialog"
      :close-on-click-modal="false"
    >
      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordForm"
        label-position="top"
        class="custom-form"
      >
        <el-form-item label="原密码" prop="currentPassword">
          <el-input
            type="password"
            v-model="passwordForm.currentPassword"
            placeholder="请输入原密码"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="passwordForm.newPassword"
            placeholder="请输入新密码"
            prefix-icon="el-icon-key"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="passwordForm.confirmPassword"
            placeholder="请确认新密码"
            prefix-icon="el-icon-key"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="changePasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPassword">确定</el-button>
      </span>
    </el-dialog>

    <!-- 创作文章弹窗 -->
    <el-dialog
      title="创作文章"
      :visible.sync="createArticleDialogVisible"
      width="80%"
      :fullscreen="isMobile"
      custom-class="create-article-dialog"
      :close-on-click-modal="false"
    >
      <el-form :model="articleForm" :rules="articleRules" ref="articleForm" label-position="top">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="categories">
          <el-select v-model="articleForm.categories" placeholder="请选择文章分类" style="width: 100%">
            <el-option v-for="category in categories" :key="category._id" :label="category.name" :value="category._id">
              <span class="category-option">
                <i :class="getCategoryIcon(category.name)"></i>
                <span class="category-name">{{ category.name }}</span>
                <span class="category-desc">{{ category.description }}</span>
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片" prop="coverImage">
          <el-upload 
            class="upload-demo" 
            action="" 
            :file-list="fileList" 
            :on-change="handleFileUpload" 
            :auto-upload="false" 
            :limit="1" 
            :on-exceed="handleExceed">
            <el-button>点击上传图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传一张封面图片</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章简介" prop="BriefIntroduction">
          <el-input
            type="textarea"
            v-model="articleForm.BriefIntroduction"
            :rows="3"
            placeholder="请输入文章简介"
            maxlength="200"
            show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <div class="editor-container">
            <quill-editor v-model="articleForm.content"
              :options="editorOptions"
              class="quill-editor"
              @text-change="onEditorChange">
            </quill-editor>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createArticleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitArticle" :loading="submitting">发布文章</el-button>
      </span>
    </el-dialog>

    <!-- 页面底部 -->
    <Footer />
    
    <!-- 关注者列表对话框 -->
    <el-dialog
      title="关注者"
      :visible.sync="followersDialogVisible"
      width="50%"
      center
    >
      <div v-loading="loadingFollowers">
        <div v-if="followersList.length > 0" class="user-list">
          <div v-for="user in followersList" :key="user._id" class="user-list-item" @click="navigateToUser(user._id)">
            <div class="user-avatar small">
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
      width="50%"
      center
    >
      <div v-loading="loadingFollowing">
        <div v-if="followingList.length > 0" class="user-list">
          <div v-for="user in followingList" :key="user._id" class="user-list-item" @click="navigateToUser(user._id)">
            <div class="user-avatar small">
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
import { mapGetters } from 'vuex';
import axios from 'axios';
import router from '@/router';
import Footer from './Footer.vue';
import { VueEditor } from 'vue2-editor';
export default {
  components: {
    Footer,
    VueEditor
  },
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
      fileList: [],
      editorOptions: {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["clean"],
            ["image"], // 添加图片按钮
          ],
        },
      },
      articleForm: {
        title: "",
        BriefIntroduction: "",
        content: "",
        categories: "", // 单个分类ID
        coverImage: null,
      },
      userArticles: [],
      // 浏览记录
      viewedArticles: [],
      isMobile: false,// 判断是否为移动端
      activeName: 'first',
      totalViews: 0, // 添加总浏览量数据
      // 修改昵称相关数据
      editUsernameDialogVisible: false,
      usernameForm: {
        newUsername: ''
      },
      usernameRules: {
        newUsername: [
          { required: true, message: '请输入新昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 修改密码相关数据
      changePasswordDialogVisible: false,
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      // 创作文章相关数据
      createArticleDialogVisible: false,
      submitting: false,
     
      categories: [], // 分类数据
      articleRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        BriefIntroduction: [
          { required: true, message: '请输入文章简介', trigger: 'blur' },
          { max: 200, message: '简介不能超过200个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      customToolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['image', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }]
      ],
      passwordRules: {
        currentPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value !== this.passwordForm.newPassword) {
              callback(new Error('两次输入的密码不一致'));
            } else {
              callback();
            }
          }, trigger: 'blur' }
        ]
      },
      followersCount: 0,
      followingCount: 0,
      defaultAvatar: '/UserImg/default-avatar.png',
      followersDialogVisible: false,
      followingDialogVisible: false,
      followersList: [],
      followingList: [],
      loadingFollowers: false,
      loadingFollowing: false,
      articlesCurrentPage: 1,
      favoritesCurrentPage: 1,
      viewedArticlesCurrentPage: 1,
      pageSize: 10,
    };
  },
  props: {
    lastViewedArticleZi: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters(['getUser', 'isLoggedIn']),
    // 分页后的文章列表
    paginatedArticles() {
      const start = (this.articlesCurrentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.userArticles.slice(start, end);
    },
    // 分页后的收藏列表
    paginatedFavorites() {
      const start = (this.favoritesCurrentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.favorites.slice(start, end);
    },
    // 分页后的浏览记录列表
    paginatedViewedArticles() {
      const start = (this.viewedArticlesCurrentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.viewedArticles.slice(start, end);
    }
  },
  created() {
    // 从store获取用户信息
    this.user = this.getUser;
    
    // 如果store中没有完整的用户信息，则从服务器获取
    if (this.isLoggedIn && (!this.user || !this.user._id)) {
      axios.get('/api/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(response => {
        const userDetails = response.data;
        // 更新store中的用户信息
        this.$store.dispatch('updateUser', { 
          token: localStorage.getItem('token'), 
          details: userDetails 
        });
        this.user = userDetails;
        // 初始化用户数据
        this.initializeUserData();
      }).catch(error => {
        console.error('获取用户信息失败:', error);
        this.$message.error('获取用户信息失败');
      });
    } else {
      // 如果已有完整用户信息，直接初始化数据
      this.initializeUserData();
    }
  },

  async mounted() {
    // 如果已经有用户信息
    if (this.isLoggedIn && this.user && this.user._id) {
      // 这里我们按序加载各种数据
      await this.loadUserArticles(); // 加载用户文章
      await this.loadTotalViews(); // 加载总浏览量
      await this.loadViewedArticles(); // 加载浏览记录
      await this.loadFavorites(); // 加载收藏
      await this.fetchUserStats(); // 加载用户统计信息
      this.fetchCategories(); // 获取分类列表
    }
  },


  methods: {
    // 初始化用户数据
    async initializeUserData() {
      if (!this.user || !this.user._id) {
        console.error('用户信息不完整');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // 获取用户文章
      try {
        const response = await axios.get(`/api/users/${this.user._id}/articles`);
        this.userArticles = response.data;
        // 计算总浏览量
        this.totalViews = this.userArticles.reduce((total, article) => total + (article.viewCount || 0), 0);
      } catch (error) {
        console.error('获取用户文章失败:', error);
        this.$message.error('获取用户文章失败');
      }

      // 获取用户收藏
      try {
        const response = await axios.get(`/api/favorites/${this.user._id}`, { headers });
        this.favorites = response.data;
      } catch (error) {
        console.error('获取收藏失败:', error);
        this.$message.error('获取收藏失败');
      }

      // 获取浏览记录
      try {
        const response = await axios.get('/api/user/viewed-articles', { headers });
        this.viewedArticles = response.data;
      } catch (error) {
        console.error('获取浏览记录失败:', error);
        this.$message.error('获取浏览记录失败');
      }
      
      // 获取用户关注信息
      await this.fetchUserStats();
    },

    // 加载用户发布的文章
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
    async fetchCategories() {
      try {
        const response = await axios.get("/api/categories");
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        this.$message.error('获取分类列表失败');
      }
    },
    getCategoryIcon(categoryName) {
      const iconMap = {
        '技术': 'el-icon-cpu',
        '生活': 'el-icon-coffee-cup',
        '笔记': 'el-icon-notebook-2',
        '分享': 'el-icon-share',
        '其他': 'el-icon-folder'
      };
      return iconMap[categoryName] || 'el-icon-folder';
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
        const favorite = this.favorites.find(f => f._id === this.favoriteToRemove);
        
        // 检查是否找到收藏记录
        if (!favorite) {
          throw new Error('未找到收藏记录');
        }
        
        // 处理无效收藏记录的情况（articleId为null）
        if (!favorite.articleId) {
          // 直接删除无效收藏记录
          await axios.delete('/api/favorites', {
            data: { favoriteId: favorite._id }
          });
          
          this.$notify({
            title: '收藏',
            message: '已删除无效收藏记录',
            type: 'warning'
          });
          this.unfavoriteDialogVisible = false;
          // 重新加载收藏列表
          this.loadFavorites();
          return;
        }
        
        // 正常收藏记录的处理
        const articleId = favorite.articleId._id;

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
      if (!this.isLoggedIn || !this.user || !this.user._id) {
        console.log('用户未登录或用户信息不完整，无法加载收藏');
        return;
      }
      
      try {
        console.log('正在加载用户收藏，用户ID:', this.user._id);
        const response = await axios.get(`/api/favorites/${this.user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        this.favorites = response.data;
        console.log('获取到的收藏列表:', this.favorites);
        
        // 如果没有数据，直接返回
        if (!Array.isArray(this.favorites)) {
          console.error("返回的收藏数据不是数组", this.favorites);
          return;
        }
      } catch (error) {
        console.error('加载收藏失败:', error.response || error);
        this.$message.error('加载收藏列表失败');
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

    // 计算阅读进度
    calculateProgress(scrollPosition, maxScrollPosition) {
      if (!maxScrollPosition) return 0;
      const progress = (scrollPosition / maxScrollPosition) * 100;
      return Math.min(Math.round(progress), 100);
    },

    // 打开创作文章弹窗
    openCreateArticleDialog() {
      this.createArticleDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.articleForm?.resetFields();
        this.fetchCategories(); // 获取分类列表
      });
    },

    handleExceed(files, fileList) {
      this.$message.warning('只能上传一张封面图片');
    },

    handleFileUpload(file, fileList) {
      // 检查文件大小是否超过5MB
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.$notify({
          title: '上传失败',
          message: '图片大小不能超过5MB',
          type: 'error',
          duration: 3000
        });
        // 从文件列表中移除超大文件
        fileList.splice(fileList.indexOf(file), 1);
        return;
      }
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      this.articleForm.coverImage = file.raw;
      this.fileList = fileList;
    },

    // 处理编辑器内容变化
    onEditorChange() {
      this.$refs.articleForm?.validateField('content');
    },

    // 提交文章
    async submitArticle() {
      this.$refs.articleForm.validate(async (valid) => {
        if (!valid) return;
        
        try {
          this.submitting = true;
          const formData = new FormData();
          Object.keys(this.articleForm).forEach((key) => {
            formData.append(key, this.articleForm[key]);
          });
          formData.append('author', this.user._id);
          console.log(this.articleForm);
          const token = localStorage.getItem('token');
          const response = await axios.post('/api/articles', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });

          this.$notify({
            title: '成功',
            message: '文章发布成功',
            type: 'success'
          });
          // 重置表单数据
          this.articleForm = {
            title: "",
            BriefIntroduction: "",
            content: "",
            categories: "",
            coverImage: null
          };
          // 清空文件上传列表
          this.fileList = [];
          this.createArticleDialogVisible = false;
          this.loadUserArticles(); // 重新加载文章列表
        } catch (error) {
          let errorMessage = '文章发布失败';
          if (error.response && error.response.data) {
            errorMessage = error.response.data.message || error.response.data.msg || errorMessage;
          }
          this.$notify({
            title: '发布失败',
            message: errorMessage,
            type: 'error',
            duration: 3000
          });
          console.error('文章发布失败:', error.response || error);
        } finally {
          this.submitting = false;
        }
      });
    },

    // 打开修改昵称对话框
    openEditUsernameDialog() {
      this.usernameForm.newUsername = this.user.username;
      this.editUsernameDialogVisible = true;
    },

    // 提交新昵称
    submitUsername() {
      this.$refs.usernameForm.validate(async (valid) => {
        if (!valid) return;
        try {
          console.log(this.usernameForm.newUsername)
          const response = await axios.put(`/api/update-username/${this.user._id}`, {
            newUsername: this.usernameForm.newUsername
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          // 更新本地用户信息
          this.user.username = this.usernameForm.newUsername;
          this.$store.dispatch('updateUser', { details: { ...this.user } });
          
          this.$message.success('昵称修改成功');
          this.editUsernameDialogVisible = false;
        } catch (error) {
          this.$message.error(error.response?.data?.message || '修改昵称失败，请重试');
        }
      });
    },

    // 打开修改密码对话框
    openChangePasswordDialog() {
      this.changePasswordDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.passwordForm?.resetFields();
      });
    },

    // 提交新密码
    submitPassword() {
      this.$refs.passwordForm.validate(async (valid) => {
        if (!valid) return;
        try {
          await axios.put(`/api/update-password/${this.user._id}`, {
            currentPassword: this.passwordForm.currentPassword,
            newPassword: this.passwordForm.newPassword
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          this.$message.success('密码修改成功，请重新登录');
          this.changePasswordDialogVisible = false;
          
          // 清除登录状态并跳转到登录页
          localStorage.removeItem('token');
          this.$store.dispatch('updateUser', { token: null, details: null });
          this.$router.push('/login');
        } catch (error) {
          this.$message.error(error.response?.data?.message || '修改密码失败，请重试');
        }
      });
    },

    async fetchUserStats() {
      try {
        if (!this.user || !this.user._id) return;
        
        console.log('正在获取用户统计信息...', this.user._id);
        const response = await axios.get(`/api/user-stats/${this.user._id}`);
        const stats = response.data;
        
        this.followersCount = stats.followersCount || 0;
        this.followingCount = stats.followingCount || 0;
        
        console.log('用户统计信息', stats);
      } catch (error) {
        console.error('获取用户统计信息失败:', error.response || error);
        this.$message.error('获取用户统计信息失败');
      }
    },
    
    // 添加一个方法来刷新用户数据
    async refreshUserData() {
      if (!this.isLoggedIn) return;
      
      try {
        // 获取最新的用户信息
        const response = await axios.get('/api/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        const userDetails = response.data;
        // 更新store中的用户信息
        this.$store.dispatch('updateUser', { 
          token: localStorage.getItem('token'), 
          details: userDetails 
        });
        this.user = userDetails;
        
        // 刷新用户相关数据
        await this.loadUserArticles();
        await this.loadViewedArticles();
        await this.loadFavorites();
        await this.fetchUserStats();
        
      } catch (error) {
        console.error('刷新用户数据失败:', error);
        this.$message.error('刷新用户数据失败');
      }
    },
    
    // 修改navigateToUser方法以适应用户页面
    navigateToUser(userId) {
      if (userId === this.user._id) {
        // 如果是当前用户，刷新当前页面数据
        this.refreshUserData();
      } else {
        // 否则跳转到其他用户页面
        this.$router.push(`/user/${userId}`);
      }
    },

    async showFollowers() {
      console.log('显示关注者列表，当前关注者数量:', this.followersCount);
      
      if (this.followersCount === 0) {
        this.$message.info('暂无关注者');
        return;
      }
      
      this.followersDialogVisible = true;
      this.loadingFollowers = true;
      
      try {
        console.log('正在获取关注者列表，用户ID:', this.user._id);
        const response = await axios.get(`/api/follow/followers/${this.user._id}`);
        this.followersList = response.data;
        console.log('获取到的关注者列表:', this.followersList);
      } catch (error) {
        console.error('获取关注者列表失败:', error.response || error);
        this.$message.error('获取关注者列表失败');
      } finally {
        this.loadingFollowers = false;
      }
    },
    
    async showFollowing() {
      console.log('显示关注列表，当前关注数量:', this.followingCount);
      
      if (this.followingCount === 0) {
        this.$message.info('暂无关注');
        return;
      }
      
      this.followingDialogVisible = true;
      this.loadingFollowing = true;
      
      try {
        console.log('正在获取关注列表，用户ID:', this.user._id);
        const response = await axios.get(`/api/follow/following/${this.user._id}`);
        this.followingList = response.data;
        console.log('获取到的关注列表:', this.followingList);
      } catch (error) {
        console.error('获取关注列表失败:', error.response || error);
        this.$message.error('获取关注列表失败');
      } finally {
        this.loadingFollowing = false;
      }
    },

    // 文章页码变化处理函数
    handleArticlesPageChange(page) {
      this.articlesCurrentPage = page;
    },
    
    // 收藏页码变化处理函数
    handleFavoritesPageChange(page) {
      this.favoritesCurrentPage = page;
    },
    
    // 浏览记录页码变化处理函数
    handleViewedArticlesPageChange(page) {
      this.viewedArticlesCurrentPage = page;
    },
  },
  mounted() {
    this.loadFavorites();
    this.loadUserArticles();
    this.loadTotalViews(); // 加载总浏览量
    this.loadViewedArticles(); // 加载浏览记录
    this.fetchUserStats(); // 确保关注信息被加载
    this.fetchCategories(); // 获取分类列表
  }
};
</script>

<style scoped>
.user-page {
  padding: 30px 20px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.user-header {
  background: var(--background-color);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: 0 2px 10px var(--shadow-color);
  transition: transform 0.2s ease;
}

.user-header:hover {
  transform: translateY(-3px);
}

.user-banner {
  position: relative;
  height: 250px;
}

.user-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.user-banner:hover img {
  transform: scale(1.03);
}

.user-avatar {
  width: 120px;
  height: 120px;
  position: absolute;
  left: 50px;
  bottom: -60px;
  border-radius: 50%;
  border: 5px solid var(--border-color);
  overflow: hidden;
  background: var(--background-color);
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.user-avatar:hover {
  transform: scale(1.03);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  padding: 70px 50px 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.user-info .user-details {
  flex: 1;
}

.user-info h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 28px;
  font-weight: 600;
}

.user-info p {
  margin: 12px 0;
  color: var(--text-color-secondary);
  font-size: 16px;
}

.username-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username-container .el-button {
  padding: 0;
  font-size: 18px;
  color: var(--text-color);
  transition: transform 0.2s ease;
}

.username-container .el-button:hover {
  transform: scale(1.05);
  color: var(--button-color);
}

.change-password-btn {
  margin-top: 10px;
  color: var(--text-color);
  font-size: 14px;
  padding: 8px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.change-password-btn:hover {
  color: var(--button-color);
  border-color: var(--button-color);
  background-color: rgba(var(--button-color-rgb), 0.1);
}

.user-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
}

.user-sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.el-card__body{
  padding: 0 !important;
}
.statistics-card,
.menu-card {
  background: var(--background-color);
  border-radius: 16px;
  padding: 25px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 10px var(--shadow-color);
  transition: transform 0.2s ease;
}

.statistics-card:hover,
.menu-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.statistics-card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 30px 25px;
}

.stat-item {
  text-align: center;
  transition: transform 0.3s ease;
  margin: 0 10px;
  flex: 0 0 40%;
  margin-bottom: 15px;
}

.stat-item.clickable {
  cursor: pointer;
}

.stat-item.clickable:hover {
  transform: translateY(-3px);
  color: var(--button-color);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 8px;
}

.stat-label {
  color: var(--text-color-secondary);
  font-size: 15px;
}

.articles-list,
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 5px;
}

.article-item {
  background: var(--card-background);
  border-radius: 12px;
  overflow: visible;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  box-shadow: 0 3px 10px var(--shadow-color);
  margin-bottom: 15px
}

.article-item:hover {
  transform: translateY(-2px) translateX(2px);
  border-color: var(--button-color);
  box-shadow: 0 3px 10px var(--shadow-color);
}

.article-content {
  display: flex;
  gap: 15px;
  padding: 15px;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.article-content img {
  width: 140px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.article-content:hover img {
  transform: scale(1.03);
}

/* 自定义对话框样式 */
.custom-dialog {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-color-strong);
}

.custom-dialog .el-dialog__header {
  padding: 20px 25px;
  background: var(--background-color);
  margin: 0;
}

.custom-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.custom-dialog .el-dialog__body {
  padding: 25px;
}

.custom-dialog .el-dialog__footer {
  padding: 15px 25px;
  border-top: 1px solid #ebeef5;
  background: var(--background-color);
}

.custom-form .el-form-item__label {
  padding-bottom: 8px;
  font-weight: 500;
  color: var(--text-color);
}

.custom-form .el-input__inner {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.custom-form .el-input__inner:hover,
.custom-form .el-input__inner:focus {
  border-color: var(--button-color);
  box-shadow: 0 0 0 2px var(--shadow-color);
}

.custom-form .el-form-item__error {
  padding-top: 5px;
  font-size: 13px;
}

/* 创作按钮样式 */
.create-article-btn {
  margin-top: 20px;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.create-article-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px var(--shadow-color);
}

/* 创作文章弹窗样式 */
.create-article-dialog {
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.create-article-dialog .el-dialog__body {
  padding: 30px;
}

.create-article-dialog .el-form {
  background: var(--background-color);
  border-radius: 12px;
}

.create-article-dialog .el-form-item {
  margin-bottom: 32px;
  transition: all 0.3s ease;
}

.create-article-dialog .el-form-item:hover {
  transform: translateX(5px);
}

.create-article-dialog .el-form-item__label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 16px;
  margin-bottom: 8px;
}

.create-article-dialog .el-input__inner,
.create-article-dialog .el-textarea__inner {
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 15px;
  transition: all 0.3s ease;
  color: var(--text-color);
}

.create-article-dialog .el-input__inner:hover,
.create-article-dialog .el-textarea__inner:hover {
  border-color: var(--button-color);
}

.create-article-dialog .el-input__inner:focus,
.create-article-dialog .el-textarea__inner:focus {
  border-color: var(--active-background-color);
  box-shadow: 0 0 0 3px var(--shadow-color);
  transform: translateY(-1px);
}

.cover-uploader {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  background-color: var(--card-background);
}

.cover-uploader:hover {
  border-color: var(--button-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.cover-uploader-icon {
  font-size: 28px;
  color: var(--text-color);
  width: 100%;
  height: 100%;
  line-height: 120px;
  text-align: center;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.editor-container {
  border: 2px solid var(--border-color);
  /* border-radius: 12px; */
  overflow: hidden;
  transition: all 0.3s ease;
}

.editor-container:hover {
  border-color: var(--button-color);
  transform: translateY(-2px);
}

/* 响应式布局优化 */
@media (max-width: 768px) {
  .create-article-dialog .el-dialog__body {
    padding: 20px;
  }

  .create-article-dialog .el-form-item {
    margin-bottom: 24px;
  }

  .create-article-dialog .el-form-item__label {
    font-size: 15px;
  }

  .editor-container {
    /* height: 350px; */
  }
}

@media (max-width: 576px) {
  .create-article-dialog .el-dialog__body {
    padding: 15px;
  }

  .create-article-dialog .el-form-item__label {
    float: none;
    display: block;
    text-align: left;
    padding: 0 0 8px;
    line-height: 1.5;
  }

  .create-article-dialog .el-form-item__content {
    margin-left: 0 !important;
  }

  .cover-uploader {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }

  .editor-container {
    /* height: 300px; */
  }

  .create-article-dialog .el-form-item:hover {
    transform: none;
  }
}

.editor-container .ql-editor {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.dialog-footer .el-button {
  padding: 9px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.dialog-footer .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px var(--shadow-color);
}


.article-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  word-wrap: break-word;
}

/* 调整文章标题样式 */
.article-info h4 {
  /* 限制行数（2行） */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;

  /* 标题字体优化 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-color);
  margin: 0 0 12px;
}

.article-info p {
  margin: 0 0 12px;
  color: #666;
  font-size: 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 100%;
  flex-shrink: 1;
}

/* 特殊处理.article-info-title类 */
.article-info-title {
  gap: 10px;
  width: 100%;
  overflow: hidden;
}

.article-info-title h4 {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #999;
  font-size: 14px;
  flex-wrap: wrap;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 20px;
  transition: color 0.3s ease;
}

.article-meta span:hover {
  color: var(--button-color);
}

.article-meta i {
  font-size: 18px;
}

.article-meta .el-button {
  margin-left: auto;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.article-meta .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}

.invalid-favorite {
  opacity: 0.7;
  background: rgba(0, 0, 0, 0.02);
}

.recent-view-card {
  background: var(--background-color);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  max-width: 100%;
  overflow: hidden;
}

.recent-view-content {
  padding: 20px;
}

.reading-progress {
  flex: 1;
  margin: 0 10px;
  min-width: 150px;
}

.custom-progress {
  margin: 0;
}

.view-time {
  font-size: 13px;
  color: #999;
  white-space: nowrap;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .user-content {
    grid-template-columns: 280px 1fr;
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .user-page {
    padding: 20px 15px;
  }

  .user-content {
    grid-template-columns: 1fr;
    width: 100%;
    max-width: 100%;
    margin: 0;
  }

  .user-sidebar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    width: 100%;
    padding: 0;
  }
}

@media (max-width: 768px) {
  .user-page {
    padding: 15px 10px;
  }

  .user-content {
    padding: 0;
  }

  .user-sidebar {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .article-content {
    justify-content: space-between;
    padding: 12px;
    gap: 12px;
  }

  .article-meta {
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-start;
  }

  .article-meta span {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .view-time {
    flex: 0 0 auto;
    margin-left: auto;
    text-align: right;
    max-width: 120px;
  }

  .statistics-card,
  .menu-card {
    padding: 15px;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
  }
}

@media (max-width: 576px) {
  .user-page {
    padding: 10px 5px;
  }

  .user-content {
    padding: 0;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .user-sidebar {
    padding: 0 5px;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .user-banner {
    height: 150px;
  }

  .user-avatar {
    width: 80px;
    height: 80px;
    bottom: -40px;
    left: 18px;
  }

  .user-info {
    padding: 23px 15px 20px;
  }

  .user-info h2 {
    font-size: 20px;
  }

  .user-info p {
    font-size: 14px;
    margin: 8px 0;
  }

  .statistics-card {
    padding: 15px 10px;
  }

  .stat-value {
    font-size: 22px;
  }

  .article-content {
    padding: 10px;
  }

  .article-item {
    margin-bottom: 10px;
  }

  .article-content img {
    width: 100%;
    height: 100px;
  }

  .article-info h4 {
    font-size: 15px;
    margin-bottom: 8px;
  }

  .article-info p {
    font-size: 13px;
    margin-bottom: 8px;
  }

  .article-meta {
    font-size: 12px;
    gap: 8px;
  }

  .article-meta .el-button {
    padding: 6px 12px;
    font-size: 12px;
  }

  .view-time {
    font-size: 11px;
    margin-left: 0;
  }
}

/* 关注列表样式 */
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
  background-color: rgba(var(--button-color-rgb), 0.1);
  transform: translateY(-2px);
}

.user-list-item .user-avatar.small {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  border: none;
  position: static;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-list-item .user-avatar.small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-list-item .user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  justify-content: center;
  align-items: flex-start;
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.recent-view-content .pagination-container {
  background-color: var(--background-color);
  border-radius: 8px;
  padding: 15px 0;
  margin-top: 15px;
}
</style>
