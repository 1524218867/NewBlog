<template>
  <div class="upload-article-container">
    <!-- 输入其他信息 -->

    <h6>标题名称</h6>
    <input v-model="title" placeholder="标题" class="input-field" />
    <h6>作者名称</h6>
    <input v-model="author" placeholder="作者" class="input-field" />
    <h6>文章内容</h6>
    <!-- Quill 编辑器用于输入文章内容 -->
    <quill-editor v-model="content" :options="editorOptions" class="quill-editor"></quill-editor>


    <!-- 选择分类 -->
    <!-- <label for="categories" class="label">选择分类：</label> -->
    <h6>选择分类</h6>
    <select id="categories" v-model="selectedCategories" multiple class="select-field categoriesBtn" >
      <option v-for="category in categories" :key="category._id" :value="category._id">
        {{ category.name }}
      </option>
    </select>
    <!-- 上传封面图片 -->
    <h6>上传封面图片</h6>
    <label class="custum-file-upload" for="file">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24">
          <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
          <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
          <g id="SVGRepo_iconCarrier">
            <path fill=""
              d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
              clip-rule="evenodd" fill-rule="evenodd"></path>
          </g>
        </svg>
      </div>
      <div class="text">
        <span>Click to upload image</span>
      </div>
      <input type="file" id="file">
    </label>

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

.upload-article-container h6 {
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
.categorieBtn{
  /* width: 50%; */
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
  width: 100%;
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

/* From Uiverse.io by Yaya12085 */
.custum-file-upload {
  margin: auto;
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: space-between;
  gap: 20px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border: 2px dashed #cacaca;
  background-color: rgba(255, 255, 255, 1);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0px 48px 35px -48px rgba(0, 0, 0, 0.1);
}

.custum-file-upload .icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.custum-file-upload .icon svg {
  height: 80px;
  fill: rgba(75, 85, 99, 1);
}

.custum-file-upload .text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.custum-file-upload .text span {
  font-weight: 400;
  color: rgba(75, 85, 99, 1);
}

.custum-file-upload input {
  display: none;
}

@media (max-width: 576px) {}

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
import { debounce } from 'lodash';
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
    saveContent: debounce(async function () {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('content', this.content);
        formData.append('author', this.author);
        console.log('第一个分类', this.selectedCategories[0]);
        formData.append('categories', JSON.stringify(this.selectedCategories));
        if (this.coverImage) {
          formData.append('coverImage', this.coverImage);
        }
        // 如果选择的分类无效，则提示错误信息
        if (this.selectedCategories[0] == "6735ae36ea4dab72f613edef") {
          this.$notify.error({
            title: '错误',
            message: '选择分类无效'
          });
          return;
        }
        // 打印内容
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
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


    }, 3000), // 设置 3 秒的去抖动间隔
  }
};

</script>
