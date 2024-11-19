<template>
    <div class="form-container">
        <h2>Sign in</h2>
        <el-form @submit.prevent="handleSubmit" class="ElFrom">
            <el-form-item>
                <el-input class="ElInp" v-model="form.email" placeholder="Email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input class="ElInp" v-model="form.password" type="password" placeholder="Password"></el-input>
            </el-form-item>
            <el-button type="primary" class="BtnAft" @click="handleSubmit" block>Sign in</el-button>
        </el-form>
        <div class="divider">
            <span class="line"></span>
            <span class="text">or</span>
            <span class="line"></span>
        </div>
        <div class="signin-link">
            <small>
                没有账户? <a href="#" @click.prevent="toggleForm">Create account</a>
            </small>
        </div>
        <!-- <div class="social-buttons">
            <el-button class="FengXiangBtn" type="default" block>Continue with Google</el-button>
            <el-button class="FengXiangBtn" type="default" block>Continue with Apple</el-button>
            <el-button class="FengXiangBtn" type="default" block>Continue with Twitter</el-button>
        </div> -->
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
            }
        };
    },

    methods: {
        ...mapActions(['updateUser']), // 映射 Vuex actions
        async handleSubmit() {
            try {
                // 构建请求数据
                const requestData = {
                    email: this.form.email,
                    password: this.form.password
                };
                // console.log(requestData);
                // 发送登录请求到后端
                const response = await axios.post('http://localhost:5000/api/auth/login', requestData, {
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
                console.log(response.data);
                const userDetails = response.data.user; // 假设响应中包含用户详细信息

                localStorage.setItem('token', token);

                // 更新 Vuex 状态
                this.$store.dispatch('updateUser', { token, details: userDetails });

                // 登录成功后获取用户详细信息
                axios.get('http://localhost:5000/api/user', {
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
                // 处理错误响应
                console.log(error); // 查看错误详情
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
                    console.log(error); // 查看错误详情
                    Notification.error({
                        title: '登录失败',
                        message: '登录过程中出现错误，请稍后重试。',
                        duration: 3000
                    });
                }
            }
        }
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
