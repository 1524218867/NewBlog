<template>
    <div class="login-container" @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp">
        <!-- <transition name="fade">
            <Loader v-if="isLoading" :visible="isLoading" />
        </transition> -->
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
// import Loader from "@/components/Loader.vue";
export default {
    components: {
        Carousel,
        LoginForm,
        RegisterForm,
        // Loader
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
                {
                    id: 1, src: 'LunBoTuImg1.jpg', quote: '“你在哪里投入，结果就在哪里显现.”', author: '(Where you invest, results will show.)'
                },
                { id: 2, src: 'LunBoTuImg2.jpg', quote: '“做你热爱的事，然后把它做得尽善尽美.”', author: '(Do what you love and do it well)' },
                { id: 3, src: 'LunBoTuImg3.jpg', quote: '“如果你对某件事情充满热情，就不要担心失败。坚持下去，成功自然会来.”', author: "(If you're passionate about something, don't worry about failure. Keep at it and success will come naturally)" },
                { id: 4, src: 'LunBoTuImg4.jpg', quote: '“梦想不会逃跑，逃跑的只是你自己.”', author: "(Dreams don't run away, only you run away)" },
                { id: 5, src: 'LunBoTuImg5.jpg', quote: '“你不能改变过去，但你可以改变未来.” ', author: "(You can't change the past, but you can change the future)" }
            ],
            isLoginForm: true,
            mouseDownX: 0,
            mouseUpX: 0,
            isMouseDown: false,
            // isLoading: true, // 是否显示加载器
        };
    },
    methods: {
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
            if (this.mouseUpX - this.mouseDownX > 500) {
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
                        duration: 4000,
                        offset: 20,
                    });
                }, 2000);
            });
        },
        handleTouchStart() { /* Implement touch start logic */ },
        handleTouchMove() { /* Implement touch move logic */ },
        handleTouchEnd() { /* Implement touch end logic */ }
    },
    mounted() {
        // this.isLoading = false;// 关闭加载器
        this.showWelcomeNotification();
        window.addEventListener('touchstart', this.handleTouchStart);
        window.addEventListener('touchmove', this.handleTouchMove);
        window.addEventListener('touchend', this.handleTouchEnd);
    },
    beforeDestroy() {
        window.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('touchend', this.handleTouchEnd);
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
}

/* 轮播图外视图的宽高，控制轮播图的位置，父元素有flex */
.carousel-container {
    /* flex: 1; */
    width: 50%;
    height: 98vh;
    margin: 10px 10px 10px 10px;
}

.card-container {
    flex: 1;
    position: relative;
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
    }

    /* 轮播图在移动端的宽高这里是外视图 */
    .carousel-container {
        order: 1;
        height: 415px;
        width: 95%;
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
