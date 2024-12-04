import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        sharedData: null,
        user: {
            token: null, // 用于存储 JWT token
            details: {} // 用于存储用户详细信息
        },
        
    },
    mutations: {
        setSharedData(state, data) {
            state.sharedData = data;
        },
        setUser(state, { token, details }) {
            state.user.token = token;
            state.user.details = details;
        },
        deleteUser(state) {
            state.user = {
                token: null,
                details: {}
            }; // 清空用户信息
        },
       
    },
    actions: {
        updateSharedData({ commit }, data) {
            commit('setSharedData', data);
        },
        updateUser({ commit }, { token, details }) {
            console.log('Updating user with:', { token, details }); //会先打印此处的数据，然后打印登录的数据
            commit('setUser', { token, details });
        },
        logout({ commit }) {
            commit('deleteUser');
        },
      
    },
    getters: {
        isLoggedIn(state) {
            console.log("在vuex中判断用户是否登录", !!state.user.token);
            return !!state.user.token; // 判断用户是否登录


        },
        getUser(state) {
            return state.user.details; // 获取用户详细信息
        }
    }
});

export default store;
