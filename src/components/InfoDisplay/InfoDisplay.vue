<template>
  <div class="d-conrainer" ref="answerRef" @scroll="handleScroll">
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
      <!--提问区域-->
      <div class="d-c-r" v-if="message.type === 'question'">
        <div
          style="display: flex; justify-content: flex-end; flex-wrap: wrap"
          v-if="message.dataType === 'image'"
        >
          <div
            class="d-c-pic"
            v-for="(item, inx) in message.content.imgList"
            :key="inx"
          >
            <img :src="item.content" />
          </div>
        </div>
        <div
          style="display: flex; justify-content: flex-end; flex-wrap: wrap"
          v-if="message.dataType === 'video'"
        >
          <div
            class="d-c-pic"
            v-for="(item2, inx2) in message.content.videoList"
            :key="inx2"
          >
            <img :src="item2" />
          </div>
        </div>
        <!-- <audioView
          v-if="message.audioObj"
          :srcObj="message.audioObj"
        ></audioView> -->
        <div class="d-c-header">
          <pre>{{ message?.content.text }}</pre>
        </div>
      </div>
      <!--回答区域-->
      <div class="d-c-l" v-if="message.type === 'answer'">
        <pre v-if="typeof message?.content === 'string'">{{
          message?.content
        }}</pre>
        <div
          v-if="Array.isArray(message?.content) && message?.content.length > 0"
        >
          <div v-for="(item2, index2) in message?.content" :key="index2">
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
            <pre v-if="item2.type === 'answer'">{{ item2.content }}</pre>
          </div>
        </div>
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
      <LoadingView v-if="loading"></LoadingView>
    </div>
  </div>
</template>
<script>
// import TooltipTxt from "@/components/TooltipTxt/TooltipTxt.vue";

import LoadingView from "@/components/LoadingView/LoadingView.vue";
import { Session } from "@/utils/storage";
import { SaveChatCollect } from "@/api/chat";
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
      result: "",
      isDel: true,
      messages: [],
      pageIndex: 0,
      pageSize: 10,
    };
  },
  mounted() {},
  methods: {
    ...doDataSend,
    ...textInter,
    ...imgInter,
    ...viedoInter,
    ...historyInter,
    // 滑块的回调
    handleScroll() {
      const scrollContainer = this.$refs.answerRef;
      if (scrollContainer.scrollTop === 0) {
        // 滑块滑到顶部，获取历史记录
        this.fetchHistory();
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
