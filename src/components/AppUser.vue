<template>
  <div class="profile-container">
    <!-- 个人信息块 -->

    <div class="profile-info">

      <!-- 头像 -->
      <div class="profile-avatar" @click="openDialog">
        <img :src="getImageUrl(user.avatar, 'UserImg')" alt="头像" />
      </div>
      <!-- 弹框 -->
      <el-dialog title="修改头像" :visible.sync="dialogVisible">
        <el-upload action="/api/update-avatar" :headers="headers" name="avatar" list-type="picture-card"
          :on-success="handleSuccess" :on-error="handleError">
          <i class="el-icon-plus"></i>
        </el-upload>
        <p>点击上传新的头像。</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
      </el-dialog>
      <!-- 用户名 -->
      <div class="username">
        <h3> <span>{{ user.username }}</span></h3>
      </div>
      <!-- 用户账号 -->
      <div class="user-account">
        <p><span>{{ user.email }}</span></p>
      </div>
      <button @click="LU_logout">登出</button>

    </div>

    <!-- 浏览记录 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>最近浏览</span>
      </div>
      <div class="profile-text item">
        <el-row>
          <el-col>
            <router-link :to="{
              name: 'Article',
              params: { id: lastViewedArticleZi.articleId },
            }">
              <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <img :src="getImageUrl(lastViewedArticleZi.coverImage, 'uploads')" class="image">
                <div style="padding: 30px;">
                  <span>{{ lastViewedArticleZi.title }}</span>
                  <span>{{ lastViewedArticleZi.author }}</span>
                </div>
              </el-card>
            </router-link>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 收藏 -->
    <el-card class="profile-box-card">
      <div slot="header" class="clearfix">
        <span>我的收藏</span>

      </div>
      <div class="profile-aeticleContent" v-for="actions in favorites" :key="actions.articleId._id">
        <router-link :to="{
          name: 'Article',
          params: { id: actions.articleId._id },
        }">
          <img :src="getImageUrl(actions.articleId.coverImage, 'uploads')" alt="封面图片" />
          <div>
            <p>{{ actions.articleId.title }}</p>
            <p>{{ actions.articleId.BriefIntroduction
              }}</p>

          </div>
        </router-link>
      </div>
    </el-card>

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
      // 浏览记录
      browsingHistory: ["文章1", "文章2", "文章3"],
      dialogVisible: false, // 控制弹框显示
      // 收藏
      favorites: [],
      isMobile: false// 判断是否为移动端
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
    this.user = this.getUser, // 获取用户信息
      this.checkDeviceType();
    window.addEventListener('resize', this.checkDeviceType);  // 监听窗口大小变化
  },
  destroyed() {
    window.removeEventListener('resize', this.checkDeviceType);
  },
  methods: {
    LU_logout() {
      this.$emit('call-parent')
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

      console.log('拼接后的请求路径是', imageUrl);
      return imageUrl;
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
    // 检查设备类型，判断是移动端还是PC端
    checkDeviceType() {
      const width = window.innerWidth;
      this.isMobile = width <= 768; // 判断设备是否为移动端

      // 如果是PC端，跳转到首页
      if (!this.isMobile) {
        this.$router.push('/Index/Home');
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

        console.log('在持久化中获取到用户的收藏记录', this.favorites);


      } catch (error) {
        console.error('加载收藏失败:', error)
      }
    },
  },
  mounted() {
    console.log(this.lastViewedArticleZi);

    this.loadFavorites();
  }
};
</script>

<style scoped>
/* 重置默认样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 页面整体样式 */
.profile-container {
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  /* margin: 20px auto; */
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
}

/* 个人信息块 */
.profile-info {
  /* background-color: #f0f0f0; */
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
  /* position: relative; */
}

/* From Uiverse.io by elijahgummer */
button {
  font: inherit;
  background-color: #f0f0f0;
  border: 0;
  color: #242424;
  border-radius: 0.5em;
  font-size: .8125rem;
  padding: 0.375em 1em;
  font-weight: 600;
  text-shadow: 0 0.0625em 0 #fff;
  box-shadow: inset 0 0.0625em 0 0 #f4f4f4, 0 0.0625em 0 0 #efefef,
    0 0.125em 0 0 #ececec, 0 0.25em 0 0 #e0e0e0, 0 0.3125em 0 0 #dedede,
    0 0.375em 0 0 #dcdcdc, 0 0.425em 0 0 #cacaca, 0 0.425em 0.5em 0 #cecece;
  transition: 0.15s ease;
  cursor: pointer;
}

button:active {
  translate: 0 0.225em;
  box-shadow: inset 0 0.03em 0 0 #f4f4f4, 0 0.03em 0 0 #efefef,
    0 0.0625em 0 0 #ececec, 0 0.125em 0 0 #e0e0e0, 0 0.125em 0 0 #dedede,
    0 0.2em 0 0 #dcdcdc, 0 0.225em 0 0 #cacaca, 0 0.225em 0.375em 0 #cecece;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #ddd;
  cursor: pointer;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username h3,
.user-account p {
  color: #333;
  font-size: 16px;
  margin-bottom: 5px;
}
.record-section,
.favorites-section {
  background-color: #f0f0f0;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 15px;
}

.record-section h4,
.favorites-section h4 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.record-section ul,
.favorites-section ul {
  list-style: none;
}

.record-section ul li,
.favorites-section ul li {
  font-size: 14px;
  color: #555;
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}

.record-section ul li:last-child,
.favorites-section ul li:last-child {
  border-bottom: none;
}

.box-card {
  margin-bottom: 20px;
}

.profile-box-card img {
  width: 100px;
  height: 100px;
}

.profile-text img {
  width: 100%;

}

.profile-aeticleContent>a {
  display: flex;
  margin-bottom: 20px;

}

.profile-aeticleContent div {
  padding: 0 10px;

}

.profile-aeticleContent div>p:nth-child(1) {
  color: var(--text-color);
  font-size: 1rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;
  height: 20px;
  line-height: 20px;
  margin-bottom: 10px;
}

.profile-aeticleContent div>p:nth-child(2) {
  color: var(--text-color);
  font-size: 13px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  height: 40px;
  line-height: 20px;
  color: gray;
}




.profile-aeticleContent img {
  border-radius: 10px;
}
</style>
