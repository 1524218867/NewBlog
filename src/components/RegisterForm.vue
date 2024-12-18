<template>
    <div class="form-container2">
        <h2>Welcome back!</h2>
        <el-form @submit.prevent="handleSubmit" class="ElFrom">
            <el-form-item>
                <el-input class="ElInp" v-model="form.name" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input class="ElInp" v-model="form.email" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input class="ElInp" v-model="form.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input class="ElInp" v-model="form.confirmPassword" type="password" placeholder="再次输入密码"></el-input>
            </el-form-item>
            <el-button type="primary" class="BtnAft" @click="handleSubmit" block>创建帐户</el-button>
        </el-form>
        <div class="divider">
            <span class="line"></span>
            <span class="text">or</span>
            <span class="line"></span>
        </div>
        <div class="signin-link">
            <small>
                已经有账户了吗? <a href="#" @click.prevent="toggleForm">登陆</a>
            </small>
        </div>

    </div>
</template>

<script>
import axios from 'axios'; // 引入 axios
import { Notification } from 'element-ui';

export default {
    props: {
        toggleForm: {
            type: Function,
            required: true,
            theme: '',
        }
    },
    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
            themes: {
                light: {
                    '--primary-color': '#3498db',
                    '--ZiBaiBgc': "#f8f9ff",
                    '--ActiveBgc': '#f7f7f8',
                    '--background-color': '#ffffff',
                    '--Border': ' #f0f1fb',
                    '--text-color': '#000000',//文本颜色
                    '--active-background-color': '#1988fa',//按钮颜色
                    '--article-card-background-color': ' #f5f5f5',//边框颜色
                    '--Business-card-gradient': 'linear-gradient(to right, #1988fa 0%, #33c4f9 50%, #00f2fe 100%)'
                },
                dark: {
                    '--primary-color': '#e74c3c',
                    '--ActiveBgc': '#1a1a1a',
                    '--ZiBaiBgc': "#1f1f1f",
                    '--background-color': '#000000',
                    '--Border': ' #2c2c2c',
                    '--text-color': '#ecf0f1',//文本颜色
                    '--active-background-color': '#015aea',//按钮颜色
                    '--article-card-background-color': ' #212121',//边框颜色
                    '--Business-card-gradient': 'linear-gradient(to right, #012a63, #015aea, #4d9ef7)'
                }
            },
        };
    },
    methods: {

        async handleSubmit() {
            try {
                // 构建请求数据
                const requestData = {
                    username: this.form.name,
                    email: this.form.email,
                    password: this.form.password
                };

                // 检查确认密码是否匹配
                if (this.form.password !== this.form.confirmPassword) {
                    Notification.error({
                        title: '注册失败',
                        message: '密码和确认密码不匹配。',
                        duration: 3000
                    });
                    return;
                }

                // 发送注册请求到后端
                const response = await axios.post('/api/auth/register', requestData, {
                    headers: {
                        'Content-Type': 'application/json' // 设置请求头
                    }
                });

                // 处理成功响应
                Notification.success({
                    title: '注册成功',
                    message: '您已经成功注册，请登录。',
                    duration: 3000
                });

                // 切换到登录表单
                this.toggleForm();
            } catch (error) {
                // 处理错误响应
                if (error.response && error.response.data && error.response.data.errors) {
                    // 后端返回的错误信息
                    error.response.data.errors.forEach(err => {
                        Notification.error({
                            title: '注册失败',
                            message: err.msg,
                            duration: 3000
                        });
                    });
                } else {
                    // 其他未知错误
                    Notification.error({
                        title: '注册失败',
                        message: '注册过程中出现错误，请稍后重试。',
                        duration: 3000
                    });
                }
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
            // localStorage.setItem('theme', themeName);
        },
    },
    mounted() {
        this.theme = localStorage.getItem('theme') || 'light';
        console.log(this.theme);
        this.updateTheme(this.theme);
    }
};
</script>

<style scoped>
.form-container2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    background:var(--background-color);

}

.form-container2>h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.5rem;
    font-weight: 600;
    user-select: none;
    color: var(--text-color);
    /* 禁止文本选择 */
}

.ElFrom {
    text-align: center;
}

.ElInp {
    width: 60%;
    margin: auto;
}

.ElInp>>>.el-input__inner {
    border-radius: 8px;
    padding: 23px;
}


.BtnAft {
    width: 60%;
    background-color: var(--text-color);
    color: var(--background-color);
    border-radius: 8px;
    padding: 16px;
    z-index: 1;
    font-size: inherit;
    font-family: inherit;


    outline: none;
    border: none;

}

.BtnAft:hover {
    cursor: pointer;
    animation: jelly 0.5s;
}

@keyframes jelly {

    0%,
    100% {
        transform: scale(1, 1);
    }

    25% {
        transform: scale(0.9, 1.1);
    }

    50% {
        transform: scale(1.1, 0.9);
    }

    75% {
        transform: scale(0.95, 1.05);
    }
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px auto;
    width: 60%;
    user-select: none;
    /* 禁止文本选择 */
   
}
.divider >.text{
    color: var(--text-color);
}
.line {
    flex: 1;
    height: 1px;
    background-color: #ccc;
}

.text {
    margin: 0 10px;
    color: #000000;
    font-weight: bold;
}

.signin-link {
    text-align: center;
    width: 60%;
    margin: 0 auto 20px;
    user-select: none;
    /* 禁止文本选择 */
}
.signin-link>small {
    color: var(--text-color);
}
.signin-link>small>a {
    font-size: 16px;
    font-weight: bold;
    background: linear-gradient(45deg, #ff6b6b, #ffcc33);
    -webkit-background-clip: text;
    color: transparent;
}

.signin-link>small>a:hover {
    background: linear-gradient(45deg, #ffcc33, #ff6b6b);
    -webkit-background-clip: text;
}
</style>
