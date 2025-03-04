import request from '@/utils/request'
// 登录
export const accountLogin=(data)=>{
    return request({
        method:'post',
        action:'login',
        data
    })
}
// 手机登录时发送短信
export const sendLogCode=(data)=>{
    return request({
        method:'post',
        action:'sendLogCode',
        data
    })
}
// oa登录
export const oaLogin=(data)=>{
    return request({
        method:'get',
        action:'oaLogin',
        data
    })
}
// sws登录
export const swsLogin=(data)=>{
    return request({
        method:'get',
        action:'swsLogin',
        data
    })
}
// 用户注册
export const register=(data)=>{
    return request({
        method:'post',
        action:'register',
        data
    })
}
// 手机注册时发送短信
export const sendRegisterCode=(data)=>{
    return request({
        method:'post',
        action:'sendRegisterCode',
        data
    })
}
// 找回密码发送短信
export const sendForgotPasswordCode=(data)=>{
    return request({
        method:'post',
        action:'sendForgotPasswordCode',
        data
    })
}
// 找回密码
export const recoverPassword=(data)=>{
    return request({
        method:'post',
        action:'recoverPassword',
        data
    })
}
// 修改信息
export const updUser=(data)=>{
    return request({
        method:'post',
        action:'updUser',
        data
    })
}

// 获取登录用户信息
export const getUserInfo=(data)=>{
    return request({
        method:'post',
        action:'getUserInfo',
        data
    })
}