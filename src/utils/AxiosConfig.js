import axios from "axios";
import API from "@/router/API";

export const initAxiosConfig = (Vue, router) => {
    console.log(Vue)
    console.log(router)
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        Vue.prototype.$bus.$emit("showLoading", true);
        //如果不是获取token的URL则拦截
        if (!(config.url === API.OAUTH_TOKEN || config.url === API.USERINFO)) {
            let token = Vue.prototype.$cookies.get('token');

            // token过期、失效或者不存在
            if (!token) {
                router.push("/login")
            }
            if (token.access_token) {
                config.headers.common['Authorization'] = 'Bearer ' + token.access_token
            }
        }
        return config;
    }, function (error) {
        console.log(error)
        // Do something with request error
        return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
        // Do something with response data
        Vue.prototype.$bus.$emit("showLoading", false);
        return response;
    }, function (err) {
        //==============  错误处理  ====================
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '请求错误(400)';
                    break;
                case 401:
                    err.message = '未授权，请重新登录(401)';
                    break;
                case 403:
                    err.message = '拒绝访问(403)';
                    break;
                case 404:
                    err.message = '请求出错(404)';
                    break;
                case 408:
                    err.message = '请求超时(408)';
                    break;
                case 500:
                    err.message = '服务器错误(500)';
                    break;
                case 501:
                    err.message = '服务未实现(501)';
                    break;
                case 502:
                    err.message = '网络错误(502)';
                    break;
                case 503:
                    err.message = '服务不可用(503)';
                    break;
                case 504:
                    err.message = '网络超时(504)';
                    break;
                case 505:
                    err.message = 'HTTP版本不受支持(505)';
                    break;
                default:
                    err.message = `连接出错(${err.response.status})!`;
            }
        } else {
            err.message = '连接服务器失败!'
        }

        Vue.prototype.$bus.$emit("showLoading", false);
        Vue.prototype.$bus.$emit("showAxiosMessage", {
            show: true,
            code: err.response.status,
            text: err.message,
            timeout: 3000,
            color: "red"
        });
        return Promise.reject(err);
    });
}