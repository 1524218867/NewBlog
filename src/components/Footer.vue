<template>
  <div class="footer">
    <div class="footer-content">
      <div class="footer-info">
        <p>如有问题请联系站长：<a href="mailto:admin@cloudwhisper.com">18569923150@163.com</a></p>
        <p>© {{ currentYear }} 云端轻语 - 版权所有</p>
        <p><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">豫ICP备2024101096号</a></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style scoped>
.footer {
  width: 100%;
  padding: 20px 0;
  margin-top: 30px;
  border-top: 1px solid var(--Border);
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-info {
  text-align: center;
}

.footer-info p {
  margin: 5px 0;
  font-size: 14px;
  color: var(--text-color);
  opacity: 0.8;
}

.footer-info a {
  color: var(--active-background-color);
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.footer-info a:hover {
  opacity: 0.8;
}

/* 响应式调整 */
@media (max-width: 576px) {
  .footer {
    padding: 15px 0;
    margin-top: 20px;
  }
  
  .footer-info p {
    font-size: 12px;
  }
}
</style>