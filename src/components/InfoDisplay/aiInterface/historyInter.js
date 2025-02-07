import { GetChatDetailsTextList } from "@/api/chat";
import { Session } from "@/utils/storage";
import moment from "moment";
export default {
  getHistory () {
    if (!Session.get("sessionId")) return;
    this.pageIndex++;
    // 发送消息
    GetChatDetailsTextList({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sessionId: Session.get("sessionId"),
    }).then((res) => {
      if (res.code === 1) {
        const data = res.data || [];
        const dataType = res.data1.type;
        const arr = data.reverse();
        arr.forEach(ele => {
          const dt = ele.data || [];
          dt.forEach(e => {
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
        this.scrollToBottom();
        // this.$refs.aiInput.isTab = false;
        // this.$refs.aiInput.canSend = false;

      } else {
        this.$message.error(res.msg);
      }
    });
  },
}