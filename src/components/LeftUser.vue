<!--  -->
<template>
    <div class='LU-left-user'>
        <div class="LU-User" v-if="isLoggedIn">

            <div class="LU-User-card">
                <div class="LU-User-card-inner">
                    <div class="LU-User-card-front">
                        <img class="LU-UserImg" :src="HomegetImageUrl(getUser.avatar)" />
                    </div>
                    <div class="LU-User-card-back" @click="LU_logout">
                        <p>退出</p>
                    </div>
                </div>
            </div>

            <!-- <div class="LU-image-container">

                <img class="LU-UserImg" :src="getUser.avatar" />
            </div> -->
            <div class="LU-UserAvatar">
                <p>{{ getUser.username }}</p>
                <p>{{ getUser.email }}</p>
            </div>
        </div>
        <div class="LU-User" v-else>

            <img class="LU-UserImg" src="../assets/Nologing.png" />

            <div class="LU-UserAvatar">

                <p v-on:click="goToLogin">登录</p>
            </div>
        </div>
        <div class="LU-VueCal">
            <vue-cal :hide-progress="true" class="vuecal--date-picker" xsmall hide-view-selector :time="false"
                active-view="month" :disable-views="['week']" style="width:100%;height: 300px">
            </vue-cal>
        </div>

        <div class="LU-BrowsingHistory" v-if="DisplayContinueReadingZi">

            <div class="LU-card">
                <!-- <div class="LU-image" v-if="DisplayContinueReadingZi">

                    <img :src="getImageUrl(lastViewedArticleZi.coverImage)" alt="Article Cover" />
                </div> -->
                <div class="LU-content" v-if="lastViewedArticleZi">

                    <a href="#">
                        <span class="LU-title">
                            {{ lastViewedArticleZi.title }}
                        </span>
                    </a>

                    <p class="LU-desc">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
                        dolores, possimus pariatur animi temporibus nesciunt praesentium
                    </p>
                    <div class="LU-progress-container">
                        <div class="LU-progress" :style="{ width: JingDuTiaoZi + '%' }">
                        </div>
                    </div>
                    <router-link :to="`/article/${lastViewedArticleZi.articleId}`" class="LU-action">
                        继续阅读
                        <span aria-hidden="true">
                            →
                        </span>

                    </router-link>
                </div>
                <div v-else></div>
                <!-- <div v-else class="LU-LeftUser-card" style="height: 107px;">
                    <div class="LU-LeftUser-card_load"></div>
                    <div class="LU-LeftUser-card_load_extreme_title"></div>
                    <div class="LU-LeftUser-card_load_extreme_descripion"></div>

                </div> -->

            </div>
        </div>

    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { mapGetters } from "vuex"
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        //这里存放数据
        return {
            value: new Date(),

        };
    },
    props: {
        DisplayContinueReadingZi: {
            type: Boolean,
            required: true
        },
        noArticlesMessageZi: {
            type: Boolean,
        },
        lastViewedArticleZi: {
            type: Object,
        },
        JingDuTiaoZi: {
            type: Number,
        }
    },
    //监听属性 类似于data概念
    computed: {
        ...mapGetters(["isLoggedIn", "getUser"]),
    },
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        // getImageUrl(imageName) {
        //     return `http://localhost:3000/UserImg/${imageName}`;
        // },
        HomegetImageUrl(imageName) {
            if (!imageName) {
                // 如果 imageName 为空，返回 null 或空字符串
                return null;
            }

            // 获取当前环境
            const isDevelopment = process.env.NODE_ENV === 'development';

            // 根据环境拼接 URL
            const avatarUrl = isDevelopment
    ? `http://localhost:3000/UserImg${imageName}`  // 开发环境拼接 localhost:3000
    : `${window.location.origin}/UserImg${imageName}`;  // 生产环境需要加上 /UserImg


            console.log('拼接后的请求路径', avatarUrl);

            return avatarUrl;
        },


        goToLogin() {
            this.$router.push("/Login");
        },
        LU_logout() {
            this.$emit('call-parent')
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        console.log("userleft" + this.noArticlesMessageZi);
        console.log('进度是', this.JingDuTiaoZi);
        console.log('文章属性是', this.lastViewedArticleZi);


    },
    beforeCreate() { }, //生命周期 - 创建之前
    beforeMount() { }, //生命周期 - 挂载之前
    beforeUpdate() { }, //生命周期 - 更新之前
    updated() { }, //生命周期 - 更新之后
    beforeDestroy() { }, //生命周期 - 销毁之前
    destroyed() { }, //生命周期 - 销毁完成
    activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>


<style scoped>
.LU-User-card {
    width: 50px;
    /* height: 200px; */
    perspective: 1000px;
}

.LU-User-card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.999s;
}

.LU-User-card:hover .LU-User-card-inner {
    transform: rotateY(180deg);
}

.LU-User-card-front,
.LU-User-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
}

.LU-User-card-front {
    /* background-color: #6A2C70; */
    color: #fff;
    display: flex;
    align-items: center;
    /* border: 10px solid #6A2C70; */
    border-radius: 10px;
    justify-content: center;
    font-size: 24px;
    transform: rotateY(0deg);
}

.LU-User-card-back {
    background-color: var(--active-background-color);
    color: #fff;
    display: flex;
    align-items: center;
    text-align: center;
    line-height: 10px;

    border-radius: 50%;
    justify-content: center;
    font-size: 10px;
    transform: rotateY(180deg);
}

.LU-User-card-back>p {
    margin-bottom: 0 !important;
    color: #ffffff;
}

/* From Uiverse.io by mrhyddenn */
.LU-LeftUser-card {
    width: 290px;
    height: 107px;
    background: var(--ActiveBgc);
    box-shadow: 0 1px 25px var(--Border);
    /* border-radius: 10px; */
    position: absolute;
    padding: 20px;
}

.LU-LeftUser-card::after {
    content: "登录即可查看我的收藏";
    padding-top: 0.5em;
    padding-left: 1.25em;
    position: absolute;
    left: 0;
    bottom: -60px;
    background: var(--active-background-color);
    color: var(--text-color);
    height: 2.5em;
    width: 100%;
    transition: all 80ms;
    font-weight: 600;
    text-transform: uppercase;
    opacity: 0;
}

.LU-LeftUser-card:hover::after {
    bottom: 0;
    opacity: 1;
}

.LU-LeftUser-card_load {
    width: 30%;
    height: 70px;
    position: relative;
    float: left;
    background: linear-gradient(120deg, #e5e5e5 30%, #f0f0f0 38%, #f0f0f0 40%, #e5e5e5 48%);
    border-radius: 50%;
    background-size: 200% 100%;
    background-position: 100% 0;
    animation: load89234 2s infinite;
}

.LU-LeftUser-card_load_extreme_title {
    width: 60%;
    height: 10px;
    position: relative;
    float: right;
    border-radius: 5px;
    background: linear-gradient(120deg, #e5e5e5 30%, #f0f0f0 38%, #f0f0f0 40%, #e5e5e5 48%);
    background-size: 200% 100%;
    background-position: 100% 0;
    animation: load89234 2s infinite;
}

.LU-LeftUser-card_load_extreme_descripion {
    width: 60%;
    height: 47px;
    position: relative;
    float: right;
    border-radius: 5px;
    background: linear-gradient(120deg, #e5e5e5 30%, #f0f0f0 38%, #f0f0f0 40%, #e5e5e5 48%);
    margin-top: 10px;
    background-size: 200% 100%;
    background-position: 100% 0;
    animation: load89234 2s infinite;
}

@keyframes load89234 {
    100% {
        background-position: -100% 0;
    }
}

.LU-left-user {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.LU-User {
    min-width: 175px;
    display: flex;
    width: 80%;
    padding: 17px 17px 17px 17px;
    border: 1px solid var(--Border);
    border-radius: 25px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    margin-top: 20px;
    background-color: var(--ActiveBgc);
}

.LU-UserImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;

}


.LU-User-card-front::before {
    content: '';
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 13px;
    height: 13px;
    border: 3px solid var(--ActiveBgc);
    background-color: #27d0a9;
    border-radius: 50%;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.LU-UserAvatar {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: center;
}

.LU-UserAvatar p {
    margin: 0 0 0 19px;
    color: var(--text-color);
    font-size: 1rem;
}

.LU-Calendar {
    width: 80%;
}

.LU-VueCal {
    margin-top: 40px;
    width: 80%;
    min-width: 175px;
}

/* From Uiverse.io by Javierrocadev */



.LU-progress-container {
    background: #e0e0e0;
    border-radius: 5px;
    height: 7px;
    width: 100%;
    /* Adjust based on your layout */
    position: relative;
}

.LU-progress {
    background: var(--active-background-color);
    height: 100%;
    border-radius: 5px;
    transition: width 0.3s ease;
}

.LU-BrowsingHistory {
    min-width: 175px;
    margin-top: 40px;
    width: 80%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}


/* From Uiverse.io by Yaya12085 */
.LU-card {
    width: 100%;
    height: auto;
    overflow: hidden;
    max-width: 300px;
    border-radius: 25px;
    /* background-color: var(--article-card-background-color); */
    border: 1px solid var(--Border);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

}


.LU-card a {
    text-decoration: none
}

.LU-content {
    padding: 1.1rem;
}

.LU-image {
    object-fit: cover;
    width: 100%;
    height: 150px;
    overflow: hidden;
    background-color: rgb(239, 205, 255);
}

.LU-image>img {

    width: 100%;
    height: 100%;
    object-fit: cover;

}

.LU-title {
    color: var(--text-color);
    font-size: 1.5rem;
    line-height: 1.75rem;
    font-weight: 700;
}

.LU-desc {
    margin-top: 0.5rem;
    color: #6B7280;
    font-size: 0.875rem;
    line-height: 1.25rem;
}

.LU-action {
    display: inline-flex;
    margin-top: 1rem;
    color: #ffffff;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    align-items: center;
    gap: 0.25rem;
    background-color: var(--active-background-color);
    padding: 14px 8px;
    border-radius: 4px;
}

.LU-action span {
    transition: .3s ease;
}

.LU-action:hover span {
    transform: translateX(4px);
}

@media (max-width: 576px) {}

/* 小屏幕（手机横屏） */
@media (min-width: 577px) and (max-width: 768px) {}

/* 中等屏幕（平板） */
@media (min-width: 769px) and (max-width: 992px) {}

/* 大屏幕（小笔记本） */
@media (min-width: 993px) and (max-width: 1200px) {}

/* 超大屏幕（台式机） */
@media (min-width: 1201px) {}
</style>
<style>
.vuecal--date-picker:not(.vuecal--day-view) .vuecal__cell--selected .vuecal__cell-content {
    background-color: var(--active-background-color) !important;
}

.vuecal--date-picker:not(.vuecal--day-view) .vuecal__cell--today .vuecal__cell-content {
    border-color: var(--active-background-color) !important;
}

.vuecal__cell-date {
    color: var(--text-color) !important;
}


.vuecal__weekdays-headings,
.vuecal__all-day {
    padding-right: 0px !important;
}

.vuecal__flex::-webkit-scrollbar {
    display: none !important;
    /* 对于 Chrome 和 Safari */
}

.vuecal__cell--out-of-scope .vuecal__cell-date {

    color: #6B7280 !important;
}

.vuecal__title-bar div {
    font-weight: 800 !important;
}

.vuecal__title-bar>button>i {
    font-size: 10px;

}

.vuecal {
    box-shadow: inset 0 0 0 0px !important;

}

.vuecal__title-bar {
    background-color: rgba(0, 0, 0, 0) !important;
}

.vuecal__title-bar button {
    color: var(--text-color) !important;
}

.vuecal__heading {
    color: #6B7280 !important;
}
</style>