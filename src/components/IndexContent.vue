<template>
  <div class="upload-article-container">
    <!-- 输入其他信息 -->

    <h4>标题名称:</h4>
    <input v-model="title" placeholder="标题" class="input-field" />
    <h4>作者名称:</h4>
    <input v-model="author" placeholder="作者" class="input-field" />
    <h4>文章内容:</h4>
    <!-- Quill 编辑器用于输入文章内容 -->
    <quill-editor v-model="content" :options="editorOptions" class="quill-editor"></quill-editor>


    <!-- 选择分类 -->
    <!-- <label for="categories" class="label">选择分类：</label> -->
    <h4>选择分类：</h4>
    <select id="categories" v-model="selectedCategories" multiple class="select-field">
      <option v-for="category in categories" :key="category._id" :value="category._id">
        {{ category.name }}
      </option>
    </select>





    
    <!-- 上传封面图片 -->
    <h4>上传封面图片：</h4>
    <div class="container">
      <div class="folder">
        <div class="top"></div>
        <div class="bottom"></div>
      </div>
      <label class="custom-file-upload">
        <input @change="handleFileUpload" class=" title" type="file" />
        上传封面
      </label>
    </div>

    <!-- 按钮触发数据保存 -->
    <button @click="saveContent" class="save-button">保存内容</button>

    <!-- 显示错误和成功消息 -->
    <div v-if="message" :class="{ success: successMessage, error: errorMessage }" class="message">{{ message }}</div>
  </div>
</template>

<style scoped>
.upload-article-container {
  /* width: 75%; */
  padding: 30px 25px 30px 25px;
  margin: 0 auto;
  /* padding: 20px; */
  background-color: #ffffff;
  border-radius: 12px;
  /* 添加圆角 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  /* 添加阴影 */
}

.upload-article-container h4 {
  margin: 10px 0 20px 0;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-weight: 600;
}

.quill-editor {

  border-radius: 12px;
  /* 编辑器圆角 */
  border: 1px solid #e0e0e0;
  /* 编辑器边框 */
  margin-bottom: 20px;
  /* 编辑器与其他元素间距 */
}

.input-field,
.select-field,
.file-input {
  width: 100%;
  /* 让输入框占满宽度 */
  padding: 10px;
  /* 输入框内边距 */
  /* margin: 10px 10px; */
  /* 上下间距 */
  border: 1px solid #e0e0e0;
  /* 边框 */
  border-radius: 8px;
  /* 圆角 */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  /* 内阴影 */
  font-size: 16px;
  /* 字体大小 */
}

.label {
  font-weight: bold;
  /* 标签加粗 */
  margin-top: 20px;
  /* 上边距 */
}

.save-button {
  display: block;
  margin: 20px auto;

  background-color: #007bff;
  /* 按钮背景色 */
  color: #ffffff;
  /* 按钮文字颜色 */
  padding: 10px 20px;
  /* 按钮内边距 */
  border: none;
  /* 无边框 */
  border-radius: 8px;
  /* 圆角 */
  cursor: pointer;
  /* 鼠标光标为手型 */
  transition: background-color 0.3s;
  /* 过渡效果 */
}

.save-button:hover {
  background-color: #0056b3;
  /* 鼠标悬停效果 */
}

.message {
  margin-top: 20px;
  /* 消息与其他元素间距 */
  padding: 10px;
  border-radius: 8px;
  /* 消息框圆角 */
}

.success {
  background-color: #d4edda;
  /* 成功消息背景色 */
  color: #155724;
  /* 成功消息文字颜色 */
}

.error {
  background-color: #f8d7da;
  /* 错误消息背景色 */
  color: #721c24;
  /* 错误消息文字颜色 */
}

/* From Uiverse.io by Ma7moud344 */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: linear-gradient(135deg, #6dd5ed, #2193b0);
  border-radius: 15px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.folder {
  position: relative;
  animation: float 2.5s infinite ease-in-out;
  transition: transform 0.3s ease;
}

.folder:hover {
  transform: scale(1.05);
}

.folder .top {
  background: linear-gradient(135deg, #ff9a56, #ff6f56);
  width: 80px;
  height: 20px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
}

.folder .bottom {
  background: linear-gradient(135deg, #ffe563, #ffc663);
  width: 120px;
  height: 80px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border-radius: 0 10px 10px 10px;
  position: relative;
  top: -10px;
}

.custom-file-upload {
  font-size: 1.1em;
  color: #ffffff;
  text-align: center;
  margin-top: 20px;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.3s ease;
  display: inline-block;
  width: 220px;
}

.custom-file-upload:hover {
  background: rgba(255, 255, 255, 0.4);
}

.custom-file-upload input[type="file"] {
  display: none;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0px);
  }
}
@media (max-width: 576px) {
   
  }
  
  /* 小屏幕（手机横屏） */
  @media (min-width: 577px) and (max-width: 768px) {}
  
  /* 中等屏幕（平板） */
  @media (min-width: 769px) and (max-width: 992px) {}
  
  /* 大屏幕（小笔记本） */
  @media (min-width: 993px) and (max-width: 1200px) {}
  
  /* 超大屏幕（台式机） */
  @media (min-width: 1201px) {}
</style>
<style>
.ql-container {
  min-height: 280px;
}
</style>




<script>
import axios from 'axios'; // 引入 axios 用于 HTTP 请求

export default {
  data() {
    return {
      content: "", // 文章正文
      title: "", // 文章标题
      author: "", // 作者名称
      coverImage: null, // 上传的封面图片
      selectedCategories: [], // 选择的分类
      categories: [], // 可用的分类
      editorOptions: {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["clean"],
            ['image'], // 添加图片按钮
          ],
        },
      },
      message: '', // 用于显示消息
      successMessage: false, // 成功消息标志
      errorMessage: false // 错误消息标志
    };
  },
  created() {
    this.fetchCategories(); // 获取分类列表
  },
  methods: {
    // 异步获取分类数据
    async fetchCategories() {
      try {
        // 发送get请求获取分类数据
        const response = await axios.get('/api/categories');
        console.log(response);
        // 将获取到的数据赋值给categories
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    // 处理文件上传
    handleFileUpload(event) {
      this.coverImage = event.target.files[0];
    },
    // 异步保存内容
    async saveContent() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('content', this.content);
        formData.append('author', this.author);
        console.log(this.selectedCategories[0]);
        formData.append('categories', JSON.stringify(this.selectedCategories));
        if (this.coverImage) {
          formData.append('coverImage', this.coverImage);
        }
        // 如果选择的分类无效，则提示错误信息
        if (this.selectedCategories[0] == "66ff97821dedb796709b6532") {
          this.$notify.error({
            title: '错误',
            message: '选择分类无效'
          });
        }
        const response = await axios.post('/api/articles', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success'
        });
        this.successMessage = true;
      } catch (error) {
        console.error('Error saving content:', error.response ? error.response.data : error.message);
        this.$notify.error({
          title: '错误',
          message: '上传失败'
        });
        this.errorMessage = true;
      }
    }

  }
};

</script>
