<template>
    <div class="login-container">
        <div class="carousel-container">
            <Carousel :slides="carouselItems" />
        </div>
        <div class="form-container">
            <h2>Welcome back!</h2>
            <el-form @submit.native.prevent="handleSubmit">
                <el-form-item>
                    <el-select v-model="form.country" placeholder="Select country">
                        <el-option label="Indonesia (+62)" value="Indonesia (+62)"></el-option>
                        <!-- Add more options as needed -->
                    </el-select>
                </el-form-item>
                <el-form-item class="ELFronDiv">
                    <el-input class="ElInp" v-model="form.phone" placeholder="Phone number"></el-input>
                    <span class="bottom"></span>
                    <span class="right"></span>
                    <span class="top"></span>
                    <span class="left"></span>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form.email" placeholder="Email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form.password" type="password" placeholder="Password"></el-input>
                </el-form-item>
                <el-button type="primary" class="BtnAft" @click="handleSubmit" block>Create account</el-button>
            </el-form>
            <div class="signin-link">
                <small>Already have an account? <a href="#">Sign in</a></small>
            </div>
            <div class="social-buttons">
                <el-button type="default" block>Continue with Google</el-button>
                <el-button type="default" block>Continue with Apple</el-button>
                <el-button type="default" block>Continue with Twitter</el-button>
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

.ELFronDiv {
    position: relative;
}

.ELFronDiv .ElInp {
    width: 100%;
}

.ELFronDiv span {
    position: absolute;
    background-color: #000;
    transition: all 0.3s;
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
  