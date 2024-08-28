<template>
    <div class="articleBox" ref="articleBox">
        <!-- 顶部返回按钮和标题 -->
        <div class="header">
            <button @click="goBack" class="back-button">←</button>
            <span class="separator">/</span>
            <span class="title">{{ article?.title }}</span>
        </div>

        <div class="articleText" v-if="article">
            <div class="articleImgTle">
                <div class="img-container">
                    <img :src="getRandomImage()" alt="Random Image" class="article-image" />
                    <div class="overlay">
                        <span class="title">{{ article?.title }}</span>
                        <p class="article-author"><strong>作者 : </strong> {{ article.author }}</p>
                    </div>
                </div>
            </div>

            <div class="articleContent">
                <div class="articletextS" v-html="article.content"></div>
            </div>
        </div>


        <div v-else>
            <p>Loading...</p>
        </div>

        <!-- 评论区域 -->
        <section class="comment-section">
            <h2>评论</h2>
            <div class="comment-input">
                <textarea v-model="newComment" placeholder="写下你的评论..."></textarea>
                <button @click="submitComment">提交评论</button>
            </div>
            <div class="comments-list">
                <h3>最新评论</h3>
                <div v-for="comment in comments" :key="comment._id" class="comment">
                    <p>{{ comment.content }}</p>
                    <small v-if="comment.author && comment.createdAt">
                        by {{ comment.author.username }} · {{ new Date(comment.createdAt).toLocaleString() }}
                    </small>
                    <small v-else>
                        Unknown author · Unknown date
                    </small>

                    <!-- 回复列表 -->
                    <div class="replies" v-if="comment.replies && comment.replies.length">
                        <div v-for="reply in comment.replies" :key="reply._id" class="reply">
                            <p>{{ reply.content }}</p>
                            <small v-if="reply.author && reply.createdAt">
                                by {{ reply.author.username }} · {{ new Date(reply.createdAt).toLocaleString() }}
                            </small>
                            <small v-else>
                                Unknown author · Unknown date
                            </small>
                        </div>
                    </div>

                    <!-- 回复按钮 -->
                    <button @click="replyToComment(comment._id)">回复</button>

                    <!-- 回复表单 -->
                    <div v-if="replyingTo === comment._id" class="reply-form">
                        <textarea v-model="replyContent" placeholder="输入回复内容..."></textarea>
                        <button @click="submitReply(comment._id)">提交回复</button>
                        <button @click="cancelReply">取消</button>
                    </div>
                </div>
            </div>
        </section>


    </div>
</template>

<script>
// Article.vue
import axios from 'axios';

export default {
    data() {
        return {
            newComment: '', // 新评论内容
            comments: [],   // 评论列表
            article: null,
            replyingTo: null, // 当前正在回复的评论 ID
            replyContent: '', // 回复的内容
            progressBarWidth: 0, // 进度条的宽度
            acid: "",
            images: [
                { src: require("../assets/1.jpg") },
                { src: require("../assets/2.jpg") },
            ],
        };
    },

    created() {
        const articleId = this.$route.params.id; // 获取当前文章 ID
        this.acid = articleId;
        this.fetchComments(articleId); // 获取评论
        this.fetchArticleData();
    },

    mounted() {


        // 从服务器获取上次的浏览记录
        this.getLastViewedArticle().then(savedScrollPosition => {
            // 确保 articleBox 元素已经渲染完成
            setTimeout(() => {
                if (savedScrollPosition !== null) {
                    window.scrollTo({
                        top: savedScrollPosition,
                        behavior: 'smooth'
                    });

                }
            }, 100);  // 增加 100ms 延迟
        });

        // 监听窗口的滚动事件
        window.addEventListener('scroll', this.handleScroll);
    },


    beforeDestroy() {
        const articleBox = this.$refs.articleBox;

        // 移除滚动事件监听
        if (articleBox) {
            articleBox.removeEventListener('scroll', this.handleScroll);
        }

        // 保存当前滚动位置到服务器
        this.saveScrollPosition();

        // 移除窗口大小变化监听
        window.removeEventListener('resize', this.handleResize);
    },

    methods: {
        async getLastViewedArticle() {
            try {
                // 向服务器发送请求，获取用户上次浏览的文章信息
                const response = await axios.get(`http://localhost:5000/api/user/last-viewed/${this.acid}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                // console.log("获取到了", response.data);
                return response.data.scrollPosition;

            } catch (error) {
                console.error('Error retrieving last viewed article:', error);
                return null;
            }
        },


        async saveScrollPosition() {
            // 获取文章框
            const articleBox = this.$refs.articleBox;

            if (articleBox) {
                // 获取滚动位置
                const scrollPosition = window.scrollY;
                // 获取整个页面的最大滚动高度
                const maxScrollPosition = document.documentElement.scrollHeight - window.innerHeight;
                console.log(maxScrollPosition);
                // console.log(scrollPosition);
                try {
                    // 向服务器发送请求，保存文章滚动位置
                    await axios.post('http://localhost:5000/api/user/save-progress', {
                        articleId: this.acid,
                        scrollPosition: scrollPosition,
                        maxScrollPosition: maxScrollPosition // 添加这个值
                    }, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    console.log("发送成功了:", scrollPosition);
                } catch (error) {
                    console.error('Error saving scroll position:', error);
                }
            }
        },

        handleResize() {
            // 调整 articleBox 的高度为窗口的高度
            const articleBox = this.$refs.articleBox;
            articleBox.style.height = `${window.innerHeight}px`;
        },

        goBack() {
            this.$router.go(-1); // 使用 Vue Router 返回上一页
        },

        getRandomImage() {
            const randomIndex = Math.floor(Math.random() * this.images.length);
            return this.images[randomIndex].src;
        },

        async fetchArticleData() {
            try {
                const articleId = this.$route.params.id;
                const token = localStorage.getItem('token'); // 从 localStorage 获取 Token
                const response = await axios.get(`http://localhost:5000/api/articles/${articleId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                this.article = response.data;

            } catch (error) {
                console.error('Error fetching article data:', error);
            }
        },

        replyToComment(commentId) {
            this.replyingTo = commentId;
            this.replyContent = ''; // 清空回复内容
        },

        cancelReply() {
            this.replyingTo = null;
            this.replyContent = '';
        },

        async submitComment() {
            if (!this.newComment.trim()) {
                alert('评论内容不能为空');
                return;
            }

            try {
                const response = await axios.post('http://localhost:5000/api/comments', {
                    content: this.newComment,
                    articleId: this.acid,
                    author: this.user
                }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                this.newComment = '';
                this.comments.push(response.data.comment);
            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        },

        async submitReply(parentCommentId) {
            if (!this.replyContent.trim()) {
                alert('回复内容不能为空');
                return;
            }

            try {
                await axios.post('http://localhost:5000/api/comments/reply', {
                    content: this.replyContent,
                    articleId: this.article._id,
                    parentCommentId: parentCommentId
                }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                this.fetchComments(this.article._id);
                this.replyingTo = null;
                this.replyContent = '';
            } catch (error) {
                console.error('Error submitting reply:', error);
            }
        },

        async fetchComments(articleId) {
            try {
                const response = await axios.get(`http://localhost:5000/api/articles/${articleId}/comments`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                this.comments = response.data.comments;
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        },


    }
};
</script>

<style scoped>
.articleBox {
    /* overflow: auto;
    height: 100vh; */
    height: 100% !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    margin: auto;
    background-color: #f5f5f57d;
}

/* 整体滚动条 */
::-webkit-scrollbar {
    width: 10px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    background-color: #ffffff;
    border-radius: 6px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    background-color: #d6d6d6;
    border-radius: 6px;
    border: 2px solid #f1f1f1;
}

/* 滚动条滑块 - 悬停 */
::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

.header {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.back-button {
    border: none;
    background-color: #000000;
    color: white;
    padding: 10px 30px;
    /* 增加按钮的长度 */
    border-radius: 25px;
    /* 更圆的圆角 */
    cursor: pointer;
    font-size: 16px;
    margin-right: 10px;
    /* 按钮和分隔符之间的间距 */
}

.separator {
    margin: 0 10px;
    /* 分隔符的左右间距 */
    font-size: 18px;
    /* 分隔符的字体大小 */
}

.title {
    font-size: 24px;
    font-weight: bold;
}

.articleText {
    width: 100%;
    border-radius: 10px;
}

.articleImgTle {
    border-radius: 10px;
    position: relative;
}

.img-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    overflow: hidden;
    border-radius: 15px;
}

.article-image {
    width: 100%;
    height: auto;
    border-radius: 15px;
}

.overlay {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    color: black;
    width: calc(100% - 40px);
    padding: 20px;
    border-radius: 10px;
    box-sizing: border-box;
    color: white;
    gap: 20px;
    border-radius: 10px;
    backdrop-filter: blur(5px);
    background-color: rgba(255, 255, 255, 0.075);
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
}

.article-author {
    margin-top: 10px;
}

.articleContent {
    width: 100%;

    margin: 30px auto 0;

    background-color: #fff;
    border-radius: 10px;

}

.articleContent>>>p {
    color: #333333;
    /* 文本颜色 */
    font-family: 'Arial', sans-serif;
    /* 字体 */
    font-size: 16px;
    /* 字体大小 */
    line-height: 2;
    /* 行间距 */
    text-indent: 40px;
    /* 首行缩进 */

    /* 背景颜色 */
    padding: 20px;
    /* 内边距 */
    margin-bottom: 20px;

    /* 下边距 */
}


.articletextS {
    padding-top: 20px;
    padding-bottom: 30px;
    text-indent: 2em;
}

/*评论 */
.comment-section {
    padding: 20px;
    border-top: 1px solid #ddd;
}

.comment-input {
    margin-bottom: 20px;
}

.comment-input textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.comment-input button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.comment-input button:hover {
    background-color: #0056b3;
}

.comments-list {
    margin-top: 20px;
}

.comment {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.comment p {
    margin: 0;
}

.comment small {
    color: #888;
}



@media (min-width: 1200px) {
    .articleBox {
        width: 1100px;
    }
}

@media (max-width: 690px) {
    .articleBox {
        width: 100%;
        padding: 20px;
    }

    .title {
        font-size: 20px;
    }
}
</style>
<style>
.articletextS img {
    width: 80%;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
