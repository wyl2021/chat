import moment from "moment";
import { Session } from "@/utils/storage";
import { GetChatVideo, CreateChatVideo } from "@/api/chat";
export default {
  async aiVideoAnswer (val) {
    this.loading = true; // 标记正在加载
    this.isDel = false;
    let isPolling = 0;
    try {
      this.videoPoll = async () => {
        if (isPolling == 60) {
          Session.set("id", "");
          this.loading = false;
          return;
        }
        try {
          const response = await GetChatVideo({
            id: Number(Session.get("id")),
          });

          if (response.code !== 2) {
           
            this.messages.push({
              type: "answer",
              dataType: "video",
              content: this.videoDate(response.data),
              time: moment().format("YYYY-MM-DD HH:mm:ss"),
            });
           
            this.loading = false;
          } else {
            isPolling++;
            setTimeout(this.videoPoll, 60000); // 继续轮询
          }
        } catch (error) {
          
          isPolling = 4;
        }
      };
      CreateChatVideo({
        templetId: val?.templetId || 1,
        sessionId: Session.get("sessionId") || "",
        count: val?.count || "1",
        data: val?.content,
      }).then(async (res) => {
        if (res.code === 0 ) {
          if (res.msg) {
            this.$message.error(res.msg);
          }else{
            await Session.set("sessionId", res.data.sessionId);
            await Session.set("id", res.data.id);
            this.videoPoll();
          }
         
        } else {
          this.$message.error(res.msg);
        }
      });
    } catch (error) {
     
      this.$message.error("请求失败，请稍后重试！");
      this.loading = false;
      this.isDel = true; // 标记删除状态
    }
  },
  //处理视频数据
  videoDate (response) {
   
    let answerList = [];
    if(!response) return 
    response.forEach((item) => {
      answerList.push({
        type:
          item.type === "videoUrl"
            ? "video"
            : item.type === "imageUrl"
              ? "image"
              : "question",
        data:
          item.type === "videoUrl"
            ?Array.isArray(item.data)? item.data[0]?.url:item.data.url
            : item.type === "imageUrl"
              ? item.data[0]?.url
              : item.content,
      });
    });

    return answerList;
  },
}