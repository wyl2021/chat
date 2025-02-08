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

        // let currentMessage = null; // 用于存储当前的提问
        arr.forEach(ele => {
          const dt = ele.data || [];
          dt.forEach(e => {
            // console.log('e',e)
            // if (e.role === 'user') {
            //   console.log('1')
            //   if ( currentMessage || currentMessage?.role === e.role) {
            //     console.log(e.data.filter(item => item.type === "originalImage"))
            //     currentMessage = {
            //       type: 'question',
            //     role:'user',
            //       dataType: dataType,
            //       content: {
            //         text: e.content,
            //         video: [],
            //         imageList:e.data? e.data.filter(item => item.type === "originalImage")  // 筛选出 type 为 imageUrl 的对象
            //           .map(d => d.url): []
            //       },
            //       time: moment(ele.addtime).format("YYYY-MM-DD HH:mm:ss")
            //     };
               
            //   }else{
            //     this.messages.push(currentMessage);
            //   }
             
            // }
            // if (e.role === 'assistant') {
            //   if (currentMessage || currentMessage?.role === e.role) {
            //     currentMessage = {
            //       type: 'answer',
            //       role:'assistant',
            //       dataType: dataType,
            //       content: dataType === 'image' ? this.imageDate(e.data) : dataType === 'video' ? this.videoDate(e.data) : e.content,
            //       time: moment(ele.addtime).format("YYYY-MM-DD HH:mm:ss")
            //     };
                
            //   }else{
            //     this.messages.push(currentMessage);
            //   }

            // }
           
            if (e.type === 'question') {
              this.messages.push({
                type: e.type,
                dataType: dataType,
                content: { text: e.content },
                time: moment(ele.addtime).format("YYYY-MM-DD HH:mm:ss")
              })
            }
            if (e.type === 'answer') {
              this.messages.push({
                type: e.type,
                dataType: dataType,
                content: e.content,
                time: moment(ele.addtime).format("YYYY-MM-DD HH:mm:ss")
              })
            }
          })
        })
        console.log(this.messages)
        this.scrollToBottom();
        // this.$refs.aiInput.isTab = false;
        // this.$refs.aiInput.canSend = false;

      } else {
        this.$message.error(res.msg);
      }
    });
  },
}