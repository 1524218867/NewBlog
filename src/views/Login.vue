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
import Carousel from '@/components/Carousel.vue';

export default {
    components: {
        Carousel
    },
    data() {
        return {
            form: {
                country: '',
                phone: '',
                email: '',
                password: ''
            },
            carouselItems: [
                { id: 1, src: 'demoimg.png', quote: '“The 66chat\'s flexibility is truly remarkable. It effortlessly adapts to a wide range of research methodologies and study designs.”', author: 'Pablo Escanor - UX Researcher' },
                { id: 2, src: 'demoimg.png', quote: '“Another quote here.”', author: 'Author 2' },
                { id: 3, src: 'demoimg.png', quote: '“Yet another quote here.”', author: 'Author 3' }
            ]
        };
    },
    methods: {
        handleSubmit() {
            console.log('Form submitted:', this.form);
            // Handle form submission logic here
        }
    }
};
</script>
  
<style scoped>
html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

#app {
    height: 100%;
}

.login-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background-color: #f5f5f5;
    flex-direction: column;
    /* Default to column for mobile */
}

.carousel-container {
    width: 100%;
    height: 50%;
    /* Adjust height for mobile */
}

.form-container {
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
}

.form-container h2 {
    margin-bottom: 20px;
}

.signin-link {
    margin-top: 20px;
    text-align: center;
}

.social-buttons {
    margin-top: 20px;
}

.social-buttons .el-button {
    margin-bottom: 10px;
}

/* Media query for larger screens */
@media (min-width: 768px) {
    .login-container {
        flex-direction: row;
    }

    .carousel-container {
        width: 50%;
        height: 100%;
    }

    .form-container {
        width: 50%;
        padding: 30px;
    }
}

.BtnAft {
    z-index: 1;
    position: relative;
    font-size: inherit;
    font-family: inherit;
    color: white;
    padding: 0.5em 1em;
    outline: none;
    border: none;
    background-color: hsl(236, 32%, 26%);
    overflow: hidden;
    cursor: pointer;
}

.BtnAft::after {
    content: '';
    z-index: -1;
    background-color: hsla(0, 0%, 100%, 0.2);
    position: absolute;
    top: -50%;
    bottom: -50%;
    width: 1.25em;
    transform: translate3d(-560%, 0, 0) rotate(35deg);
}

.BtnAft:hover::after {
    transition: transform 0.45s ease-in-out;
    transform: translate3d(200%, 0, 0) rotate(35deg);
}

.ELFronDiv {

    position: relative;

}
</style>