<template>
    <div class="login-container" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp">
        <div class="carousel-container">
            <Carousel :slides="carouselItems" />
        </div>
        <div class="card-container">
            <transition name="fade">
                <div v-if="isLoginForm" class="card">
                    <div class="card-inner">
                        <div class="card-front">

                            <LoginForm :form="form" :toggleForm="toggleForm" @submit="handleLoginSubmit" />
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!isLoginForm" class="card">
                    <div class="card-inner">
                        <div class="card-back">
                            <RegisterForm :form="form" :toggleForm="toggleForm" @submit="handleRegisterSubmit" />
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
import { Notification } from 'element-ui'; // 引入 Element UI 的 Notification
export default {
    components: {
        Carousel,
        LoginForm,
        RegisterForm
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
            isLoginForm: true,
            mouseDownX: 0,
            mouseUpX: 0,
            isMouseDown: false,
        };
    },
    methods: {
        handleLoginSubmit() {
            // 处理登录表单提交
        },
        handleRegisterSubmit() {
            // 处理注册表单提交
        },
        toggleForm() {
            this.isLoginForm = !this.isLoginForm;
        },
        handleMouseDown(event) {
            this.isMouseDown = true;
            this.mouseDownX = event.screenX;
        },
        handleMouseMove(event) {
            if (this.isMouseDown) {
                this.mouseUpX = event.screenX;
            }
        },
        handleMouseUp() {
            this.isMouseDown = false;
            if (this.mouseUpX - this.mouseDownX > 100) {
                this.goBack();
            }
        },
        goBack() {
            window.history.back();
        },
        showWelcomeNotification() {
            this.$nextTick(() => {
                setTimeout(() => {
                    Notification({
                        title: 'Welcome!',
                        message: 'Welcome 如需退出按住鼠标右滑.',
                        type: 'info',
                        duration: 4000, // 显示4秒
                        offset: 20, // 距离顶部20px
                    });
                }, 2000); // 延迟2秒显示弹框
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
}

.carousel-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
}

.card-container {
    flex: 1;
    position: relative;

    border: 0 !important;
}

.card {
    width: 100%;
    position: absolute;
    height: 100%;
    border: 0;
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

.card-back {}

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
    }

    .carousel-container {
        order: 1;
        height: 415px;
        flex: 1;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        border-radius: 15px;
    }

    .card-container {
        order: 2;
        width: 100%;
        max-width: 100%;
    }

    .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

}
</style>
