<template>
    <div class="articleBox" ref="articleBox">
        <!-- 顶部返回按钮和标题 -->
        <div class="header">
            <button @click="goBack" class="back-button"><i class="back-icon">←</i><span class="back-text">返回</span></button>
            <span class="separator">/</span>
            <span class="title">{{ article?.title }}</span>
        </div>

        <div class="articleText" v-if="article">
            <div class="articleImgTle">
                <div class="img-container">
                    <img :src="getRandomImage()" alt="Random Image" class="article-image" />
                    <div class="overlay">
                        <span class="title">{{ article?.title }}</span>
                        <p>{{ article.BriefIntroduction }}</p>
                        <p class="article-author"><strong>作者 : </strong> {{ article.authorName }}</p>
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
            <div class="comments-list" v-if="comments.length!==0">
                <h3>最新评论</h3>
                <div v-for="comment in comments" :key="comment._id" class="comment">
                    <p>{{ comment.content }}</p>

                    <div class="comment-info">
                        <small v-if="comment.author && comment.createdAt">
                            来自：<router-link :to="{ name: 'OtherUser', params: { id: comment.author._id }}" class="user-link">{{ comment.author.username }}</router-link> · {{ new Date(comment.createdAt).toLocaleString() }}
                            <button v-if="comment.author._id === $store.state.user.details._id" @click="deleteComment(comment._id)" class="delete-btn">删除</button>
                        </small>
                        <small v-else>
                            Unknown author · Unknown date
                        </small>
                    </div>

                    <!-- 回复列表 -->
                    <div class="replies" v-if="comment.replies && comment.replies.length">
                        <div v-for="reply in comment.replies" :key="reply._id" class="reply">
                            <p>{{ reply.content }}</p>
                            <small v-if="reply.author && reply.createdAt">
                                来自：<router-link :to="{ name: 'OtherUser', params: { id: reply.author._id }}" class="user-link">{{ reply.author.username }}</router-link> · {{ new Date(reply.createdAt).toLocaleString() }}
                                <button v-if="reply.author._id === $store.state.user.details._id" @click="deleteComment(reply._id)" class="delete-btn">删除</button>
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
                        <button @click="submitReply(comment._id)">提交</button>
                        <button @click="cancelReply">取消</button>
                    </div>
                </div>
            </div>
            <div v-else></div>
        </section>


    </div>
</template>

<script>
// Article.vue
import axios from 'axios';
import colors from 'vuetify/lib/util/colors';

export default {
    data() {
        return {
            newComment: '', // 新评论内容
            comments: [],   // 评论列表
            article: null,
            replyingTo: null, // 当前正在回复的评论 ID
            replyContent: '', // 回复的内容
            progressBarWidth: 0, // 进度条的宽度
            scrollPosition: 0,  // 用于存储实时滚动位置
            articleBoxHeight: 0, // 文章容器的高度
            acid: "",
            images: [
                { src: require("../assets/1.jpg") },
                { src: require("../assets/2.jpg") },
            ],
            themes: {
                light: {
                    '--primary-color': '#3498db',
                    '--secondary-background': "#f8f9ff",
                    '--active-background': '#f7f7f8',
                    '--background-color': '#ffffff',
                    '--border-color': ' #f0f1fb',
                    '--text-color': '#000000',//文本颜色
                    '--button-color': '#1988fa',//按钮颜色
                    '--card-background': ' #f5f5f5',//边框颜色
                    '--gradient-primary': 'linear-gradient(to right, #1988fa 0%, #33c4f9 50%, #00f2fe 100%)'
                },
                dark: {
                    '--primary-color': '#e74c3c',
                    '--active-background': '#1a1a1a',
                    '--secondary-background': "#1f1f1f",
                    '--background-color': '#000000',
                    '--border-color': ' #2c2c2c',
                    '--text-color': '#ecf0f1',//文本颜色
                    '--button-color': '#015aea',//按钮颜色
                    '--card-background': ' #212121',//边框颜色
                    '--gradient-primary': 'linear-gradient(to right, #012a63, #015aea, #4d9ef7)'
                }
            },
        };
    },

    created() {
        const articleId = this.$route.params.id; // 获取当前文章 ID
        this.acid = articleId;
        this.fetchComments(articleId); // 获取评论
        this.fetchArticleData();
    },

    mounted() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const token = localStorage.getItem('token');

        // 初始化用户身份验证状态
        if (token) {
            axios.get('/api/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(response => {
                this.$store.dispatch('updateUser', {
                    token: token,
                    details: response.data
                });
            }).catch(error => {
                console.error('Error fetching user data:', error);
            });
        }

        this.updateTheme(savedTheme);
        console.log('本地储存状态', savedTheme);

        this.$nextTick(() => {
            this.handleScroll(); // 初始化获取一次滚动值和高度
            window.addEventListener("scroll", this.handleScroll);
        });


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

    computed: {

    },
    beforeDestroy() {
        const articleBox = this.$refs.articleBox;

        // 移除滚动事件监听
        if (articleBox) {
            articleBox.removeEventListener('scroll', this.handleScroll);
        }

        // 保存当前滚动位置到服务器
        this.saveScrollPosition();
        console.log('退出成功');

        // 移除窗口大小变化监听
        window.removeEventListener('resize', this.handleResize);
    },

    methods: {
        goBack() {
            // 使用Vue Router的内置返回功能
            if (window.history.length > 1) {
                this.$router.go(-1);
            } else {
                // 如果没有历史记录，返回首页
                this.$router.push('/Index/Home');
            }
        },

        updateTheme(themeName) {
            console.log(themeName);

            // document.body.classList.toggle('dark-theme', themeName === 'dark');
            this.currentTheme = themeName;//这里的currentTheme是data里的，用来在html里显示当前主题，并不是子组件的
            // 根据传入的主题名称更新全局 CSS 变量  
            const theme = this.themes[themeName];
            for (const key in theme) {
                document.documentElement.style.setProperty(key, theme[key]);
            }
            // 保存到 localStorage 以保持刷新后的主题
            localStorage.setItem('theme', themeName);
        },
        handleScroll() {
            const articleBox = this.$refs.articleBox;
            if (articleBox) {
                this.scrollPosition = window.scrollY;
                this.articleBoxHeight = articleBox.clientHeight;
                // console.log("文章的高:", this.articleBoxHeight);
                // console.log("实时滚动位置:", this.scrollPosition);
            }
        },
        async getLastViewedArticle() {
            if (!localStorage.getItem('token')) {
                return null
            } else {
                console.log("token存在");
            }
            console.log(localStorage.getItem('token'));

            try {
                // 向服务器发送请求，获取用户上次浏览的文章信息
                const response = await axios.get(`/api/user/last-viewed/${this.acid}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                // console.log("获取到了", response.data);
                return response.data.scrollPosition;

            } catch (error) {
                console.error('Error retrieving last viewed article:', error);
                return null;
            }
        },


        async saveScrollPosition() {//退出时启动的函数，上传数据
            if (!localStorage.getItem('token')) {
                return
            }//没有token不获取滚动并且退出
            console.log(this.articleBoxHeight);
            console.log(window.innerHeight);

            const maxScrollPosition = this.articleBoxHeight - window.innerHeight;//获取到最大滚动值
            console.log('最大宽度', maxScrollPosition);

            try {
                // 向服务器发送请求，保存文章滚动位置
                await axios.post('/api/user/save-progress', {
                    articleId: this.acid,
                    scrollPosition: this.scrollPosition,
                    maxScrollPosition: maxScrollPosition // 添加这个值
                }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                // console.log("发送成功了:", scrollPosition);
            } catch (error) {
                console.error('Error saving scroll position:', error);
            }

        },

        handleResize() {
            // 调整 articleBox 的高度为窗口的高度
            const articleBox = this.$refs.articleBox;
            articleBox.style.height = `${window.innerHeight}px`;
        },

        goBack() {
            // 使用Vue Router的内置返回功能
            if (window.history.length > 1) {
                this.$router.go(-1);
            } else {
                // 如果没有历史记录，返回首页
                this.$router.push('/Index/Home');
            }
        },

        getRandomImage() {
            const randomIndex = Math.floor(Math.random() * this.images.length);
            return this.images[randomIndex].src;
        },

        async fetchArticleData() {
            try {
                const articleId = this.$route.params.id;
                // const token = localStorage.getItem('token'); // 从 localStorage 获取 Token
                const response = await axios.get(`/api/articles/${articleId}`);

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
        //发布评论
        async submitComment() {
            if (!this.newComment.trim()) {
                alert('评论内容不能为空');
                return;
            }

            try {
                await axios.post('/api/comments', {
                    content: this.newComment,
                    articleId: this.acid,
                    author: this.user
                }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                this.newComment = '';
                // 重新获取所有评论，确保评论包含完整的用户信息
                await this.fetchComments(this.acid);
            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        },
        //发布回复
        async submitReply(parentCommentId) {
            if (!this.replyContent.trim()) {
                alert('回复内容不能为空');
                return;
            }

            try {
                await axios.post('/api/comments/reply', {
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
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/comments/${articleId}/comments`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // 确保用户状态已加载
                if (token && !this.$store.state.user.token) {
                    const userResponse = await axios.get('/api/users', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    this.$store.dispatch('updateUser', {
                        token: token,
                        details: userResponse.data
                    });
                }

                this.comments = response.data.comments;
                console.log('Comments loaded:', this.comments);
                
            } catch (error) {
                // 如果发生错误，打印错误信息
                console.error('Error fetching comments:', error);
            }
        },

        async deleteComment(commentId) {
            try {
                // 显示确认对话框
                const confirmResult = await this.$confirm('确定要删除这条评论吗？删除后将同时删除该评论下的所有回复', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
                
                if (confirmResult === 'confirm') {
                    await axios.delete(`/api/comments/${commentId}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    
                    // 删除成功后刷新评论列表
                    await this.fetchComments(this.acid);
                    this.$message.success('评论删除成功');
                }
            } catch (error) {
                if (error !== 'cancel') {
                    console.error('Error deleting comment:', error);
                    this.$message.error('删除评论失败，请重试');
                }
            }
        },


    }
};
</script>

<style scoped>
.articleBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    margin: auto;
    background-color: var(--background-color);
    max-width: 1200px;
    min-height: 100vh;
    transition: all 0.2s ease;
}
/* 整体滚动条 */
::-webkit-scrollbar {
    width: 10px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    background-color: var(--background-color);
    border-radius: 6px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    background-color: var(--card-background);
    border-radius: 6px;
    border: 2px solid var(--background-color);
}

/* 滚动条滑块 - 悬停 */
::-webkit-scrollbar-thumb:hover {
    background-color: #555;
}

.header {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    color: var(--text-color);
    position: sticky;
    top: 0;
    padding: 20px;
    background-color: var(--background-color);
    z-index: 100;
    box-shadow: 0 2px 8px var(--shadow-color);
    border-radius: 0 0 20px 20px;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    margin-bottom: 25px;
    border: 1px solid var(--border-color);
}

.back-button {
    border: none;
    background-color: var(--button-color);
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 16px;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.back-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    background-color: var(--primary-color);
}

.back-icon {
    font-style: normal;
    margin-right: 8px;
    font-weight: bold;
    transition: transform 0.2s ease;
}

.back-button:hover .back-icon {
    transform: translateX(-2px);
}

.back-text {
    font-weight: 500;
    letter-spacing: 0.5px;
}

.separator {
    margin: 0 15px;
    font-size: 18px;
    color: var(--text-color);
    opacity: 0.5;
    font-weight: 300;
}

.title {
    font-size: 22px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70%;
    transition: all 0.3s ease;
    color: right;
}

@media (max-width: 768px) {
    /* .header {
        padding: 15px;
    } */

    /* .back-button {
        padding: 10px 20px;
        font-size: 14px;
    } */

    .title {
        font-size: 18px;
        max-width: 60%;
    }
}

@media (max-width: 480px) {
    /* .header {
        padding: 12px;
    } */

    /* .back-button {
        padding: 8px 16px;
        font-size: 13px;
    } */

    .separator {
        margin: 0 10px;
        font-size: 16px;
    }

    .title {
        font-size: 16px;
        max-width: 50%;
    }
}

.articleText {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 40px;
    box-shadow: 0 4px 12px var(--shadow-color);
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
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    width: calc(100% - 40px);
    padding: 25px;
    border-radius: 15px;
    box-sizing: border-box;
    color: white;
    transition: all 0.3s ease;
}

.overlay .title {
    font-size: 28px;
    margin-bottom: 15px;
    line-height: 1.4;
}

.overlay p {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 10px;
    opacity: 0.9;
}

.article-author {
    margin-top: 10px;
}

.articleContent {
    width: 100%;

    margin: 30px auto 0;
    color: var(--text-color);
    background-color: var(--background-color);
    border-radius: 10px;

}

.articleContent>>>p {
    /* color: #333333; */
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
.reply-form{
    display: flex;
}
.reply-form textarea {
    margin: 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
}
.reply-form button {
    margin: 10px;
}
/*评论 */
.comment-section {
    padding: 30px;
    width: 100%;
    border-top: 2px solid var(--card-background);
    color: var(--text-color);
    background-color: var(--background-color);
    border-radius: 15px;
    margin-top: 30px;
    box-shadow: 0 2px 8px var(--shadow-color);
}

.comment-input {
    margin-bottom: 30px;
    background-color: var(--card-background);
    padding: 20px;
    border-radius: 12px;
}

.comment-input textarea {
    width: 100%;
    height: 120px;
    padding: 15px;
    border: 2px solid var(--card-background);
    border-radius: 10px;
    background-color: var(--background-color);
    color: var(--text-color);
    font-size: 16px;
    transition: all 0.3s ease;
    resize: vertical;
    margin-bottom: 15px;
}

.comment-input textarea:focus {
    border-color: var(--button-color);
    outline: none;
    box-shadow: 0 0 0 3px var(--shadow-color);
}

.comment-input button {
    padding: 12px 25px;
    background-color: var(--button-color);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .articleBox {
        padding: 20px;
    }

    /* .header {
        margin-bottom: 20px;
        padding: 12px 0;
    } */

    /* .back-button {
        padding: 8px 15px;
        font-size: 14px;
        margin-right: 10px;
    } */
    
    /* .back-text {
        display: none;
    } */
    
    /* .back-icon {
        margin-right: 0;
        font-size: 16px;
    } */

    .separator {
        margin: 0 10px;
        font-size: 16px;
    }

    .title {
        font-size: 18px;
        max-width: 60%;
    }

    .overlay {
        padding: 15px;
        bottom: 10px;
        left: 10px;
        right: 10px;
        width: calc(100% - 20px);
    }

    .overlay .title {
        font-size: 20px;
        margin-bottom: 10px;
    }

    .overlay p {
        font-size: 14px;
    }

    .articleContent>>>p {
        font-size: 14px;
        padding: 15px;
        text-indent: 28px;
    }

    .comment-section {
        padding: 20px;
    }

    .comment-input {
        padding: 15px;
    }

    .comment-input textarea {
        height: 100px;
        font-size: 14px;
        padding: 10px;
    }

    .reply-form {
        flex-direction: column;
    }

    .reply-form textarea {
        width: calc(100% - 20px);
        margin: 10px;
    }

    .reply-form button {
        width: calc(100% - 20px);
        margin: 5px 10px;
    }
}

@media (max-width: 480px) {
    .articleBox {
        padding: 15px;
    }

    /* .header {
        margin-bottom: 15px;
        padding: 10px 0;
    } */

    /* .back-button {
        padding: 6px 12px;
        font-size: 12px;
        margin-right: 8px;
    } */
    
    /* .back-icon {
        font-size: 14px;
    } */

    .separator {
        font-size: 14px;
        margin: 0 8px;
    }

    .title {
        font-size: 16px;
        max-width: 50%;
    }

    .overlay {
        padding: 10px;
    }

    .overlay .title {
        font-size: 18px;
    }

    .overlay p {
        font-size: 12px;
        margin-bottom: 5px;
    }

    .articleContent>>>p {
        font-size: 12px;
        padding: 10px;
        text-indent: 24px;
    }
}

.comment-input button:hover {
    opacity: 0.9;
    transform: translateY(0);
}

.comments-list {
    margin-top: 30px;
}

.comment {
    padding: 20px;
    border: 1px solid var(--card-background);
    margin-bottom: 25px;
    background-color: var(--card-background);
    border-radius: 12px;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px var(--shadow-color);
}

.comment:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px var(--shadow-color);
}

.comment p {
    margin: 0 0 15px 0;
    font-size: 15px;
    line-height: 1.6;
}

.comment small {
    color: #888;
    display: block;
    margin-bottom: 15px;
    font-size: 13px;
}

.replies {
    margin: 20px 0 0 30px;
    padding: 15px;
    background-color: var(--background-color);
    border-radius: 10px;
    border-left: 3px solid var(--button-color);
}

.reply {
    padding: 15px;
    margin-bottom: 15px;
    background-color: var(--card-background);
    border-radius: 8px;
    transition: all 0.3s ease;
}

.reply:last-child {
    margin-bottom: 0;
}

.reply p {
    margin: 0 0 10px 0;
    font-size: 14px;
}

.reply small {
    color: #888;
    font-size: 12px;
}

.reply-form {
    margin-top: 15px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
}

.reply-form textarea {
    flex: 1;
    height: 80px;
    padding: 12px;
    border: 1px solid var(--card-background);
    border-radius: 8px;
    background-color: var(--background-color);
    color: var(--text-color);
    font-size: 14px;
    resize: vertical;
}

.reply-form button {
    padding: 8px 15px;
    background-color: var(--button-color);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.reply-form button:last-child {
    background-color: #6c757d;
}

.reply-form button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

@media (max-width: 690px) {
    .comment-section {
        padding: 20px 15px;
    }

    .replies {
        margin-left: 15px;
        padding: 10px;
    }

    .reply-form {
        flex-direction: column;
    }

    .reply-form button {
        width: 100%;
        margin: 5px 0;
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

.delete-btn {
    background-color: var(--button-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    margin-left: 10px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s ease;
}

.delete-btn:hover {
    opacity: 0.8;
}
</style>
