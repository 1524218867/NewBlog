<template>
  <div class="theme-toggle" @click="toggleTheme" :title="currentTheme === 'light' ? '切换到暗色模式' : '切换到亮色模式'">
    <!-- 太阳图标 -->
    <svg v-if="currentTheme === 'light'" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <!-- 月亮图标 -->
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </div>
</template>

<script>
import themeManager from '../utils/theme';

export default {
  name: 'ThemeToggle',
  data() {
    return {
      currentTheme: themeManager.getCurrentTheme()
    };
  },
  methods: {
    toggleTheme() {
      this.currentTheme = themeManager.toggleTheme();
    }
  },
  mounted() {
    this.currentTheme = themeManager.getCurrentTheme();
  }
};
</script>

<style scoped>
.theme-toggle {
  cursor: pointer;
  padding: 8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  background-color: var(--background-color);
}

.theme-toggle:hover {
  background-color: var(--active-background);
  transform: scale(1.1);
}

.icon {
  width: 24px;
  height: 24px;
  stroke: var(--text-color);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: all 0.3s ease;
}
</style>