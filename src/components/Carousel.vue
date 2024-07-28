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
            required: true
        }
    },
    data() {
        return {
            currentSlide: 0
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
        }
    },
    beforeDestroy() {
        clearInterval(this.interval);
    }
};
</script>
  
<style scoped>
.carousel-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.carousel-wrapper {
    display: flex;
    transition: transform 0.5s ease-in-out;
}

.carousel-slide {
    min-width: 100%;
    box-sizing: border-box;
}

.carousel-slide img {
    width: 100%;
    height: auto;
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
    background-color: #333;
}

span {
    z-index: 1;
    font-size: inherit;
    font-family: inherit;
    color: white;
    padding: 0.5em 1em;
    outline: none;
    border: none;
    background-color: hsl(236, 32%, 26%);
}

span:hover {
    cursor: pointer;
    animation: jelly 0.5s;
}

@keyframes jelly {

    0%,
    100% {
        transform: scale(1, 1);
    }

    25% {
        transform: scale(0.9, 1.1);
    }

    50% {
        transform: scale(1.1, 0.9);
    }

    75% {
        transform: scale(0.95, 1.05);
    }
}</style>
  