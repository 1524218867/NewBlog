import Vue from 'vue';
import Vuex from 'vuex';

// 注册 Vuex 插件
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // 存储全局共享数据（例如跨组件使用的数据）
        sharedData: null,
        hasVisitedHome: false,  // 初始状态为 false
        // 用户信息状态
        user: {
            token: null, // 用于存储用户的 JWT token（通常用于认证）
            details: {} // 存储用户详细信息（如用户名、邮箱等）
        },
    },

    mutations: {
        // 设置共享数据
        setSharedData(state, data) {
            state.sharedData = data; // 将传入的 data 设置到 sharedData 中
        },

        // 设置用户信息
        setUser(state, { token, details }) {
            // 将传入的 token 和 user details 设置到 Vuex 的状态中
            state.user.token = token;
            state.user.details = details;
        },

        // 清空用户信息
        deleteUser(state) {
            state.user = {
                token: null, // 清空 token
                details: {} // 清空用户详情
            };
        },
        setHasVisitedHome(state, status) {
            state.hasVisitedHome = status; // 更新状态
        },
    },

    actions: {
        // 异步更新共享数据，触发 mutation
        updateSharedData({ commit }, data) {
            commit('setSharedData', data); // 提交 mutation 更新 sharedData
        },

        // 异步更新用户信息，触发 mutation
        updateUser({ commit }, { token, details }) {
            console.log('Updating user with:', { token, details });
            // 打印出当前传入的 token 和 details（用于调试）
            commit('setUser', { token, details }); // 提交 mutation 更新用户信息
        },

        // 登出操作，清空用户信息
        logout({ commit }) {
            commit('deleteUser'); // 提交 mutation 清空用户数据
        },
        markVisitedHome({ commit }) {
            commit('setHasVisitedHome', true); // 标记为已访问
        },
        resetVisitedHome({ commit }) {
            commit('setHasVisitedHome', false); // 重置状态
        },
    },

    getters: {
        // 获取用户是否已登录（通过检查 token 是否存在）
        isLoggedIn(state) {
            console.log("在vuex中判断用户是否登录", !!state.user.token);
            return !!state.user.token; // 如果 token 存在，则认为用户已登录，返回 true，否则返回 false
        },

        // 获取用户的详细信息
        getUser(state) {
            return state.user.details; // 返回用户的详细信息（例如用户名、邮箱等）
        },
        hasVisitedHome: (state) => state.hasVisitedHome,
    }
});

export default store; // 导出 Vuex store
