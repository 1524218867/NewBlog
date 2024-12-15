<template>
  <div class="upload-article-container">
    <el-form ref="uploadForm" :model="formData" :rules="rules" label-width="100px">
      <!-- 标题 -->
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <!-- 作者 -->
      <el-form-item label="作者名称" prop="author">
        <el-input v-model="formData.author" placeholder="请输入作者"></el-input>
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
        <el-select v-model="formData.categories" placeholder="请选择分类" style="width: 300px">
          <el-option v-for="category in categories" :key="category._id" :label="category.name"
            :value="category._id"></el-option>
        </el-select>
      </el-form-item>

      <!-- 上传封面图片 -->
      <el-form-item label="上传封面图片" prop="articleImage">
        <el-upload class="upload-demo" action="" :file-list="fileList" :on-change="handleFileUpload"
          :auto-upload="false">
          <el-button>点击上传图片</el-button>
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
        author: "",
        BriefIntroduction: "",
        content: "",
        categories: null,
        coverImage: null,
      },
      rules: {
        title: [{ required: true, message: "请输入标题名称", trigger: "blur" }],
        author: [{ required: true, message: "请输入作者名称", trigger: "blur" }],
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
        this.categories = response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    handleFileUpload(file, fileList) {
      this.formData.coverImage = file.raw;
      this.fileList = fileList;
    },
    saveContent() {
      this.$refs.uploadForm.validate(async (valid) => {
        if (!valid) {
          console.log("表单验证未通过");
          return;
        }
        console.log('这是表单数据', this.formData);

        const formData = new FormData();
        Object.keys(this.formData).forEach((key) => {
          formData.append(key, this.formData[key]);
        });


        // 打印 formData 内容
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
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
          console.log("文章保存成功", response.data);
        } catch (error) {
          Notification.error({
            title: '失败',
            message: '文章保存失败',
          });
          console.error("文章保存失败", error);
        }
      });
    },
  },
};
</script>

<style>
.el-input__inner {
  background-color: var(--ActiveBgc);
  border: 1px solid var(--Border);
}

.el-textarea__inner {
  background-color: var(--ActiveBgc);
  border: 1px solid var(--Border);
}

.ql-toolbar.ql-snow {
  border: 1px solid var(--Border);
}

.ql-container.ql-snow {
  border: 1px solid var(--Border);
}

/* 超小屏幕（手机竖屏） */
@media (max-width: 576px) {
  .el-upload-dragger {
    width: 100% !important;
  }

  .upload-article-container {
    padding: 20px;
  }
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