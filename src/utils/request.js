import axios from 'axios'
import Router from "@/router/router"
import ElementUI from 'element-ui';
const service = axios.create({
    baseURL: 'http://www.swsai.com/api/v1.ashx',
    timeout: 10000,
})

// 拦截请求
service.interceptors.request.use(config => {

    const token = ''
    if (config.method === 'post') {
        config.data = {
            ...config.data,
            token: token,
            action: config.action
        };
    } else {
        config.params = {
            ...config.params, 
            token: token,
            action: config.action
        };
    }
    return config
}, err => {
    return Promise.reject(err)
})
// 拦截响应
service.interceptors.response.use(response => {
    let res = response.data;
    let msg = res.msg || "请求失败";
    console.log(res)
    if (res.code === -1) {
        // message.warning(msg);
        Router.push({
            path: '/login'
        });
        return Promise.reject(msg)
    } else {
        return Promise.resolve(res)
    }
}, err => {
    ElementUI.Message.error(err)    
})

export default service