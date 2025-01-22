<template>
  <div class="d-conrainer" ref="answerRef">
    <div class="d-c-header" ref="dch">
      <TooltipTxt :text="ques?.txt" :len="298"></TooltipTxt>
    </div>
    <div class="d-c-body" ref="dcb">
      <LoadingView v-if="loading"></LoadingView>
      <pre v-else>
        {{ result }}
      </pre>
    </div>
    <div class="d-c-footer" v-if="fShow">
      <span class="el-icon-delete"></span>
    </div>
  </div>
</template>
<script>
import TooltipTxt from "@/components/TooltipTxt/TooltipTxt.vue";
import LoadingView from "@/components/LoadingView/LoadingView.vue";
import { Session } from "@/utils/storage";
export default {
  components: {
    TooltipTxt,
    LoadingView,
  },
  props: {
    resizeHeight: {
      type: Number,
      default: 100,
    },
    ques: {
      type: [Object, null],
      default: null,
    },
  },
  watch: {
    // 高自适应计算
    resizeHeight: {
      handler(val) {
        this.$nextTick(() => {
          const answerRef = this.$refs.answerRef;
          answerRef.style.height = `calc(100% - ${val}px)`;
        });
      },
      immediate: true,
    },
    // 问题参数
    ques: {
      handler(val) {
        console.log(val);
        if (!val) return
        this.$nextTick(() => {
          const h1 = this.$refs.dch.offsetHeight;
          this.$refs.dcb.style.maxHeight = `calc(100% - ${h1 + 20}px)`;
          this.aiAnswer({ templetId: val?.templetId, txt: val?.txt });
        });
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      sessionId: "",
      fShow: false,
      loading: false,
      result: "",
    };
  },
  mounted() {},
  methods: {
    /* eslint-disable */
    async aiAnswer({ templetId = 0, txt = "" }) {
      // 创建对话  只针对文本会话
      const url = "http://www.swsai.com:5003/api/v1";
      this.loading = true; // 标记正在加载

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

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let chunk = "";
        /* eslint-disable */
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunk += decoder.decode(value, { stream: true });
          console.log("chunk", chunk);
          // 检查流结束标志
          if (chunk.endsWith("[DONE]")) {
            chunk = chunk.replace("[DONE]", ""); // 移除结束标志
            this.loading = false; // 关闭加载状态
          }
            // 尝试逐块解析 JSON
            let boundary = chunk.indexOf("}{");
            console.log(boundary, chunk);
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

        this.loading = false; // 完成后关闭加载状态
        // $("#result").append(result + "\n");
      } catch (error) {
        console.error("Error:", error);
        this.$message.error("请求失败，请稍后重试！");
        this.loading = false;
      }
    },
    // 处理解析后的 JSON 数据
    processJsonChunk(chunk) {
      try {
        if (typeof chunk === "string") {
          chunk = JSON.parse(chunk); // 确保是 JSON 对象
        }
        if (chunk.code === 1) {
          const content = chunk?.data?.data?.content || "";
          this.result += content; // 拼接内容
          console.log(this.result);
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
  },
};
</script>

<style lang="less">
.d-conrainer {
  position: absolute;
  width: 100%;
  height: calc(100% - 100px);
  translate: all 0.3s;
  background: #222127;
  top: 0px;
}
.d-c-header {
  background: black;
  color: #fff;
  padding: 5px 10px;
  max-height: 80px;
  border-radius: 7px;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-all;
}
.d-c-body {
  position: relative;
  white-space: pre-wrap;
  word-break: break-all;
  overflow-y: auto;
}
.d-c-footer {
  span {
    font-size: 15px;
  }
}
</style>
