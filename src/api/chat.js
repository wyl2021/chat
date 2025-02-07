import request from '@/utils/request.js'

// 聊天模版

// 聊天模版
export const GetChatTempletList = () => {
  return request({
    method: 'post',
    action: 'GetChatTempletV2',

  })
}

// 按类型获取聊天模版
export const GetChatTempletByType = (data) => {
  return request({
    method: 'post',
    action: 'GetChatTempletByType',
    data
  })
}
// 按id获取聊天模板
export const GetChatTempletById = (data) => {
  return request({
    method: 'post',
    action: 'GetChatTempletById',
    data
  })
}

// 会话
// 会话列表
export const GetChatList = (data) => {
  return request({
    method: 'post',
    action: 'GetChatList',
    data
  })
}

// 对话列表
export const GetChatDetailsTextList = (data) => {
  return request({
    method: 'post',
    action: 'GetChatDetailsTextList',
    data
  })
}

// 收藏或取消收藏

export const SaveChatCollect = (data) => {
  return request({
    method: 'post',
    action: 'SaveChatCollect',
    data
  })
}

// 文本会话

// 创建会话
export const CreateChatText = (data) => {
  return request({
    method: 'post',
    action: 'CreateChatText',
    data
  })
}
// 查询会话
export const GetChatText = (data) => {
  return request({
    method: 'post',
    action: 'GetChatText',
    data
  })
}

// 创建对话流式
// export const CreateChatTextStream = (data) => {
//   return requestAi({
//     method: 'post',
//     responseType: 'stream',
//     action: 'CreateChatTextStream',
//     data
//   })
// }

// 创建图片对话
export const CreateChatImg = (data) => {
  return request({
    method: 'post',
    action: 'CreateChatImg',
    data
  })
}
// 查询图片对话
export const GetChatImg = (data) => {
  return request({
    method: 'post',
    action: 'GetChatImg',
    data
  })
}

// 视频会话

// 创建分片ID
export const GetUploadId = (data) => {
  console.log('创建分片ID',data)
  return request({
    method: 'post',
    action: 'GetUploadId',
    data
  })
}

// 上传分片
export const UploadPart = (data) => {
  return request({
    method: 'post',
    action: 'UploadPart',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',  // 设置文件上传的 Content-Type
    }
  })
}

// 合并分片
export const CompleteMultipartUpload = (data) => {
  return request({
    method: 'post',
    action: 'CompleteMultipartUpload',
    data
  })
}
// 不用分片上传
export const UploadFile = (data) => {
  return request({
    method: 'post',
    action: 'UploadFile',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',  // 设置文件上传的 Content-Type
    }
  })
}

// 创建对话
export const CreateChatVideo = (data) => {
  return request({
    method: 'post',
    action: 'CreateChatVideo',
    data
  })
}

// 查询对话
export const GetChatVideo = (data) => {
  return request({
    method: 'post',
    action: 'GetChatVideo',
    data
  })
}
