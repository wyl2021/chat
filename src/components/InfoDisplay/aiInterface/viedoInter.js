import moment from "moment";
import { Session } from "@/utils/storage";
import { GetChatVideo, CreateChatVideo } from "@/api/chat";
export default {
  async aiVideoAnswer (val) {
    this.loading = true; // 标记正在加载
    this.isDel = false;
    let isPolling = 0;
    try {
      const poll = async () => {
        if (isPolling == 4) {
          Session.set("sessionId", "");
          this.loading = false;
          return;
        }
        try {
          const response = await GetChatVideo({
            id: Number(Session.get("sessionId")),
          });

          if (response.code !== 2) {
            console.log("回复成功", response);
            this.messages.push({
              type: "answer",
              dataType: "video",
              content: this.videoDate(response.data),
              time: moment().format("YYYY-MM-DD HH:mm:ss"),
            });
            console.log(1111, this.messages);
            this.loading = false;
          } else {
            isPolling++;
            setTimeout(poll, 1000); // 继续轮询
          }
        } catch (error) {
          console.error("轮询失败", error);
          isPolling = 4;
        }
      };
      CreateChatVideo({
        templetId: val?.templetId || 1,
        sessionId: Session.get("sessionId") || "",
        count: val?.count || "1",
        data: val?.data,
      }).then(async (res) => {
        if (res.code === 1) {
          await Session.set("sessionId", res.data.sessionId);
          poll();
        } else {
          this.$message.error(res.msg);
        }
      });
    } catch (error) {
      console.error("Error:", error);
      this.$message.error("请求失败，请稍后重试！");
      this.loading = false;
      this.isDel = true; // 标记删除状态
    }
  },
  //处理视频数据
  videoDate (response) {
    let answerList = [];
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
            ? item.data?.url
            : item.type === "imageUrl"
              ? this.imageDate(item.data)
              : item.content,
      });
    });
    return answerList;
  },
}