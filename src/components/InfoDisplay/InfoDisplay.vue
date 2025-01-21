<template>
  <div class="d-conrainer" ref="answerRef">
    <div class="d-c-header" ref="dch">
      <TooltipTxt :text="ques?.txt" :len="298"></TooltipTxt>
    </div>
    <div class="d-c-body" ref="dcb">
      <pre></pre>
      <LoadingView v-if="loading"></LoadingView>
    </div>
    <div class="d-c-footer" v-if="fShow">
      <span class="el-icon-delete"></span>
    </div>
  </div>
</template>
<script>
import TooltipTxt from "@/components/TooltipTxt/TooltipTxt.vue";
import LoadingView from "@/components/LoadingView/LoadingView.vue";

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
        if (!val) return;
        this.$nextTick(() => {
          const h1 = this.$refs.dch.offsetHeight;
          this.$refs.dcb.style.maxHeight = `calc(100% - ${h1 + 20}px)`;
          // this.aiAnswer({ templetId: val?.templetId, txt: val?.txt });
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
    };
  },
  mounted() {},
  methods: {
    /* eslint-disable */
    async aiAnswer({ templetId = 0, txt = "" }) {
      // 创建对话  只针对文本会话
      const url = "http://www.swsai.com:5003/api/v1";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toke: this.getToken,
            action: "CreateChatTextStream",
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
        let result = "";
        /* eslint-disable */
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result = decoder.decode(value, { stream: true });
          console.log(result);
          // $("#result").append(result + "\n");
        }
      } catch (error) {
        console.error("Error:", error);
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
