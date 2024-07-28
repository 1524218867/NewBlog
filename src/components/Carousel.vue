<template>
    <div class="carousel-container">
        <div class="carousel-wrapper" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div class="carousel-slide" v-for="(slide, index) in slides" :key="index">
                <img :src="require(`@/assets/${slide.src}`)" alt="carousel image" />
                <div class="quote">{{ slide.quote }}</div>
                <div class="author">{{ slide.author }}</div>
            </div>
        </div>
        <div class="carousel-pagination">
            <span v-for="(slide, index) in slides" :key="index" class="pagination-dot"
                :class="{ active: index === currentSlide }" @click="goToSlide(index)"></span>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        slides: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            currentSlide: 0,
        };
    },
    mounted() {
        this.startAutoPlay();
    },
    methods: {
        startAutoPlay() {
            this.interval = setInterval(() => {
                this.nextSlide();
            }, 2500);
        },
        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        },
        goToSlide(index) {
            this.currentSlide = index;
        },
    },
    beforeDestroy() {
        clearInterval(this.interval);
    },
};
</script>
  
<style scoped>
.carousel-container {
    margin: 10px;
    position: relative;
    width: calc(100% - 20px);
    height: calc(100vh - 20px);
    overflow: hidden;
}

.carousel-wrapper {
    height: 100%;
    display: flex;
    transition: transform 0.5s ease-in-out;
}

.carousel-slide {
    position: relative;
    min-width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.carousel-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.carousel-pagination {
    position: absolute;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.pagination-dot {
    width: 20px;
    height: 5px;
    margin: 0 5px;
    background-color: #ccc;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.pagination-dot.active {
    background: linear-gradient(to right, red, purple, blue);
}

.quote {
    position: absolute;
    bottom: 100px;
    left: 20px;
    color: white;
    font-size: 1em;
}

.author {
    position: absolute;
    bottom: 70px;
    left: 20px;
    color: white;
    font-size: 1em;
}
</style>
