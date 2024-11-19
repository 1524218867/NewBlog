<template>
    <div class="settings">
        <h2>设置</h2>
        <input type="checkbox" class="theme-checkbox" @click="toggleTheme" :checked="currentTheme === 'dark'">
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentTheme: 'light'  // 默认主题
        };
    },
    methods: {
        toggleTheme() {
            // 切换主题状态
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';

            // 通过事件通知父组件主题切换
            this.$emit('themeChanged', this.currentTheme);

            // 将当前主题保存到 localStorage
            localStorage.setItem('theme', this.currentTheme);
        },
        async uploadAvatar(event) {//上传头像
            // 获取用户选择的文件
            const file = event.target.files[0]; // 获取文件输入框中的第一个文件
            const formData = new FormData(); // 创建一个 FormData 对象以便上传文件
            formData.append("avatar", file); // 将文件附加到 FormData 对象，键名为 "avatar"

            try {
                // 发送 POST 请求以更新用户头像
                const response = await axios.post(
                    "http://localhost:5000/api/user/update-avatar", // 目标 API 地址
                    formData, // 发送的 FormData 对象
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`, // 添加认证头，包含用户的 token
                        },
                    }
                );

                // 更新 Vuex 中的用户信息，设置新的头像地址
                this.getUser.avatar = response.data.avatar; // 从响应中获取新的头像 URL 并更新


            } catch (error) {
                // 捕获并处理可能的错误
                console.error("Error updating avatar:", error); // 在控制台输出错误信息
            }
        },
    },
    mounted() {
        // 初始化时获取本地存储的主题状态
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            this.$emit('themeChanged', this.currentTheme);  // 通知父组件应用已保存的主题
        }
    }
};
</script>

<style scoped>
.settings {
    padding: 20px;
}

/* 主题切换按钮样式 */
.theme-checkbox {
    --toggle-size: 16px;
    appearance: none;
    width: 6.25em;
    height: 3.125em;
    background: linear-gradient(to right, #efefef 50%, #2a2a2a 50%) no-repeat;
    background-size: 205%;
    background-position: 0;
    transition: 0.4s;
    border-radius: 99em;
    position: relative;
    cursor: pointer;
    font-size: var(--toggle-size);
}

.theme-checkbox::before {
    content: "";
    width: 2.25em;
    height: 2.25em;
    position: absolute;
    top: 0.438em;
    left: 0.438em;
    background: linear-gradient(to right, #efefef 50%, #2a2a2a 50%) no-repeat;
    background-size: 205%;
    background-position: 100%;
    border-radius: 50%;
    transition: 0.4s;
}

.theme-checkbox:checked::before {
    left: calc(100% - 2.25em - 0.438em);
    background-position: 0;
}

.theme-checkbox:checked {
    background-position: 100%;
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
