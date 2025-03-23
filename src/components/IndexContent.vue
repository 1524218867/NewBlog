<template>
  <div class="upload-article-container">
    <el-form ref="uploadForm" :model="formData" :rules="rules" label-width="100px">
      <!-- 标题 -->
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <!-- 简介 -->
      <el-form-item label="简介" prop="BriefIntroduction">
        <el-input v-model="formData.BriefIntroduction" type="textarea" placeholder="请输入简介" rows="4"></el-input>
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
      <el-form-item>
        <el-button type="primary" @click="saveContent">保存内容</el-button>
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
  background: var(--background-color);
  border-radius: 12px;
  /* box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); */
}

.el-form {
  background: var(--background-color);
  padding: 30px;
  border-radius: 8px;
}

.el-form-item {
  margin-bottom: 25px;
}

.el-form-item__label {
  font-weight: 600;
  color: var(--text-color);
}

.el-input__inner,
.el-textarea__inner {
  background-color: var(--ActiveBgc);
  border: 1px solid var(--Border);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-input__inner:focus,
.el-textarea__inner:focus {
  border-color: var(--active-background-color);
  box-shadow: 0 0 0 2px rgba(25, 136, 250, 0.1);
}

.quill-editor {
  height: 400px;
  margin-bottom: 20px;
}

.ql-toolbar.ql-snow {
  border: 1px solid var(--Border);
  border-radius: 8px 8px 0 0;
  background: var(--ActiveBgc);
}

.ql-container.ql-snow {
  border: 1px solid var(--Border);
  border-radius: 0 0 8px 8px;
  background: var(--ActiveBgc);
  height: 350px;
}

.upload-demo {
  border: 2px dashed var(--Border);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}
.upload-demo a{
  line-height: 20px !important;
}
.upload-demo:hover {
  border-color: var(--active-background-color);
}

.el-button--primary {
  background: var(--active-background-color);
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 136, 250, 0.2);
}

/* 响应式布局优化 */
@media (max-width: 768px) {
  .upload-article-container {
    padding: 20px;
  }
  
  .el-form {
    padding: 20px;
  }
  
  .quill-editor {
    height: 300px;
  }
  
  .ql-container.ql-snow {
    height: 250px;
  }
  
  .el-form-item {
    margin-bottom: 40px;
  }
}

@media (max-width: 576px) {
  .upload-article-container {
    padding: 15px;
  }
  
  .el-form {
    padding: 15px;
  }
  
  .el-form-item__label {
    float: none;
    display: block;
    text-align: left;
    padding: 0 0 8px;
    line-height: 1.5;
  }
  
  .el-form-item__content {
    margin-left: 0 !important;
  }
  
  .el-select {
    width: 100% !important;
  }
  
  .quill-editor {
    height: 250px;
  }
  
  .ql-container.ql-snow {
    height: 200px;
  }
}
</style>