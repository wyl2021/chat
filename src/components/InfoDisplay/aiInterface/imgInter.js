import { CreateChatImg, GetChatImg } from "@/api/chat";
import moment from "moment";
import { Session } from "@/utils/storage";
export default {
  // 图片会话
  async aiImgAnswer (val) {
    this.loading = true; // 标记正在加载
    this.isDel = false;
    let isPolling = 0;
    try {
      const poll = async () => {
        if (isPolling == 4) {
          Session.set("id", "");
          this.loading = false;
          return;
        }
        try {
          const response = await GetChatImg({
            id: Number(Session.get("id")),
          });

          if (response.code !== 2) {

            this.messages.push({
              type: "answer",
              dataType: "image",
              content: this.imageDate(response.data),
              time: moment().format("YYYY-MM-DD HH:mm:ss"),
            });

            this.loading = false;
          } else {
            isPolling++;
            setTimeout(poll, 1000); // 继续轮询
          }
        } catch (error) {

          isPolling = 4;
        }
      };
      CreateChatImg({
        templetId: val?.templetId || 1,
        sessionId: Session.get("sessionId") || "",
        ratio: val?.ratio,
        data: val?.data,
      }).then(async (res) => {
        if (res.code === 1) {
          await Session.set("sessionId", res.data.sessionId);
          await Session.set("id", res.data.id);
          poll();
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
  // 处理图片数据
  imageDate (response) {
    let answerList = [];
    if (!response) return
    response.forEach((item) => {

      const images = item.data.reduce(
        (acc, item) => {
          if (item.type === "externalLinkImage") {
            acc.externalLinkImage = item.url;
          } else if (item.type === "originalImage") {
            acc.originalImage = item.url;
          } else if (item.type === "thumbnail") {
            acc.thumbnail = item.url;
          }
          return acc;
        },
        { externalLinkImage: "", originalImage: "", thumbnail: "" }
      );
      answerList.push({
        type: item.type,
        data: images,
      });
    });

    return answerList;
  },
}