<template>
  <div class="upload-article-container">
    <el-form ref="uploadForm" :model="formData" :rules="rules" label-width="100px">
      <!-- 标题 -->
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题" ></el-input>
      </el-form-item>

      <!-- 简介 -->
      <el-form-item label="简介" prop="BriefIntroduction">
        <el-input v-model="formData.BriefIntroduction" type="textarea" placeholder="请输入简介" rows="4" ></el-input>
      </el-form-item>

      <!-- 文章内容 -->
      <el-form-item label="文章内容" prop="content">
        <quill-editor v-model="formData.content" :options="editorOptions" class="quill-editor"></quill-editor>
      </el-form-item>

      <!-- 分类 -->
      <el-form-item label="选择分类" prop="categories">
        <el-select v-model="formData.categories" placeholder="请选择分类" style="width: 100%" class="category-select" :multiple="false">
          <el-option v-for="category in categories" :key="category._id" :label="category.name" :value="category._id">
            <span class="category-option">
              <i :class="getCategoryIcon(category.name)"></i>
              <span class="category-name">{{ category.name }}</span>
              <span class="category-desc">{{ category.description }}</span>
            </span>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 上传封面图片 -->
      <el-form-item label="上传封面图片" prop="articleImage">
        <el-upload class="upload-demo" action="" :file-list="fileList" :on-change="handleFileUpload" :auto-upload="false" :limit="1" :on-exceed="handleExceed">
          <el-button>点击上传图片</el-button>
          <div slot="tip" class="el-upload__tip">只能上传一张封面图片</div>
        </el-upload>
      </el-form-item>

      <!-- 保存按钮 -->
      <el-form-item class="save-button">
        <el-button type="primary" @click="saveContent" >保存内容</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import { debounce } from "lodash";
import { Notification } from 'element-ui';
import { f } from "vue-cal";
import 'core-js/features/array';

export default {
  data() {
    return {
      formData: {
        title: "",
        BriefIntroduction: "",
        content: "",
        categories: "", // 改为单个分类ID
        coverImage: null,
      },
      rules: {
        title: [{ required: true, message: "请输入标题名称", trigger: "blur" }],
        BriefIntroduction: [{ required: true, message: "请输入简介", trigger: "blur" }],
        categories: [{ required: true, message: "请选择分类", trigger: "change" }],
        content: [{ required: true, message: "请输入文章内容", trigger: "blur" }],
      },
      categories: [], // 分类数据
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
    };
  },
  created() {
    this.fetchCategories(); // 获取分类列表
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get("/api/categories");
        // 使用后端返回的分类数据
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        // 如果获取失败，至少显示默认分类
        this.categories = defaultCategories;
      }
    },
    getCategoryIcon(categoryName) {
      const iconMap = {
        '技术': 'el-icon-cpu',
        '生活': 'el-icon-coffee-cup',
        '笔记': 'el-icon-notebook-2',
        '分享': 'el-icon-share',
        '其他': 'el-icon-more'
      };
      return iconMap[categoryName] || 'el-icon-folder';
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
      this.formData.coverImage = file.raw;
      this.fileList = fileList;
    },
    saveContent() {
      this.$refs.uploadForm.validate(async (valid) => {

        if (!valid) {

          return;
        }


        const formData = new FormData();
        Object.keys(this.formData).forEach((key) => {
          formData.append(key, this.formData[key]);
        });


        // 打印 formData 内容
        for (let pair of formData.entries()) {

        }
        try {
          const token = localStorage.getItem("token");
          const response = await axios.post("/api/articles", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          Notification.success({
            title: '成功',
            message: '文章保存成功',
          });

        } catch (error) {
          let errorMessage = '文章保存失败';
          if (error.response && error.response.data) {
            errorMessage = error.response.data.message || error.response.data.msg || errorMessage;
          }
          Notification.error({
            title: '保存失败',
            message: errorMessage,
            duration: 3000
          });
          console.error("文章保存失败:", error.response || error);
        }
      });
    },
  },
};
</script>

<style>
.upload-article-container {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 10px;
  background: var(--background-color);
  border-radius: 16px;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: transform 0.3s ease;
}

.upload-article-container:hover {
  transform: translateY(-2px);
}

.el-form {
  background: var(--background-color);
  /* padding: 40px; */
  border-radius: 12px;
}

.el-form-item {
  margin-bottom: 32px;
  transition: all 0.3s ease;
}

.el-form-item:hover {
  transform: translateX(5px);
}

.el-form-item__label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 16px;
  margin-bottom: 8px;
}
.el-textarea__inner{
  color: var(--text-color)!important;
}
.el-input__inner,
.el-textarea__inner {
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.el-input__inner:hover,
.el-textarea__inner:hover {
  border-color: var(--button-color);
}

.el-input__inner:focus,
.el-textarea__inner:focus {
  border-color: var(--active-background-color);
  box-shadow: 0 0 0 3px var(--shadow-color);
  transform: translateY(-1px);
}

.quill-editor {
  height: 450px;
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  /* box-shadow: 0 2px 12px var(--shadow-color); */
  border: 2px solid var(--border-color);
  background-color: var(--card-background);
  color: var(--text-color);
}
.quill-editor:hover{
  border-color: var(--button-color);
  
}
.el-input__inner{
  color: var(--text-color) !important;
}
.ql-toolbar.ql-snow {
  border: 2px solid var(--Border);
  border-radius: 12px 12px 0 0;
  background: var(--ActiveBgc);
  padding: 12px;
}

.ql-container.ql-snow {
  border: 2px solid var(--Border);
  border-top: none;
  border-radius: 0 0 12px 12px;
  background: var(--ActiveBgc);
  height: 400px;
}
.el-select .el-input__inner:hover{
  border-color: var(--button-color) !important;
}
.category-select {
  width: 100%;
}

.category-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.category-name {
  font-weight: 500;
}

.category-desc {
  color: #999;
  font-size: 13px;
  margin-left: 8px;
}

.upload-demo {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  background: var(--ActiveBgc);
}

.upload-demo:hover {
  border-color: var(--button-color);
  background: rgba(25, 136, 250, 0.05);
}

.upload-demo a {
  line-height: 24px !important;
  color: var(--text-color);
}

.el-upload__tip {
  margin-top: 12px;
  color: #999;
}

.el-button--primary {
  /* background: var(--active-background-color); */
  border: none;
  padding: 14px 36px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--shadow-color-strong);
}

.el-button--primary:active {
  transform: translateY(0);
}
.save-button{
display: flex;
justify-content: center;
}
/* 响应式布局优化 */
@media (max-width: 992px) {
  .upload-article-container {
    max-width: 95%;
    /* padding: 30px; */
  }
  
  .el-form {
    /* padding: 30px; */
  }
}

@media (max-width: 768px) {
  .upload-article-container {
    /* padding: 25px; */
    margin: 15px auto;
  }
  
  .el-form {
    /* padding: 25px; */
  }
  
  .quill-editor {
    height: 350px;
  }
  
  .ql-container.ql-snow {
    height: 300px;
  }
  
  .el-form-item {
    margin-bottom: 28px;
  }
  
  .el-button--primary {
    /* width: 33%; */
    padding: 12px;
  }
}

@media (max-width: 576px) {
  .upload-article-container {
    /* padding: 20px; */
    margin: 10px auto;
  }
  
  .el-form {
    /* padding: 20px; */
  }
  
  .el-form-item__label {
    float: none;
    display: block;
    text-align: left;
    padding: 0 0 8px;
    line-height: 1.5;
    font-size: 15px;
  }
  
  .el-form-item__content {
    margin-left: 0 !important;
  }
  
  .el-select {
    width: 100% !important;
  }
  
  .quill-editor {
    height: 300px;
  }
  
  .ql-container.ql-snow {
    height: 250px;
  }
  
  .upload-demo {
    padding: 20px;
  }
  
  .el-form-item:hover {
    transform: none;
  }
}
</style>