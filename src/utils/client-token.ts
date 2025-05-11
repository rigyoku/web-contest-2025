import { PATH } from '@/constants/path';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API } from '@/constants/api';

export type ClientTokens = {
    token: string,
    refreshToken: string,
}

export const saveToken = ({ token, refreshToken }: ClientTokens) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
};

export const cleanToken = () => {
    // 清除本地存储并跳转登录页
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    if (window.location.pathname !== PATH.SIGN_IN) {
        window.location.pathname = PATH.SIGN_IN;
    }
};

// 创建axios实例
export const Axios: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
});

// 请求拦截器
Axios.interceptors.request.use(
    async (config) => {
        // 从localStorage获取token
        const token = localStorage.getItem('token');

        if (token) {
            config.headers = config.headers || {};
            config.headers.token = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
Axios.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // 处理401未授权错误
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // 尝试刷新token
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await fetch(API.ADMIN.REFRESH_TOKEN, {
                        method: 'POST',
                        headers: {
                            refreshToken,
                        },
                    });
                    if (response.ok) {
                        const tokens: ClientTokens = await response.json();
                        if (tokens) {
                            saveToken(tokens);
                            // 重试原始请求
                            originalRequest.headers.token = tokens.token;
                            return Axios(originalRequest);
                        }
                    }
                }
                cleanToken();
            } catch (refreshError) {
                cleanToken();
                console.error('刷新token失败:', refreshError);
            }
        }
        return Promise.reject(error);
    }
);