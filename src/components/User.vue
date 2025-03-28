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
          <el-button type="primary" class="create-article-btn" @click="openCreateArticleDialog">
            <i class="el-icon-edit"></i> 创作文章
          </el-button>
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
        <el-form-item label="文章分类" prop="category">
          <el-select v-model="articleForm.category" placeholder="请选择文章分类" style="width: 100%">
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
        <el-form-item label="文章简介" prop="briefIntroduction">
          <el-input
            type="textarea"
            v-model="articleForm.briefIntroduction"
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
        category: "", // 单个分类ID
        coverImage: null,
      },
      articleRules: {
        title: [{ required: true, message: "请输入标题名称", trigger: "blur" }],
        BriefIntroduction: [{ required: true, message: "请输入简介", trigger: "blur" }],
        category: [{ required: true, message: "请选择分类", trigger: "change" }],
        content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
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
      articleForm: {
        title: '',
        category: '',
        coverImage: '',
        briefIntroduction: '',
        content: ''
      },
      categories: [], // 分类数据
      articleRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        briefIntroduction: [
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
      }
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
    await this.loadUserArticles(); // 加载用户文章
    await this.loadViewedArticles(); // 加载浏览记录
    await this.$store.dispatch('VuexloadFavorites'); // 加载收藏
    this.favorites = this.$store.getters.getFavorites; // 从Vuex获取收藏数据
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

    // 加载用户浏览记录
    async loadViewedArticles() {
      try {
        const response = await axios.get('/api/user/viewed-articles', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.viewedArticles = response.data;
      } catch (error) {
        console.error('加载浏览记录失败:', error);
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
        this.$message.error("获取分类列表失败");
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
        
        // 移除检查收藏数据中是否有无效记录的代码和提示

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

    // 打开创作文章弹窗
    openCreateArticleDialog() {
      this.createArticleDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.articleForm?.resetFields();
        this.fetchCategories(); // 获取分类列表
      });
    },

    // 获取分类列表
    async fetchCategories() {
      try {
        const response = await axios.get("/api/categories");
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        this.$message.error('获取分类列表失败');
      }
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
            if (key === 'category') {
              formData.append('categories', this.articleForm[key]);
            } else {
              formData.append(key, this.articleForm[key]);
            }
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
    }
  },
  mounted() {
    this.loadFavorites();
    this.loadUserArticles();
    this.loadTotalViews(); // 加载总浏览量
    this.loadViewedArticles(); // 加载浏览记录
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
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: transform 0.3s ease;
}

.user-header:hover {
  transform: translateY(-5px);
}

.user-banner {
  position: relative;
  height: 250px;
}

.user-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.user-banner:hover img {
  transform: scale(1.05);
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
  box-shadow: 0 4px 15px var(--shadow-color);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.user-avatar:hover {
  transform: scale(1.05) rotate(5deg);
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
  /* margin-left: 50px; */
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
  transition: transform 0.3s ease;
}

.username-container .el-button:hover {
  transform: scale(1.1);
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
  box-shadow: 0 4px 15px var(--shadow-color);
  transition: transform 0.3s ease;
}

.statistics-card:hover,
.menu-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px var(--shadow-color);
}

.statistics-card {
  display: flex;
  justify-content: space-around;
  padding: 30px 25px;
}

.stat-item {
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
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
  box-shadow: 0 4px 6px var(--shadow-color);
  margin-bottom: 15px
}

.article-item:hover {
  transform: translateY(-3px) translateX(3px);
  border-color: var(--button-color);
  box-shadow: 0 4px 15px var(--shadow-color);
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
  transform: scale(1.05);
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
  transition: all 0.3s ease;
}

.create-article-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

/* 创作文章弹窗样式 */
.create-article-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.create-article-dialog .el-dialog__body {
  padding: 30px;
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-uploader:hover {
  border-color: var(--button-color);
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  line-height: 120px;
  text-align: center;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.editor-container {
  border: 1px solid #DCDFE6;
  border-radius: 4px;
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

/* .article-info h4 {
  margin: 0 0 10px;
  color: var(--text-color);
  font-size: 18px;
  line-height: 1.4;
  font-weight: 600;
  
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  flex-shrink: 1;
} */
.article-info h4 {
  /* 限制行数（2行） */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;

  /* 标题字体优化 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; /* 现代字体栈 */
  font-size: 20px;               /* 适当增大字号 */
  font-weight: 700;              /* 加粗，标题更醒目 */
  line-height: 1.3;              /* 合适的行高，避免拥挤 */
  color: #222;                   /* 深色更易读 */
  margin: 0 0 12px;              /* 调整外边距，增加标题与内容的间距 */
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

.article-info-title {
  gap: 10px;
  width: 100%;
  overflow: hidden;
}

.article-info-title h4 {
  width: 100%;
  /* white-space: nowrap; */
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
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
    padding: 50px 15px 20px;
  }

  .user-info h2 {
    font-size: 20px;
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
</style>
