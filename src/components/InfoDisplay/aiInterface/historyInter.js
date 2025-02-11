import { GetChatDetailsTextList } from "@/api/chat";
import { Session } from "@/utils/storage";
import moment from "moment";
export default {
  getHistory() {

    if (!Session.get("sessionId")) return;
    const currentSessionId = Session.get("sessionId");

    if (this.historySessionId === currentSessionId) {
      this.pageIndex++;  // sessionId 不变，pageIndex 递增
    } else {
      this.pageIndex = 1;  // sessionId 变化，重置 pageIndex 为 1
      this.messages = []
      this.historySessionId = currentSessionId;  // 更新 historySessionId
    }
    // 发送消息
    GetChatDetailsTextList({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sessionId: Session.get("sessionId"),
    }).then((res) => {
      if (res.code === 1) {
        const data = res.data || [];
        const dataType = res.data1.type === 'img' ? 'image' : res.data1.type === 'img' ? 'video' : res.data1.type;
        const arr = data.reverse();

        let currentMessage = null;
        let previousRole = null;
        arr.forEach(ele => {
          const dt = ele.data || [];
          dt.forEach(e => {
            if (e.role === 'user') {
              if (!currentMessage || previousRole !== e.role) {
                // 如果 currentMessage 存在并且角色切换了，推入消息列表
                if (currentMessage) {
                  this.messages.push(currentMessage);
                }
               
                // 创建新的 user 消息
                currentMessage = {
                  type: 'question',
                  role: 'user',
                  dataType: dataType,
                  content: {
                    text: e.content,
                    videoList:dataType === 'video'?this.videoDate(dt):[],
                    imgList:dataType === 'image'? e?.data?.filter(item => item && item.type === "originalImage")
                      .map(d => d.url) || []:[]
                  },
                  time: moment(e.addtime).format("YYYY-MM-DD HH:mm:ss")
                };
              } else {
              
                // 连续的 user 消息，追加内容
                currentMessage.content.text =e.content || "";
                dataType === 'image' && currentMessage.content.imgList.push(
                  ...e?.data?.filter(item => item && item.type === "originalImage")
                    .map(d => d.url) || []
                );
               
                //  currentMessage.content.videoList.push(...this.videoDate(dt)
                // );
              }
    
            }

            if (e.role === 'assistant') {
              
              if (!currentMessage || previousRole !== 'assistant') {
                // 如果 currentMessage 存在并且角色切换了，推入消息列表
                if (currentMessage) {
                  this.messages.push(currentMessage);
                }

                // 创建新的 assistant 消息
                currentMessage = {
                  type: 'answer',
                  role: 'assistant',
                  dataType: dataType,
                  content: dataType === 'image'
                    ? this.imageDate(dt)
                    : dataType === 'video'
                      ?Array.isArray(e?.data)? e?.data?.filter(item => item && item.type === "originalVideo")
                      .map(d => d.url) || []:[{type:'videoUrl',data:e?.data?.url || ''}]
                      : e.content,
                  time: moment(e.addtime).format("YYYY-MM-DD HH:mm:ss")
                };
              } else {
                // 连续的 assistant 消息，追加内容
                if (dataType === 'image') {
                
                  currentMessage.content.push(...this.imageDate(dt));
                } else if (dataType === 'video') {

                  currentMessage.content.push(
                    ...e?.data?.filter(item => item && item.type === "originalVideo")
                      .map(d => d.url) || []
                  );
                 
                } else {
                  currentMessage.content = ` ${e.content}`;
                }
              }
            }

            // 更新 previousRole 为当前角色
            previousRole = e.role;

            // if (e.type === 'question') {
            //   this.messages.push({
            //     type: e.type,
            //     dataType: dataType,
            //     content: { text: e.content },
            //     time: moment(ele.addtime).format("YYYY-MM-DD HH:mm:ss")
            //   })
            // }
            // if (e.type === 'answer') {
            //   this.messages.push({
            //     type: e.type,
            //     dataType: dataType,
            //     content: e.content,
            //     time: moment(ele.addtime).format("YYYY-MM-DD HH:mm:ss")
            //   })
            // }
          })
        })
        if (currentMessage) {
          this.messages.push(currentMessage);
        }

      

        this.scrollToBottom();
        // this.$refs.aiInput.isTab = false;
        // this.$refs.aiInput.canSend = false;

      } else {
        this.$message.error(res.msg);
      }
    });
  },
}