<template>
  <div class="d-conrainer" ref="answerRef" @scroll="handleScroll">
    <div v-if="isBack" style="display: flex; justify-content: flex-end">
      <el-button
        size="mini"
        type="text"
        icon="el-icon-arrow-left"
        @click="handleBack"
        >返回</el-button
      >
    </div>
    <div class="d-c-inner" v-for="(message, index) in messages" :key="index">
      <!--提问区域-->
      <div class="d-c-r" v-show="message.type === 'question'">
        <div
          style="display: flex; justify-content: flex-end; flex-wrap: wrap"
          v-if="message.dataType === 'image'"
        >
          <div
            class="d-c-pic"
            v-for="(item, inx) in message.content.imgList"
            :key="inx"
          >
            <!-- <img :src="item.content" /> -->
            <img :src="item.content || item || ''" />
          </div>
        </div>
        <div v-if="message.dataType === 'video'">
          <div
            v-for="(item3, inx3) in message.content.videoList"
            :key="inx3"
            :class="item3.type === 'image' ? 'd-c-pic' : 'd-c-film'"
          >
            <img v-if="item3.type === 'image'" :src="item3.data || item3" />
            <video
              v-if="item3.type === 'video'"
              :src="item3.data || item3"
              controls
            ></video>
          </div>
        </div>
        <!-- <audioView
          v-if="message.audioObj"
          :srcObj="message.audioObj"
        ></audioView> -->
        <div class="d-c-header">
          <pre>{{ message?.content.text }}</pre>
        </div>
        <div class="d-c-footer" v-show="message?.content">
          <el-tooltip class="item" effect="dark" content="复制" placement="top">
            <span class="dfs" @click="handleCopy(message)">
              <img src="@/assets/images/copy.png" />
            </span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="收藏" placement="top">
            <span class="dfs" @click="handleCollect">
              <img src="@/assets/images/collect.png" />
            </span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <span class="dfs" @click="handleDel(message.id, index)">
              <img src="@/assets/images/del.png" />
            </span>
          </el-tooltip>
        </div>
      </div>
      <!--回答区域-->
      <div class="d-c-l" v-show="message.type === 'answer'">
        <pre v-if="typeof message?.content === 'string'">{{
          message?.content
        }}</pre>
        <div
          v-if="Array.isArray(message?.content) && message?.content.length > 0"
        >
          <div v-for="(item2, index2) in message?.content" :key="index2">
            <div
              @click="
                handlePreview(
                  item2.data.originalImage || item2.data.externalLinkImage
                )
              "
              class="w-img"
              v-if="item2.type === 'imageUrl' && item2.data.externalLinkImage"
            >
              <img
                :src="
                  item2.data.thumbnail ||
                  item2.data.originalImage ||
                  item2.data.externalLinkImage
                "
              />
            </div>
            <video
              v-if="item2.type === 'videoUrl' && item2.data"
              :src="item2.data"
              style="width: 200px; max-height: 300px"
              controls
            ></video>
            <pre v-if="item2.type === 'answer'">{{
              item2.content || item2.data
            }}</pre>
          </div>
        </div>
        <LoadingView
          v-show="loading && index === messages.length - 1"
        ></LoadingView>
        <div class="d-c-footer" v-show="message?.content">
          <el-tooltip class="item" effect="dark" content="复制" placement="top">
            <span class="dfs" @click="handleCopy(message)">
              <img src="@/assets/images/copy.png" />
            </span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="收藏" placement="top">
            <span class="dfs" @click="handleCollect">
              <img src="@/assets/images/collect.png" />
            </span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <span class="dfs" @click="handleDel(message.id, index)">
              <img src="@/assets/images/del.png" />
            </span>
          </el-tooltip>
        </div>
      </div>
      <LoadingView
        v-show="loading && messages.length%2!==0 && index === messages.length - 1"
      ></LoadingView>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      center
      :show-close="false"
    >
      <img style="width: 100%; object-fit: contain" :src="previewImg" />
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import TooltipTxt from "@/components/TooltipTxt/TooltipTxt.vue";

import LoadingView from "@/components/LoadingView/LoadingView.vue";
import { Session } from "@/utils/storage";
import { SaveChatCollect, DelChatDetails } from "@/api/chat";
import doDataSend from "./aiInterface/doDataSend";
import textInter from "./aiInterface/textInter";
import imgInter from "./aiInterface/imgInter";
import viedoInter from "./aiInterface/viedoInter";
import historyInter from "./aiInterface/historyInter";

// import audioView from "./audioView.vue";
/**
 * 数据类型
 * message: {
 *   type: [question, answer],
 *   dataType: [text, image, video, audio],
 *   content:
 *   time:
 * }
 */
export default {
  components: {
    // TooltipTxt,
    LoadingView,
    // audioView,
  },
  props: {
    resizeHeight: {
      type: Number,
      default: 100,
    },
    ques: {
      type: [Object, null],
      required: true,
    },
    isBack: {
      type: Boolean,
      default: true,
    },
  },
  beforeDestroy() {
    clearInterval(this.videoPoll ? this.videoPoll : this.imgPoll);

    console.log("定时器已销毁");
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
          if (val) {
            this.handleMessage(val);
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          }
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
      txtIndex: 0,
      result: "",
      isDel: true,
      messages: [],
      pageIndex: 0,
      pageSize: 10,
      pageFinished: false,
      historySessionId: "",
      dialogVisible: false,
      previewImg: "",
      imgPoll: null,
      videoPoll: null,
    };
  },
  mounted() {},
  methods: {
    ...doDataSend,
    ...textInter,
    ...imgInter,
    ...viedoInter,
    ...historyInter,
    handlePreview(img) {
      console.log(img);
      this.previewImg = img;
      this.dialogVisible = true;
    },
    // 滑块的回调
    handleScroll() {
      const scrollContainer = this.$refs.answerRef;
      if (scrollContainer.scrollTop === 0) {
        // 滑块滑到顶部，获取历史记录
        this.getHistory();
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
      this.$destroy();
    },
    // 删除
    handleDel(id, index) {
      console.log(id, index, this.messages);
      if (id) {
        DelChatDetails({ id: id }).then((res) => {
          if (res.code === 1) {
            this.messages.splice(index, 1);
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.messages.splice(index, 1);
      }

      // if (!this.isDel) return;
      // this.result = "";
      // this.fShow = false;
      // this.$emit("close");
    },
    // 复制
    async handleCopy(message) {
      console.log(message);
      if (message.type === "question") {
        if (message.dataType === "text") {
          await navigator.clipboard.writeText(message?.content.text);
          this.$message.success("复制成功");
        } else if (message.dataType === "image") {
          try {
            // 遍历 imgList，获取所有图片并转换为 PNG
            const blobs = await Promise.all(
              message.content.imgList.map(async (item) => {
                const imgUrl = item.content || item; // 兼容对象和字符串
                const blob = await fetch(imgUrl).then((res) => res.blob());

                // 创建 <img> 元素
                const img = await new Promise((resolve) => {
                  const image = new Image();
                  image.crossOrigin = "anonymous"; // 解决跨域问题
                  image.src = URL.createObjectURL(blob);
                  image.onload = () => resolve(image);
                });

                // 使用 Canvas 绘制 PNG
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                // 转换为 PNG Blob
                return new Promise((resolve) => {
                  canvas.toBlob(resolve, "image/png");
                });
              })
            );

            // 复制到剪贴板
            const clipboardItems = blobs.map(
              (blob) => new ClipboardItem({ "image/png": blob })
            );
            await navigator.clipboard.write(clipboardItems);

            this.$message.success("图片已复制到剪贴板！");
          } catch (error) {
            console.error("复制图片失败", error);
            this.$message.error("复制失败，请检查图片地址！");
          }
        } else if (message.dataType === "video") {
          this.$message.error("暂不支持复制视频");
        }
      } else if (message.type === "answer") {
        if (message.dataType === "text") {
          await navigator.clipboard.writeText(message.content);
          this.$message.success("复制成功");
        } else if (message.dataType === "image") {
          try {
            // 遍历 imgList，获取所有图片并转换为 PNG
            const blobs = await Promise.all(
              message.content
                .filter((item) => item.type === "imageUrl" && item.data) // 过滤无效项
                .map(async (item) => {
                  const imgUrl =
                    item.data.thumbnail ||
                    item.data.originalImage ||
                    item.data.externalLinkImage; // 兼容对象和字符串
                  const blob = await fetch(imgUrl).then((res) => res.blob());

                  // 创建 <img> 元素
                  const img = await new Promise((resolve) => {
                    const image = new Image();
                    image.crossOrigin = "anonymous"; // 解决跨域问题
                    image.src = URL.createObjectURL(blob);
                    image.onload = () => resolve(image);
                  });

                  // 使用 Canvas 绘制 PNG
                  const canvas = document.createElement("canvas");
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(img, 0, 0);

                  // 转换为 PNG Blob
                  return new Promise((resolve) => {
                    canvas.toBlob(resolve, "image/png");
                  });
                })
            );

            // 复制到剪贴板
            const clipboardItems = blobs.map(
              (blob) => new ClipboardItem({ "image/png": blob })
            );
            await navigator.clipboard.write(clipboardItems);

            this.$message.success("图片已复制到剪贴板！");
          } catch (error) {
            console.error("复制图片失败", error);
            this.$message.error("复制失败，请检查图片地址！");
          }
        } else if (message.dataType === "video") {
          this.$message.error("暂不支持复制视频");
        }
      }
      // await navigator.clipboard.writeText(txt);
      // this.$message.success("复制成功");
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
    // 清除的方法
    clear() {
      this.result = "";
      this.fShow = false;
      this.loading = false;
      this.isDel = true;
      this.messages = [];
      this.txtIndex = 0;
      this.pageIndex = 0;
      this.historySessionId = "";
      this.pageFinished = false;
      this.imgPoll = null;
      this.videoPoll = null;
      this.previewImg = "";
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
    width: 100%;
    object-fit: contain;
  }
}
.d-c-film {
  margin-left: 7px;
  margin-bottom: 5px;
  video {
    // height: 110px;
    max-height: 300px;
    width: 100%;
    object-fit: contain;
  }
}
pre {
  width: 100%;
  white-space: pre-wrap;
  line-height: 1.5;
  letter-spacing: 1px;
}
.w-img {
  width: 200px;
  img {
    width: 100%;
    object-fit: contain;
  }
}
</style>
