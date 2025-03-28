// 主题配置管理
const themes = {
    light: {
        '--primary-color': '#3498db',
        '--secondary-background': '#f8f9ff',  // 原 --ZiBaiBgc
        '--active-background': '#f7f7f8',     // 原 --ActiveBgc
        '--background-color': '#ffffff',
        '--border-color': '#f0f1fb',          // 原 --Border
        '--text-color': '#000000',
        '--text-color-secondary': '#666666',  // 次要文本颜色
        '--button-color': '#1988fa',          // 原 --active-background-color
        '--button-color-rgb': '25, 136, 250', // RGB值用于透明度设置
        '--card-background': '#f5f5f5',       // 原 --article-card-background-color
        '--gradient-primary': 'linear-gradient(to right, #1988fa 0%, #33c4f9 50%, #00f2fe 100%)',  // 原 --Business-card-gradient
        '--shadow-color': 'rgba(0, 0, 0, 0.1)',  // 阴影颜色
        '--shadow-color-strong': 'rgba(0, 0, 0, 0.15)'  // 强阴影颜色
    },
    dark: {
        '--primary-color': '#808080',
        '--secondary-background': '#1a1a1a',
        '--active-background': '#2a2a2a',
        '--background-color': '#121212',
        '--border-color': '#333333',
        '--text-color': '#e0e0e0',
        '--text-color-secondary': '#999999',  // 次要文本颜色
        '--button-color': '#666666',
        '--button-color-rgb': '102, 102, 102', // RGB值用于透明度设置
        '--card-background': '#1f1f1f',
        '--gradient-primary': 'linear-gradient(to right, #4a4a4a 0%, #666666 50%, #808080 100%)',
        '--shadow-color': 'rgba(255, 255, 255, 0.05)',  // 暗色主题阴影颜色
        '--shadow-color-strong': 'rgba(255, 255, 255, 0.08)'  // 暗色主题强阴影颜色
    }
};

// 主题管理类
class ThemeManager {
    constructor() {
        if (!themes || !themes.light || !themes.dark) {
            throw new Error('主题配置未正确初始化');
        }
        this.themes = themes;
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.initTheme();
        
        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
            }
        });
    }

    // 初始化主题
    initTheme() {
        this.applyTheme(this.currentTheme);
    }

    // 切换主题
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        return this.currentTheme;
    }

    // 应用主题
    applyTheme(themeName) {
        const theme = themes[themeName];
        for (const [key, value] of Object.entries(theme)) {
            document.documentElement.style.setProperty(key, value);
        }
    }

    // 获取当前主题
    getCurrentTheme() {
        return this.currentTheme;
    }
}

export default new ThemeManager();