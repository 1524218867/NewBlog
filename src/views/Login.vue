<template>
    <div class="login-container">
        <div v-if="!isLoading" class="carousel-container">
            <Carousel :carousel-items="carouselItems" />
        </div>
        <div class="card-container">
            <transition name="fade">
                <div v-if="isLoginForm" class="card">
                    <div class="card-inner">
                        <div class="card-front">
                            <LoginForm :form="form" :toggleForm="toggleForm" />
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!isLoginForm" class="card">
                    <div class="card-inner">
                        <div class="card-back">
                            <RegisterForm :form="form" :toggleForm="toggleForm" />
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import Carousel from '../components/Carousel.vue';
import LoginForm from '../components/LoginForm.vue';
import RegisterForm from '../components/RegisterForm.vue';
import { Notification } from 'element-ui';
import LunBoTuImg1 from '@/assets/LunBoTuImg1.jpg';
import LunBoTuImg2 from '@/assets/LunBoTuImg2.jpg';
import LunBoTuImg3 from '@/assets/LunBoTuImg3.jpg';
import LunBoTuImg4 from '@/assets/LunBoTuImg4.jpg';
import LunBoTuImg5 from '@/assets/LunBoTuImg5.jpg';

export default {
    components: {
        Carousel,
        LoginForm,
        RegisterForm,
    },
    data() {
        return {
            isLoading: false,
            form: {
                country: '',
                phone: '',
                email: '',
                password: '',
            },
            carouselItems: [
                {
                    id: 1,
                    src: LunBoTuImg1,
                    quote: '"今天的努力，就是明天的光芒。"',
                    author: '(Today\'s efforts are tomorrow\'s brilliance.)'
                },
                { id: 2, src: LunBoTuImg2, quote: '"学习是一场永不止步的旅程。"', author: '(Learning is a never-ending journey.)' },
                { id: 3, src: LunBoTuImg3, quote: '"成功不是偶然，而是日积月累。"', author: '(Success is not accidental, but accumulated day by day.)' },
                { id: 4, src: LunBoTuImg4, quote: '"勇气不是没有恐惧，而是战胜恐惧。"', author: '(Courage is not the absence of fear, but the triumph over it.)' },
                { id: 5, src: LunBoTuImg5, quote: '"每一个选择都是新的开始。"', author: '(Every choice is a new beginning.)' }
            ],
            isLoginForm: true,
        };
    },
    methods: {
        toggleForm() {
            this.isLoginForm = !this.isLoginForm;
        },
        showWelcomeNotification() {
            this.$nextTick(() => {
                setTimeout(() => {
                    Notification({
                        title: 'Welcome!',
                        message: 'Welcome to our platform!',
                        type: 'info',
                        duration: 4000,
                        offset: 20,
                    });
                }, 2000);
            });
        },
    },
    mounted() {
        this.showWelcomeNotification();
    },
};
</script>

<style scoped>
.login-container {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    position: relative;
    background: var(--background-color);
    overflow: hidden;
}

/* 轮播图外视图的宽高，控制轮播图的位置，父元素有flex */
.carousel-container {
    width: 50%;
    height: 98vh;
    margin: 10px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.card-container {
    flex: 1;
    position: relative;
    padding: 20px;
    max-width: 600px;
}

.card {
    width: 100%;
    position: absolute;
    height: 100%;
    border: 0;
    background: var(--background-color);
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    margin: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.card-front,
.card-back {
    position: absolute;
    width: 100%;
    border-radius: 10px;
}

.card-front {
    background: #fff;
}

.card-back {
    /* card-back 的样式可以根据需要自定义 */
}

/* 定义淡入淡出效果 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}

@media (max-width: 768px) {
    .login-container {
        flex-direction: column;
        padding: 20px;
        height: auto;
        min-height: 100vh;
    }

    .carousel-container {
        order: 1;
        height: 100%;
        width: 100%;
        margin: 0 0 20px 0;
        border-radius: 15px;
    }

    .card-container {
        order: 2;
        width: 100%;
        max-width: 100%;
        padding: 0;
        margin-bottom: 20px;
    }

    .card {
        position: relative;
        height: auto;
        min-height: 400px;
    }

    .card-inner {
        width: 100%;
        height: auto;
        min-height: 650px;
        margin: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
}
</style>
