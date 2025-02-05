<template>
  <div class="d-conrainer" ref="answerRef">
    <div style="display: flex; justify-content: flex-end">
      <el-button
        size="mini"
        type="text"
        icon="el-icon-arrow-left"
        @click="handleBack"
        >返回</el-button
      >
    </div>
    <div class="d-c-inner" v-for="(message, index) in messages" :key="index">
      <div class="d-c-r">
        <!--提问区域-->
        <div style="display: flex; justify-content: flex-end; flex-wrap: wrap">
          <div
            class="d-c-pic"
            v-for="(item, inx) in message.imgList"
            :key="inx"
          >
            <img :src="item" />
          </div>
        </div>
        <audioView
          v-if="message.audioObj"
          :srcObj="message.audioObj"
        ></audioView>
        <div class="d-c-header" v-if="message.question">
          <pre>{{ message?.question }}</pre>
        </div>
      </div>
      <!--回答区域-->
      <div class="d-c-l">
        <pre v-if="typeof message?.answer === 'string'">{{
          message?.answer
        }}</pre>
        <div
          v-if="Array.isArray(message?.answer) && message?.answer.length > 0"
        >
          <div v-for="(item2, index2) in message?.answer" :key="index2">
            <img
              v-if="item2.type === 'imageUrl' && item2.data.externalLinkImage"
              :src="
                item2.data.thumbnail ||
                item2.data.originalImage ||
                item2.data.externalLinkImage
              "
            />
            <video
              v-if="item2.type === 'videoUrl' && item2.data.url"
              :src="item2.data.url"
              controls
            ></video>
            <!-- <pre  v-if="item2.type!==videoUrl' && item2.type!==imageUrl'"></pre> -->
          </div>
        </div>

        <LoadingView
          v-if="loading && index === messages.length - 1"
        ></LoadingView>
        <div class="d-c-footer" v-if="fShow">
          <el-tooltip class="item" effect="dark" content="复制" placement="top">
            <span class="dfs" @click="handleCopy(message.answer)">
              <img src="@/assets/images/copy.png" />
            </span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="收藏" placement="top">
            <span class="dfs" @click="handleCollect">
              <img src="@/assets/images/collect.png" />
            </span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <span class="dfs" @click="handleDel(message)">
              <img src="@/assets/images/del.png" />
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import TooltipTxt from "@/components/TooltipTxt/TooltipTxt.vue";
import LoadingView from "@/components/LoadingView/LoadingView.vue";
import { Session } from "@/utils/storage";
import { SaveChatCollect, CreateChatImg, GetChatImg } from "@/api/chat";
import audioView from "./audioView.vue";
export default {
  components: {
    // TooltipTxt,
    LoadingView,
    audioView,
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
        if (!val) return;
        this.$nextTick(() => {
          // const h1 = this.$refs.dch.offsetHeight;
          // this.$refs.dcb.style.maxHeight = `calc(100% - ${h1 + 20}px)`;
          this.handleMessage(val);
        });
      },
      immediate: true,
      deep: true,
    },
    result: {
      handler(val) {
        if (val) {
          this.fShow = true;
        }
      },
    },
  },
  data() {
    return {
      sessionId: "",
      fShow: false,
      loading: false,
      result: "",
      isDel: true,
      messages: [],
    };
  },
  mounted() {},
  methods: {
    handleMessage(val) {
      console.log(
        "this.getActivePath",
        this.getActivePath,
        this.getActivePath.includes("/imageGeneration"),
        val
      );
      if (this.getActivePath.includes("/imageGeneration")) {
        if (Array.isArray(val.data) && val.data.length > 0) {
          this.messages.push({
            question:
              val?.data.find((item) => item.type === "question")?.content || "",
            answer: "", // AI 回复初始化为空
            audioObj: val.audioObj || null,
            imgList:
              val?.data
                .filter((item) => item.type !== "question")
                .map((item) => item.content) || [],
          });
          this.result = "";
          this.aiImgAnswer(val);
        } else {
          this.$message.error("数据为空");
        }
      } else if (this.getActivePath.includes("/collectView")) {
        if (Array.isArray(val) && val.length > 0) {
          val.forEach((item) => {
            if (item.data.length > 0) {
              //   this.messages.push({
              //   question:,
              //   answer:,
              // })
            }
          });
          this.messages.push({
            question: val?.txt,
            answer: "", // AI 回复初始化为空
            imgList: val.imgList,
            audioObj: val.audioObj || null,
          });
          this.result = "";
        }
      } else {
        this.messages.push({
          question: val?.txt,
          answer: "", // AI 回复初始化为空
          imgList: val.imgList,
          audioObj: val.audioObj || null,
        });
        this.result = "";
        this.aiAnswer({ templetId: val?.templetId, txt: val?.txt });
      }
    },
    /* eslint-disable */
    async aiAnswer({ templetId = 0, txt = "" }) {
      // 创建对话  只针对文本会话
      const url = "http://www.swsai.com:5003/api/v1";
      this.loading = true; // 标记正在加载
      this.isDel = false;
      const currentIndex = this.messages.length - 1; // 当前消息索引
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
        this.$set(this.messages[currentIndex], "answer", this.result);
        this.scrollToBottom();
        this.loading = false; // 完成后关闭加载状态
        // $("#result").append(result + "\n");
      } catch (error) {
        console.error("Error:", error);
        this.$message.error("请求失败，请稍后重试！");
        this.loading = false;
        this.isDel = true; // 标记删除状态
      }
    },
    // 图片会话
    async aiImgAnswer(val) {
      this.loading = true; // 标记正在加载
      this.isDel = false;
      let isPolling = 0;
      try {
        const poll = async () => {
          if (isPolling == 4) return;
          try {
            const response = await GetChatImg({
              id: Number(Session.get("sessionId")),
            });

            if (response.code !== 2) {
              console.log("回复成功", response);
              let answerList = [];
              response.data.forEach((item) => {
                const images = item.reduce(
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
              this.$set(
                this.messages[this.messages.length - 1],
                "answer",
                answerList
              );
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
        CreateChatImg({
          templetId: val?.templetId || 1,
          sessionId: Session.get("sessionId") || "",
          ratio: val?.ratio,
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
    // 处理解析后的 JSON 数据
    processJsonChunk(chunk) {
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
    // 滚动到页面底部
    scrollToBottom() {
      const container = this.$refs.answerRef;
      container.scrollTop = container.scrollHeight;
    },
    // 返回
    handleBack() {
      this.result = "";
      this.fShow = false;
      Session.remove("sessionId");
      this.$emit("close");
    },
    // 删除
    handleDel() {
      if (!this.isDel) return;
      this.result = "";
      this.fShow = false;
      this.$emit("close");
    },
    // 复制
    async handleCopy(txt) {
      await navigator.clipboard.writeText(txt);
      this.$message.success("复制成功");
    },
    // 收藏
    async handleCollect() {
      const res = await SaveChatCollect({
        sessionId: Session.get("sessionId"),
        collect: 1,
      });
      if (res.code === 1) {
        this.$message.success("收藏成功");
      } else {
        this.$message.error(res.msg);
      }
    },
  },
};
</script>

<style lang="less">
.d-conrainer {
  scrollbar-width: none;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  height: calc(100% - 100px);
  translate: all 0.3s;
  background: #222127;
  top: 0px;
}
.d-c-inner {
}
.d-c-r {
  display: flex;
  flex-direction: column;
  align-items: end;
}
.d-c-l {
  display: flex;
  flex-direction: column;
  margin: 24px 0;
}
.d-c-header {
  background: black;
  color: #fff;
  padding: 5px 10px;
  border-radius: 7px;
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
  margin: 5px 0;
  .dfs {
    display: inline-block;
    margin-right: 7px;
    cursor: pointer;
    img {
      width: 20px;
    }
  }
}
.d-c-pic {
  margin-left: 7px;
  margin-bottom: 5px;
  img {
    height: 110px;
  }
}
pre {
  width: 100%;
  white-space: pre-wrap;
  line-height: 1.3;
}
</style>
