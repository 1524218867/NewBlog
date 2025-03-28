import axios from 'axios';
import { Notification } from 'element-ui';
import router from '../router';

// 创建axios实例
const instance = axios.create();

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // 清除token
      localStorage.removeItem('token');
      
      // 显示友好的提示信息
      Notification.warning({
        title: '登录已过期',
        message: '请重新登录',
        duration: 3000
      });

      // 跳转到登录页面
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default instance;