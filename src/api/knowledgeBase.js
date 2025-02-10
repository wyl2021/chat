import request from '@/utils/request.js'
// 知识库

// 我的知识库列表
export const GetKnowledgeBaseList=(data)=>{
    return request({
        method: 'post',
        action: 'GetKnowledgeBaseList',
        data
      })
}
// 修改知识库
export const SaveKnowledgeBase=(data)=>{
    return request({
        method: 'post',
        action: 'SaveKnowledgeBase',
        data
      })
}

// 删除知识库
export const DelKnowledgeBase=(data)=>{
    return request({
        method: 'post',
        action: 'DelKnowledgeBase',
        data
      })
}
// 我的知识库详情列表
export const GetKnowledgeBaseListD=(data)=>{
    return request({
        method: 'post',
        action: 'GetKnowledgeBaseListD',
        data
      })
}
// 修改知识库详情
export const SaveKnowledgeBaseD=(data)=>{
    return request({
        method: 'post',
        action: 'SaveKnowledgeBaseD',
        data
      })
}
// 知识库详情内容
export const GetKnowledgeBaseToContentsD=(data)=>{
    return request({
        method: 'post',
        action: 'GetKnowledgeBaseToContentsD',
        data
      })
}
// 删除知识库详情
export const DelKnowledgeBaseD=(data)=>{
    return request({
        method: 'post',
        action: 'DelKnowledgeBaseD',
        data
      })
}
// 上传知识库详情文件
export const UpdKnowledgeBaseFileD=(data)=>{
    return request({
        method: 'post',
        action: 'UpdKnowledgeBaseFileD',
        data,
        headers: {
            'Content-Type': 'multipart/form-data',  // 设置文件上传的 Content-Type
          }
      })
}