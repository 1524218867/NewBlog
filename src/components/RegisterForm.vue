<template>
    <div class="form-container2">
        <h2>Welcome back!</h2>
        <el-form @submit.prevent="handleSubmit" class="ElFrom">
            <el-form-item>
                <el-input class="ElInp" v-model="form.name" placeholder="Name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input class="ElInp" v-model="form.email" placeholder="Email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input class="ElInp" v-model="form.password" type="password" placeholder="Password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input class="ElInp" v-model="form.confirmPassword" type="password"
                    placeholder="Confirm Password"></el-input>
            </el-form-item>
            <el-button type="primary" class="BtnAft" @click="handleSubmit" block>Create account</el-button>
        </el-form>
        <div class="divider">
            <span class="line"></span>
            <span class="text">or</span>
            <span class="line"></span>
        </div>
        <div class="signin-link">
            <small>
                已经有账户了吗? <a href="#" @click.prevent="toggleForm">Sign in</a>
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
        }
    },
    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            }
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
                const response = await axios.post('http://localhost:5000/api/auth/register', requestData, {
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
    background: #fff;

}

.form-container2>h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.5rem;
    font-weight: 600;
    user-select: none;
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
    background-color: black;
    color: white;
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
