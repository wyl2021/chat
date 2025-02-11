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
          
            <div
              @click="
                handlePreview(
                  item2.data.thumbnail ||
                    item2.data.originalImage ||
                    item2.data.externalLinkImage
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
              style="width: 200px; height:100px "
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
      <LoadingView
        v-if="loading && index === messages.length - 1"
      ></LoadingView>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="50%" center :show-close="false">
      <img style="width: 100%; object-fit: contain;" :src="previewImg" />
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
    isBack:{
      type:Boolean,
      default:true
    },
  },
  beforeDestroy() {
    clearInterval(this.imgPoll);
    clearInterval(this.videoPoll);
    console.log('定时器已销毁')
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
      historySessionId: "",
      dialogVisible: false,
      previewImg: "",
      imgPoll:null,
      videoPoll:null
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
        this.getHiStory();
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
      this.$destroy()
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
    width: 100%;
    object-fit: contain;
  }
}
.d-c-film {
  margin-left: 7px;
  margin-bottom: 5px;
  video {
    height: 110px;
    width: 100%;
    object-fit: contain;
  }
}
pre {
  width: 100%;
  white-space: pre-wrap;
  line-height: 1.3;
}
.w-img{
  width: 200px;
  img{
    width: 100%;
    object-fit: contain;
  }
}
</style>
