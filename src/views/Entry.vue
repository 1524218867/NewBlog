<!-- <template>
    <div class="Entry">

        <div class="Entry-box">
            <el-card shadow="hover" class="Entry-card">

                <el-form ref="form" :model="form" :rules="rules" class="Entry-form">
                  
                    <el-form-item v-show="!showRegister" prop="loginUsername">
                        <h1>Login</h1>
                        <el-input class="custom-input" v-model="form.loginUsername" placeholder="请输入登录邮箱"
                            suffix-icon="el-icon-user"></el-input>
                    </el-form-item>
                    <el-form-item v-show="!showRegister" prop="loginPassword">
                        <el-input class="custom-input" v-model="form.loginPassword" placeholder="请输入密码" type="password"
                            suffix-icon="el-icon-lock"></el-input>
                    </el-form-item>
                    <el-form-item v-show="!showRegister" class="FroBtn">
                        <el-button class="custom-button" type="primary" @click="login">登录</el-button>
                    </el-form-item>
                   
                    <el-form-item v-show="showRegister" prop="registerUsername">
                        <h1>Register</h1>
                        <el-input class="custom-input" v-model="form.registerUsername" placeholder="请输入用户名"
                            suffix-icon="el-icon-user"></el-input>
                    </el-form-item>
                    <el-form-item v-show="showRegister" prop="registerEmail">
                        <el-input class="custom-input" v-model="form.registerEmail" placeholder="请输入注册邮箱"
                            suffix-icon="el-icon-mail"></el-input>
                    </el-form-item>
                    <el-form-item v-show="showRegister" prop="registerPassword">
                        <el-input class="custom-input" v-model="form.registerPassword" placeholder="请输入密码" type="password"
                            suffix-icon="el-icon-lock"></el-input>
                    </el-form-item>
                    <el-form-item v-show="showRegister" class="FroBtn">
                        <el-button class="custom-button" type="primary" @click="register">注册</el-button>
                    </el-form-item>
                    <a @click="toggleForm">{{ showRegister ? '已有账号？去登录' : '没有账号？去注册' }}</a>
                </el-form>
            </el-card>
            <svg @click="redirectToOtherPage" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-x-lg BacktoHome" viewBox="0 0 16 16">
                <path
                    d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>

        </div>
        <div class="slideshow-box">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <img src="../assets/1.jpg" class="img-responsive" alt="Responsive image" />
                    </div>
                    <div class="swiper-slide">
                        <img src="../assets/2.jpg" class="img-responsive" alt="Responsive image" />
                    </div>
                </div>

                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
        <div class="danmu" style="top: 20px;right: 1000px;color:#ffff00 ;font-size: 20px;">Welcome to my website!(￣▽￣)~*
        </div>
        <div class="danmu" style="top: 500px;right: 800px;">这里真是太好Van辣!(✪ω✪)</div>
        <div class="danmu" style="top: 800px;right: 900px;">鸡鸡鸡你太美~┗( ▔, ▔ )┛</div>
        <div class="danmu" style="top: 500px;right: 1600px;color: red;">里面的人个个说话又好听┓(;´_｀)┏</div>
        <div class="danmu" style="top: 600px;right: 600px;color:#ffff00 ;">比新游戏还好Van哦(︶.̮︶✽)</div>
        <div class="danmu" style="top: 300px;right: 1500px;color:#22ec08 ;font-size: 30px;">杰哥我还要啊ᕦ(･ㅂ･)ᕤ!</div>
    </div>
</template> -->

<!-- <script>
import Swiper from 'swiper'
import { Message } from 'element-ui';

export default {
    data() {
        return {
            form: {
                loginUsername: "",         // 登录时的邮箱
                loginPassword: "",         // 登录时的密码
                registerUsername: "",      // 注册时的用户名
                registerEmail: "",         // 注册时的邮箱
                registerPassword: ""       // 注册时的密码
            },
            rules: {
                // 登录表单的验证规则
                loginUsername: [
                    { required: true, message: "请输入登录邮箱", trigger: "blur" },
                    { type: "email", message: "邮箱格式不正确", trigger: "blur" } // 你可能还需要确认是否对邮箱格式进行验证
                ],
                loginPassword: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { pattern: /^[a-zA-Z0-9!@#\$%\^&\*\(\)_\+\-=\[\]\{\};:,\.<>\/?\\|]{6,}$/, message: "密码至少包含6个字符，包含字母、数字或特殊字符", trigger: "blur" } // 这里的正则表达式可能与你的后端验证不完全一致
                ],
                // 注册表单的验证规则
                registerUsername: [
                    { required: true, message: "请输入注册用户名", trigger: "blur" }
                ],
                registerEmail: [
                    { required: true, message: "请输入注册邮箱", trigger: "blur" },
                    { type: "email", message: "邮箱格式不正确", trigger: "blur" }
                ],
                registerPassword: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { pattern: /^[a-zA-Z0-9!@#\$%\^&\*\(\)_\+\-=\[\]\{\};:,\.<>\/?\\|]{6,}$/, message: "密码至少包含6个字符，包含字母、数字或特殊字符", trigger: "blur" }
                ]
            },

            // 图片路径
            url: '../assets/Entrybg.jpg',
            // 轮播图数组
            banner: [],
            showRegister: false,
            form: {
                loginUsername: '',
                loginPassword: '',
                registerUsername: '',
                registerPassword: '',
                email: ''
            },
            borderColor: '#45489a'
        }
    },

    components: {},
    created() { },
    computed: {},

    mounted() {

        // 在 mounted 钩子中初始化 Swiper
        this.swiper = new Swiper('.swiper-container', {
            autoplay: {
                // 自动播放
                delay: 8000,
            },
            // 设置过渡效果
            effect: 'fade',
            // 设置淡入淡出效果
            fadeEffect: {
                // 设置淡入淡出时的过渡效果
                crossFade: true,
            },
            // 设置是否循环播放
            loop: true,
            // Swiper 配置选项
            // 例如：pagination, navigation, effect 等等
            pagination: {
                el: '.swiper-pagination',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        })

    },

    methods: {
        toggleForm() {
            this.showRegister = !this.showRegister; // 切换显示登录和注册表单
        },
        // ...mapActions(['updateUser']),
        // toggleForm() {
        //     this.showRegister = !this.showRegister;
        // },

        // async login() {
        //     if (!this.form.loginUsername) {
        //         this.$message({
        //             type: 'error',
        //             message: '请输入登录邮箱。'
        //         });
        //         return;
        //     }

        //     if (!this.form.loginPassword) {
        //         this.$message({
        //             type: 'error',
        //             message: '请输入密码。'
        //         });
        //         return;
        //     }
        //     try {
        //         const auth = getAuth();
        //         const userCredential = await signInWithEmailAndPassword(

        //             auth,
        //             this.form.loginUsername,
        //             this.form.loginPassword
        //         );

        //         console.log('登录时是:', userCredential.user);

        //         await this.updateUser(userCredential.user); // 更新用户状态
        //         alert('登录成功');

        //         this.$router.push('/Index');
        //     } catch (error) {
        //         // console.error('Login failed:', error); // 登录失败，输出错误信息
        //         // return; // 结束函数，避免进一步执行
        //         switch (error.code) {
        //             case 'auth/wrong-password':
        //                 this.$message.error('密码错误，请重试。');
        //                 break;
        //             case 'auth/user-not-found':
        //                 this.$message.error('用户不存在，请确认您的账号。');
        //                 break;
        //             case 'auth/too-many-requests':
        //                 this.$message.error(
        //                     '由于多次失败的登录尝试，您的账户已被临时禁用。请稍后再试，或者重置您的密码。'
        //                 );
        //                 break;
        //             case 'auth/invalid-credential':
        //                 this.$message.error(
        //                     '无效凭证。请检查您的登录信息，并确保密码正确。'
        //                 );
        //                 break;
        //             default:
        //                 this.$message.error('登录失败，请稍后再试。');
        //                 break;

        //         }
        //     }
        // },


        // async register() {
        //     if (!this.form.registerUsername) {
        //         this.$message({
        //             type: 'error',
        //             message: '请输入注册邮箱。'
        //         });
        //         return;
        //     }

        //     if (!this.form.registerPassword) {
        //         this.$message({
        //             type: 'error',
        //             message: '请输入密码。'
        //         });
        //         return;
        //     }

        //     if (this.form.registerPassword.length < 6) {
        //         this.$message({
        //             type: 'error',
        //             message: '密码长度至少为 6 个字符。'
        //         });
        //         return;
        //     }
        //     try {
        //         const auth = getAuth();
        //         const userCredential = await createUserWithEmailAndPassword(
        //             auth,
        //             this.form.registerUsername,
        //             this.form.registerPassword
        //         );
        //         console.log('User registered:', userCredential.user);

        //         // 注册成功时提示
        //         this.$message({
        //             type: 'success',
        //             message: '注册成功！欢迎，' + userCredential.user.email
        //         });

        //         // 注册成功后跳转或其他操作
        //         // this.$router.push('/home');
        //     } catch (error) {
        //         console.error('Error during registration:', error);

        //         // 处理不同的注册失败错误，提示原因
        //         if (error.code === 'auth/email-already-in-use') {
        //             this.$message({
        //                 type: 'error',
        //                 message: '该邮箱已被注册。请使用其他邮箱。'
        //             });
        //         } else if (error.code === 'auth/invalid-email') {
        //             this.$message({
        //                 type: 'error',
        //                 message: '邮箱格式无效。请检查您的邮箱。'
        //             });
        //         } else if (error.code === 'auth/weak-password') {
        //             this.$message({
        //                 type: 'error',
        //                 message: '密码太弱。请使用更强的密码。'
        //             });
        //         } else {
        //             this.$message({
        //                 type: 'error',
        //                 message: '注册失败。请稍后再试。'
        //             });
        //         }
        //     }
        // },
        async login() {
            // 前端验证
            if (!this.form.loginUsername || !this.form.loginPassword) {
                this.$message.error('所有字段都是必填的');
                return;
            }

            if (!this.validateEmail(this.form.loginUsername)) {
                this.$message.error('邮箱格式不正确');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.form.loginUsername,
                        password: this.form.loginPassword
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    // 登录成功，保存 token 和用户信息到 Vuex
                    // 登录成功，保存 token 和用户信息到 Vuex
                    this.$store.dispatch('updateUser', {
                        token: data.token,
                        details: { email: this.form.loginUsername } // 可以根据实际返回的用户信息更新
                    });

                    // 保存 token 到本地存储
                    localStorage.setItem('token', data.token); // 使用 'token' 作为键名


                    // 显示成功消息
                    this.$message.success('登录成功');

                    // 跳转到主页
                    this.$router.push('/Index');
                } else {
                    // 显示失败消息
                    this.$message.error(`登录失败: ${data.msg || '请重试'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                this.$message.error('登录时发生错误，请重试');
            }
        },
        validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
            return re.test(String(email).toLowerCase());
        },





        async register() {
            // 前端验证
            if (!this.form.registerUsername || !this.form.registerEmail || !this.form.registerPassword) {
                this.$message.error('所有字段都是必填的');
                return;
            }

            if (!this.validateEmail(this.form.registerEmail)) {
                this.$message.error('邮箱格式不正确');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.form.registerUsername, // 修改字段名称为 username
                        email: this.form.registerEmail,
                        password: this.form.registerPassword
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    // 注册成功
                    this.$message.success('注册成功');
                    this.showRegister = false; // 切换到登录表单
                } else {
                    // 注册失败，显示后端返回的错误信息
                    this.$message.error(data.msg || '注册失败');
                }
            } catch (error) {
                this.$message.error('请求失败，请稍后重试');
            }
        },


        // 邮箱格式验证函数
        validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
            return re.test(String(email).toLowerCase());
        },


        redirectToOtherPage() {
            // 在这里实现页面跳转
            this.$router.push('/Index') // 将 '/other-page' 替换为您想要跳转的页面路径
        }

    },
    beforeDestroy() {
        // 在组件销毁前销毁 Swiper
        if (this.swiper) {
            this.swiper.destroy()
        }
    },

}
</script> -->
<!-- <style>
/* 修改element-ui文本框点击后的样式 */
.nm-skin-pretty .el-input.is-active .el-input__inner,
.nm-skin-pretty .el-input__inner:focus {
    border: 2px solid #d4d4d4;

    /* 这些可以忽略，加上这些的话，效果会变成点击文本框后
        文本框的长度会以动画形式动态的在1s内变成610px */
    /* transition: 1s; */
    /* width: 610px; */
}
</style> -->
<!-- <style lang="less">
@import '../styles/Entry.less';
</style> -->
