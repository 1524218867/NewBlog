<template>
    <div class="login-container">
        <div class="carousel-container">
            <Carousel :slides="carouselItems" />
        </div>
        <div class="form-container">
            <h2>Welcome back!</h2>
            <el-form @submit.native.prevent="handleSubmit" class="ElFrom">
                <el-form-item>
                    <el-select v-model="form.country" placeholder="Select country">
                        <el-option label="Indonesia (+62)" value="Indonesia (+62)"></el-option>
                        <!-- Add more options as needed -->
                    </el-select>
                </el-form-item>
                <el-form-item class="ELFronDiv">
                    <el-input class="ElInp" v-model="form.phone" placeholder="Phone number"></el-input>

                </el-form-item>
                <el-form-item>
                    <el-input class="ElInp" v-model="form.email" placeholder="Email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input class="ElInp" v-model="form.password" type="password" placeholder="Password"></el-input>
                </el-form-item>
                <el-button type="primary" class="BtnAft" @click="handleSubmit" block>Create account</el-button>
            </el-form>
            <div class="divider">
                <span class="line"></span>
                <span class="text">or</span>
                <span class="line"></span>
            </div>
            <div class="signin-link">
                <small>Already have an account? <a href="#">Sign in</a></small>
            </div>
            <div class="social-buttons">
                <el-button class="FengXiangBtn" type="default" block>Continue with Google</el-button>
                <el-button class="FengXiangBtn" type="default" block>Continue with Apple</el-button>
                <el-button class="FengXiangBtn" type="default" block>Continue with Twitter</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import Carousel from '../components/Carousel.vue'; // 导入 Carousel 组件

export default {
    components: {
        Carousel, // 注册 Carousel 组件
    },
    data() {
        return {
            form: {
                country: '',
                phone: '',
                email: '',
                password: '',
            },
            carouselItems: [
                { id: 1, src: '1.jpg', quote: '“The 66chat\'s flexibility is truly remarkable. It effortlessly adapts to a wide range of research methodologies and study designs.”', author: 'Pablo Escanor - UX Researcher' },
                { id: 2, src: '1.jpg', quote: '“Another quote here.”', author: 'Author 2' },
                { id: 3, src: '1.jpg', quote: '“Yet another quote here.”', author: 'Author 3' }
            ],
        };
    },
    methods: {
        handleSubmit() {
            // Handle form submission
        },
    },
};
</script>
  
<style scoped>
.login-container {
    display: flex;
    height: 100vh;
}

.carousel-container {
    flex: 1;
    /* background: #000; */
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;

}

.form-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    background: #fff;

}

.form-container>h2 {
    text-align: center !important;
    margin-bottom: 2rem !important;
    font-size: 2.5rem;
    font-weight: 600;
}

.ElFrom {
    text-align: center;
}

.ElInp {
    width: 60% !important;
    margin: auto;

}

.ElInp>>>.el-input__inner {
    border-radius: 8px !important;
    padding: 23px;
}


.BtnAft {
    width: 60% !important;
    background-color: black !important;
    color: white;
    border-radius: 8px !important;
    padding: 16px;
}

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px auto;
    width: 60%;
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
    margin: 0px auto 20px;
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
    width: 60% !important;
    margin: 10px auto;
    border-radius: 8px !important;
    padding: 16px;
}

/* 媒体查询确保移动设备的兼容性 */
@media (max-width: 768px) {
    .login-container {
        flex-direction: column;
    }

    .carousel-container {
        order: 1;
        /* 轮播图在上面 */
        height: 415px;
    }

    .form-container {
        order: 2;
        /* 表单在下面 */
        padding: 1rem;
    }
}
</style>

  