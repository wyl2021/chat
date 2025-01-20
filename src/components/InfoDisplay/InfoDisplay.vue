<template>
  <div class="d-conrainer" ref="answerRef">
    <div class="d-c-header" ref="dch">
      <TooltipTxt :text="ques" :len="298"></TooltipTxt>
    </div>
    <div class="d-c-body" ref="dcb">
      <pre></pre>
    </div>
    <div class="d-c-footer">
      <span class="el-icon-delete"></span>
    </div>
  </div>
</template>
<script>
import TooltipTxt from "@/components/TooltipTxt/TooltipTxt.vue";
export default {
  components: {
    TooltipTxt,
  },
  props: {
    resizeHeight: {
      type: Number,
      default: 100,
    },
    ques: {
      type: String,
      default: "",
    },
  },
  watch: {
    resizeHeight: {
      handler(val) {
        this.$nextTick(() => {
          const answerRef = this.$refs.answerRef;
          answerRef.style.height = `calc(100% - ${val}px)`;
        });
      },
      immediate: true,
    },
    ques: {
      handler() {
        this.$nextTick(() => {
          const h1 = this.$refs.dch.offsetHeight;
          this.$refs.dcb.style.maxHeight = `calc(100% - ${h1 + 20}px)`;
        });
      },
      immediate: true,
    },
  },
  data() {
    return {};
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
  background-color: red;
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
