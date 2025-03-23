<template>
    <div class="form-container">
        <h2>Sign in</h2>
        <el-form @submit.prevent="handleSubmit" class="ElFrom" :model="form" :rules="rules" ref="loginForm">
            <el-form-item prop="email">
                <el-input class="ElInp" v-model="form.email" placeholder="Email"
                    prefix-icon="el-icon-message"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input class="ElInp" v-model="form.password" type="password" placeholder="Password"
                    prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <el-button type="primary" class="BtnAft" @click="submitForm('loginForm')" :loading="loading"
                block>登录</el-button>
        </el-form>
        <div class="divider">
            <span class="line"></span>
            <span class="text">or</span>
            <span class="line"></span>
        </div>
        <div class="signin-link">
            <small>
                没有账户? <a href="#" @click.prevent="toggleForm">创建账户</a>
            </small>
        </div>

    </div>
</template>

<script>
import axios from 'axios'; // 引入 axios
import { Notification } from 'element-ui';
import { mapActions } from 'vuex'; // 用于 map Vuex actions

export default {
    props: {
        toggleForm: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            rules: {
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
                ]
            },
            loading: false,
            themes: {
                light: {
                    '--primary-color': '#3498db',
                    '--ZiBaiBgc': "#f8f9ff",
                    '--ActiveBgc': '#f7f7f8',
                    '--background-color': '#ffffff',
                    '--Border': ' #f0f1fb',
                    '--text-color': '#000000', // 文本颜色
                    '--active-background-color': '#1988fa', // 按钮颜色
                    '--article-card-background-color': ' #f5f5f5', // 边框颜色
                    '--Business-card-gradient': 'linear-gradient(to right, #1988fa 0%, #33c4f9 50%, #00f2fe 100%)'
                },
                dark: {
                    '--primary-color': '#e74c3c',
                    '--ActiveBgc': '#1a1a1a',
                    '--ZiBaiBgc': "#1f1f1f",
                    '--background-color': '#000000',
                    '--Border': ' #2c2c2c',
                    '--text-color': '#ecf0f1', // 文本颜色
                    '--active-background-color': '#015aea', // 按钮颜色
                    '--article-card-background-color': ' #212121', // 边框颜色
                    '--Business-card-gradient': 'linear-gradient(to right, #012a63, #015aea, #4d9ef7)'
                }
            }
        };
    },
    methods: {
        ...mapActions(['updateUser']), // 映射 Vuex actions
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                this.loading = true;
                try {
                    // 构建请求数据
                    const requestData = {
                        email: this.form.email,
                        password: this.form.password
                    };
                    // console.log(requestData);
                    // 发送登录请求到后端
                    const response = await axios.post('/api/auth/login', requestData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    // 处理成功响应
                    Notification.success({
                        title: '登录成功',
                        message: '您已成功登录。',
                        duration: 3000
                    });

                    // 处理成功登录后的操作，如保存 token 和跳转页面
                    const token = response.data.token;
                    console.log('登陆后返回用户信息', response.data);
                    const userDetails = response.data.user; // 响应中包含用户详细信息

                    localStorage.setItem('token', token);
                    console.log("登录处获得了信息", userDetails);

                    // 更新 Vuex 状态
                    this.$store.dispatch('updateUser', { token, details: userDetails });

                    // 登录成功后获取用户详细信息
                    axios.get('/api/user', {
                        headers: { Authorization: `Bearer ${token}` }
                    }).then(userResponse => {
                        // 处理用户详细信息
                        console.log("登录处获得了信息", userResponse);
                        const userDetails = userResponse.data;

                        // 更新 Vuex 状态
                        this.$store.dispatch('updateUser', { token, details: userDetails });
                    }).catch(userError => {
                        console.error('Get user details error:', userError);
                    });

                    // 跳转页面
                    this.$router.push('/Index'); // 登录成功切换到/Index 路由
                } catch (error) {
                    this.loading = false;
                    // 处理错误响应

                    if (error.response && error.response.data) {
                        // 后端返回的错误信息
                        const errorMsg = error.response.data.msg || '登录失败';
                        Notification.error({
                            title: '登录失败',
                            message: errorMsg,
                            duration: 3000
                        });
                    } else {
                        // 其他未知错误
    
                        Notification.error({
                            title: '登录失败',
                            message: '登录过程中出现错误，请稍后重试。',
                            duration: 3000
                        });
                    }
                }
            });
        },
        updateTheme(themeName) {
            console.log(themeName);

            // document.body.classList.toggle('dark-theme', themeName === 'dark');
            this.currentTheme = themeName; // 这里的currentTheme是data里的，用来在html里显示当前主题，并不是子组件的
            // 根据传入的主题名称更新全局 CSS 变量  
            const theme = this.themes[themeName];
            for (const key in theme) {
                document.documentElement.style.setProperty(key, theme[key]);
            }
            // 保存到 localStorage 以保持刷新后的主题
            // localStorage.setItem('theme', themeName);
        }
    },
    mounted() {
        this.theme = localStorage.getItem('theme') || 'light';
        console.log(this.theme);
        this.updateTheme(this.theme);
    }
};
</script>

<style scoped>
.form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    background: var(--background-color);

}

.form-container>h2 {
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
    padding: 12px 12px 12px 40px;
    transition: all 0.3s ease;
}

.ElInp>>>.el-input__inner:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.ElInp>>>.el-input__prefix {
    left: 12px;
    color: #909399;
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

.line {
    flex: 1;
    height: 1px;
    background-color: #ccc;
}

.text {
    margin: 0 10px;
    color: var(--text-color);
    font-weight: bold;
}

.signin-link {
    text-align: center;
    width: 60%;
    margin: 0 auto 20px;
    user-select: none;
    /* 禁止文本选择 */
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

.social-buttons {
    display: flex;
    flex-direction: column;
}

.social-buttons>button {
    width: 60%;
    margin: 10px auto;
    border-radius: 8px;
    padding: 16px;
}
</style>
