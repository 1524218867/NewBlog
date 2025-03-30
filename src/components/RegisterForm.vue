<template>
    <div class="form-container2">
        <h2>Welcome back!</h2>
        <el-form @submit.prevent="handleSubmit" class="ElFrom" :model="form" :rules="rules" ref="registerForm">
            <el-form-item prop="name">
                <el-input class="ElInp" v-model="form.name" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <el-form-item prop="email">
                <el-input class="ElInp" v-model="form.email" placeholder="邮箱" prefix-icon="el-icon-message"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input class="ElInp" v-model="form.password" type="password" placeholder="密码" prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
                <el-input class="ElInp" v-model="form.confirmPassword" type="password" placeholder="再次输入密码" prefix-icon="el-icon-lock" show-password></el-input>
            </el-form-item>
            <el-form-item prop="verificationCode" class="verification-code-item">
                <el-input class="ElInp verification-input" v-model="form.verificationCode" placeholder="验证码" prefix-icon="el-icon-message">
                    <template slot="append">
                        <el-button @click="sendVerificationCode" :disabled="countdown > 0">{{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-button type="primary" class="BtnAft" @click="submitForm('registerForm')" :loading="loading" block>创建帐户</el-button>
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
            required: true
        },
        theme: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                verificationCode: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (value !== this.form.password) {
                                callback(new Error('两次输入密码不一致'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                verificationCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { len: 6, message: '验证码长度必须为6位', trigger: 'blur' }
                ]
            },
            loading: false,
            currentTheme: '',
            countdown: 0
        };
    },
    methods: {
        async sendVerificationCode() {
            try {
                // 验证邮箱格式
                await this.$refs.registerForm.validateField('email');
                
                // 立即显示发送中提示并开始倒计时
                this.countdown = 60;
                const startTime = Date.now();
                const timer = setInterval(() => {
                    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                    this.countdown = Math.max(60 - elapsedTime, 0);
                    if (this.countdown === 0) {
                        clearInterval(timer);
                    }
                }, 1000);

                Notification.info({
                    title: '发送中',
                    message: '验证码发送中，请稍候查收',
                    duration: 3000
                });

                // 发送验证码请求
                await axios.post('/api/auth/send-verification-code', {
                    email: this.form.email
                });

                Notification.success({
                    title: '发送成功',
                    message: '验证码已发送到您的邮箱',
                    duration: 3000
                });
            } catch (error) {
                Notification.error({
                    title: '发送失败',
                    message: error.response?.data?.message || '验证码发送失败，请稍后重试',
                    duration: 3000
                });
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (!valid) {
                    return false;
                }
                this.loading = true;
                try {
                    // 构建请求数据
                    const requestData = {
                        username: this.form.name,
                        email: this.form.email,
                        password: this.form.password,
                        code: this.form.verificationCode
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
                    this.loading = false;
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
            });
        },

    },
    mounted() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
    },
    watch: {
        theme: {
            immediate: true,
            handler(newTheme) {
                this.currentTheme = newTheme;
            }
        }
    }
};
</script>

<style scoped>
.form-container2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    background: var(--background-color);

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

.verification-code-item .verification-input {
    width: 60%;
    margin: auto;
}

.verification-code-item .el-input-group__append {
    background-color: var(--text-color);
    border-color: var(--text-color);
    color: var(--background-color);
}

.verification-code-item .el-input-group__append .el-button {
    border: none;
    background: none;
    color: inherit;
    padding: 0 15px;
}

.ElInp>>>.el-input__inner {
    border-radius: 8px;
    padding: 12px 12px 12px 40px;
    transition: all 0.3s ease;
    background-color: var(--card-background);
    color: var(--text-color);
    border-color: var(--border-color);
}

.ElInp>>>.el-input__inner:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.ElInp>>>.el-input__prefix {
    left: 12px;
    color: var(--text-color);
    opacity: 0.7;
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

.divider>.text {
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
