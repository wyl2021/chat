import { CreateChatImg, GetChatImg, StopChatImg } from "@/api/chat";
import moment from "moment";
import { Session } from "@/utils/storage";
export default {
  // 图片会话
  async aiImgAnswer(val) {
    this.loading = true; // 标记正在加载
    this.isDel = false;
    let isPolling = 0;
    try {
      this.imgPoll = async () => {
        
        if (isPolling == 60) {
          this.loading = false;
          try {
            await StopChatImg({ id: Session.get("sessionId") });
            Session.set("id", "");
          } catch (error) {
             this.$message.error('Error stopping chat image:', error);
          }
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
            console.log(this.messages, this.loading)
          } else {
            if (Array.isArray(response.code.data)) {
              console.log("1")
              if (response.code.data[0].type === 'err') {
                console.log("2")
                this.$message.error(response.code.data[0].msg)
                isPolling = 60;
               
              }
            } else {
              isPolling++;
              setTimeout(this.imgPoll, 60000); // 继续轮询
            }

          }
        } catch (error) {

          isPolling = 60;
          
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
          this.imgPoll();
        } else {
          if (res.msg.includes('timeout')) {
            // 如果是超时错误，则不显示错误消息
            console.log('请求超时，不显示错误');
          } else {
            this.$message.error(res.msg);
          }

        }
      });
    } catch (error) {
      this.$message.error("请求失败，请稍后重试！");
      this.loading = false;
      this.isDel = true; // 标记删除状态
    }
  },

  // 处理图片数据
  imageDate(response) {
    let answerList = [];
    if (!response) return
    if (Array.isArray(response)) {

      response.forEach((item) => {
        if (item.type === 'imageUrl') {
          console.log(item.data)
          if (Array.isArray(item.data)) {
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
          } else {
            console.log(item.data)
          }
        } else if (item.type === 'answer') {
          answerList.push({
            type: 'answer',
            data: item.content,
          });
        }

      });
    } else {
      answerList.push({
        type: 'answer',
        data: response,
      });
    }


    return answerList;
  },
}