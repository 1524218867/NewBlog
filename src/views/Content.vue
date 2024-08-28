<template>
  <div>
    <!-- Quill 编辑器用于输入文章内容 -->
    <quill-editor v-model="content" :options="editorOptions"></quill-editor>
    <!-- 输入其他信息 -->
    <input v-model="title" placeholder="标题" />
    <input v-model="author" placeholder="作者" />
    <!-- 选择分类 -->
    <label for="categories">选择分类：</label>
    <select id="categories" v-model="selectedCategories" multiple>
      <option v-for="category in categories" :key="category._id" :value="category._id">
        {{ category.name }}
      </option>
    </select>
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
    async fetchCategories() {
      try {
        // 发送get请求获取分类数据
        const response = await axios.get('http://localhost:5000/api/categories');
        console.log(response);
        // 将获取到的数据赋值给categories
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    handleFileUpload(event) {
      this.coverImage = event.target.files[0];
    },
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
        console.log(JSON.stringify(this.selectedCategories));
        formData.append('categories', JSON.stringify(this.selectedCategories));
        if (this.coverImage) {
          formData.append('coverImage', this.coverImage);
        }

        const response = await axios.post('http://localhost:5000/api/articles', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        this.message = 'Content saved successfully!';
        this.successMessage = true;
      } catch (error) {
        console.error('Error saving content:', error.response ? error.response.data : error.message);
        this.message = 'Failed to save content.';
        this.errorMessage = true;
      }
    }

  }
};

</script>

