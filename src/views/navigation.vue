<template>
    <div>

        <button @click="navigateToArticle1">Go to Article 1</button>
        <button @click="navigateToArticle2">Go to Article 2</button>
    </div>
</template>
  
<script>
export default {
    methods: {
        navigateToArticle1() {
            // 导航到 /article/:id 路由，其中 id 为特定 UUID
            this.$router.push({ name: 'Article', params: { id: '61384383-baab-4d16-a283-7ad1414712a6' } });
        },
        navigateToArticle2() {
            this.$router.push({ name: 'Article', params: { id: 'eff867d9-721d-4c64-a2a1-522fbc639563' } });
        },
    },
};
</script>
  