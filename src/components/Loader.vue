<template>
    <div class="scene" v-if="visible">
        <div class="loader"></div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style scoped>
.scene {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--article-card-background-color);
}

.loader {
    box-sizing: border-box;
    position: relative;
    display: block;
    width: 300px;
    /* 调整宽度 */
    height: 100px;
    /* 高度 */
    border: 2px solid var(--text-color);
    border-radius: 3px;
    margin-left: -3px;
}

.loader::after,
.loader::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    height: 86px;
    background: var(--text-color);
    top: 5px;
    /* 调整顶部位置 */
}

.loader::before {
    right: -4px;
    border-radius: 3px;
    width: 4px;
}

.loader::after {
    width: 1px;
    left: 3px;
    animation: full 2s ease-in-out infinite;
}

@keyframes full {
    20% {
        background-color: red;
    }

    45% {
        background-color: yellow;
    }

    to {
        width: 289px;
        /* 调整动画结束时的宽度 */
        background-color: greenyellow;
    }
}
@media (max-width: 576px) {
   
}

/* 小屏幕（手机横屏） */
@media (min-width: 577px) and (max-width: 768px) {}

/* 中等屏幕（平板） */
@media (min-width: 769px) and (max-width: 992px) {}

/* 大屏幕（小笔记本） */
@media (min-width: 993px) and (max-width: 1200px) {}

/* 超大屏幕（台式机） */
@media (min-width: 1201px) {}
</style>