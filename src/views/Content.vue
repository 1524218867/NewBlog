<template>
  <div>
    <!-- Quill 编辑器用于输入文章内容 -->
    <quill-editor v-model="content" :options="editorOptions"></quill-editor>
    <!-- 输入其他信息 -->
    <input v-model="title" placeholder="标题" />
    <input v-model="author" placeholder="作者" />
    <!-- 上传封面图片 -->
    <input type="file" @change="handleFileUpload" />
    <!-- 按钮触发数据保存 -->
    <button @click="saveContent">保存内容</button>
    <!-- 显示错误和成功消息 -->
    <div v-if="message" :class="{ success: successMessage, error: errorMessage }">{{ message }}</div>
  </div>
</template>

<script>
import axios from 'axios'; // 引入 axios 用于 HTTP 请求

export default {
  data() {
    return {
      content: "", // 文章正文
      title: "", // 文章标题
      author: "", // 作者名称
      coverImage: null, // 上传的封面图片
      editorOptions: {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["clean"],
          ],
        },
      },
      message: '', // 用于显示消息
      successMessage: false, // 成功消息标志
      errorMessage: false // 错误消息标志
    };
  },
  methods: {
    handleFileUpload(event) {
      this.coverImage = event.target.files[0];
    },
    async saveContent() {
      try {
        // 清空之前的消息
        this.message = '';
        this.successMessage = false;
        this.errorMessage = false;

        // 获取 token
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('content', this.content);
        formData.append('author', this.author);
        if (this.coverImage) {
          formData.append('coverImage', this.coverImage);
        }

        // 发送 POST 请求到 Express 服务器
        const response = await axios.post('http://localhost:5000/api/articles', formData, {
          headers: {
            'Authorization': `Bearer ${token}`, // 添加认证 token
            'Content-Type': 'multipart/form-data' // 设置 Content-Type 为 multipart/form-data
          }
        });

        // 处理成功情况
        this.message = 'Content saved successfully!';
        this.successMessage = true;
      } catch (error) {
        console.error('Error details:', error); // 打印错误详细信息
        if (error.response && error.response.data && error.response.data.errors) {
          this.message = error.response.data.errors.map(err => err.msg).join(', ');
        } else {
          this.message = 'Failed to save content.';
        }
        this.errorMessage = true;
      }
    }
  }
};
</script>
