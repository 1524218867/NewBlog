<template>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in carouselItems" :key="item.id">
                <img :src="item.src" alt="Slide Image" class="slide-image">
                <div class="quote">{{ item.quote }}</div>
                <div class="author">{{ item.author }}</div>
            </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->
        <!-- 这里可以添加导航按钮的样式 -->
    </div>
</template>
  
<script>
import Swiper from 'swiper';
import 'swiper/css/swiper.css';

export default {
    props: {
        carouselItems: {
            type: Array,
            required: true,
        },
    },
    mounted() {
        new Swiper('.swiper-container', {
            autoplay: {
                delay: 3000, // 自动播放的时间间隔（毫秒）
                disableOnInteraction: false, // 用户交互后不禁用自动播放
            },
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: (index, className) => {
                    return `<span class="${className} custom-bullet"></span>`;
                },

            },
            allowTouchMove: false, // 禁用触摸滑动
        });
    },
};
</script>

<style scoped>
/* 轮播图内视图的宽高 */
.swiper-container {
    border-radius: 15px;
    width: 100%;
    height: 98vh;
    /* 适应整个视口高度 */
    position: relative;
    /* 使分页器和导航按钮可以绝对定位 */
}

.swiper-wrapper {
    height: 100%;
}

.swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
    position: relative;
    /* 使引用和作者可以绝对定位 */
}

.slide-image {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    pointer-events: none;
    /* 禁用所有指针事件 */
    /* 保持图片比例并覆盖整个容器 */
    user-select: none;
    /* 适用于现代浏览器 */
    -webkit-user-select: none;
    /* 针对 WebKit 浏览器 */
    -moz-user-select: none;
    /* 针对 Firefox 浏览器 */
    -ms-user-select: none;
    /* 针对 Internet Explorer 和 Edge */
}

.quote {
    position: absolute;
    bottom: 12%;
    left: 20px;
    font-size: 1.5em;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    user-select: none;
    /* 禁止文本选择 */
}

.author {
    position: absolute;
    bottom: 20%;
    left: 20px;
    font-size: 1.2em;
    color: white;
    user-select: none;
    /* 禁止文本选择 */
}




/* 轮播图在移动端的宽高 */
@media (max-width: 768px) {
    .swiper-container {
        width: 100%;
        height: 415px;
        /* 适应整个视口高度 */
        position: relative;
        /* 使分页器和导航按钮可以绝对定位 */
    }

    .quote {
        position: absolute;
        bottom: 14%;
        left: 20px;
        font-size: 1em;
        color: white;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }

    .author {
        position: absolute;
        bottom: 25%;
        left: 20px;
        font-size: 1em;
        color: white;
    }
}
</style>
<style>
/* 分页器样式 */
/* .swiper-pagination {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
} */

.custom-bullet {
    background: #fff;

    width: 15%;
    height: 5px;
    border-radius: 30px;
    margin: 0 5px;
    opacity: 1;
    transition: background-color 0.3s;
    display: inline-block;
    text-align: center;
    line-height: 12px;
    color: white;
    font-size: 10px;
}

.swiper-pagination-bullet-active {
    background: linear-gradient(to right, red, purple, blue);
}
</style>
