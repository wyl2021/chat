import moment from "moment";
import { Session } from "@/utils/storage";
export default {
  async aiAnswer ({ templetId = 0, txt = "" }) {
    // 创建对话  只针对文本会话
    const url = "http://www.swsai.com:5003/api/v1";
    this.loading = true; // 标记正在加载
    this.isDel = false;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: this.getToken,
          action: "CreateChatTextStream",
          templetId: templetId,
          sessionId: Session.get("sessionId") || "",
          data: [
            {
              type: "question",
              role: "user",
              content: txt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      this.setChatList();
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let chunk = "";

      /* eslint-disable */
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunk += decoder.decode(value, { stream: true });
        // 检查流结束标志
        if (chunk.endsWith("[DONE]")) {
          this.isDel = true;
          chunk = chunk.replace("[DONE]", ""); // 移除结束标志
          this.loading = false; // 关闭加载状态
        }
        // 尝试逐块解析 JSON
        let boundary = chunk.indexOf("}{");
        while (boundary !== -1) {
          const jsonChunk = chunk.slice(0, boundary + 1);
          this.processJsonChunk(jsonChunk);

          // 更新 chunk，移除已解析部分
          chunk = chunk.slice(boundary + 1);
          boundary = chunk.indexOf("}{");
        }
        // 尝试解析剩余的完整 JSON
        try {
          const jsonChunk = JSON.parse(chunk);
          this.processJsonChunk(jsonChunk);
          chunk = ""; // 清空 chunk
        } catch (err) {
          // 如果解析失败，保留 chunk 继续累加数据
        }
      }
      this.messages.push({
        type: "answer",
        dataType: "text",
        content: this.result,
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      this.scrollToBottom();
      // this.loading = false; // 完成后关闭加载状态
      // $("#result").append(result + "\n");
    } catch (error) {
      console.error("Error:", error);
      this.$message.error("请求失败，请稍后重试！");
      this.loading = false;
      this.isDel = true; // 标记删除状态
    }
  },
  // 处理解析后的 JSON 数据
  processJsonChunk (chunk) {
    try {
      if (typeof chunk === "string") {
        chunk = JSON.parse(chunk); // 确保是 JSON 对象
      }
      if (chunk.code === 1) {
        const content = chunk?.data?.data?.content || "";
        // 更新当前消息的 AI 回复内容
        this.result += content; // 拼接内容
        Session.set("sessionId", chunk?.data?.sessionId); // 更新会话 ID
      } else if (chunk.code === 0) {
        this.$message.error("请求失败：" + chunk.msg);
      } else if (chunk.code === -1) {
        this.$message.error("Token 已失效，请重新登录！");
      }
    } catch (err) {
      console.error("处理 JSON 块出错:", err);
    }
  },
}