<template>
  <div class="h-container">
    <div class="is-header">
      <div class="is-h-d1">
        <img
          class="is-h-d1-m1"
          src="https://www.swsai.com/style/dist/img/icon/Frame13_1.png"
        /><span class="is-h-d1-s1">图片生成</span>
      </div>
      <div style="text-align: center; font-size: 18px">
        AI绘画，模型创建，图生图
      </div>
    </div>
    <InfoDisplay
      v-if="answer"
      :resizeHeight="resizeHeight"
      :ques="answerText"
      @close="handleClose"
    ></InfoDisplay>
    <div class="h-footer" :style="{ position: changeInputStyle }">
      <AIinput
        ref="aiInput"
        v-model="ctxVal"
        placeholder="描述你所想象的画面，角色，情绪，场景，风格..."
        pic
        @sendMsg="handleSendMsg"
        @changeAnswer="changeAnswer"
      ></AIinput>
    </div>
  </div>
</template>

<script>
import AIinput from "@/components/AIinput/AIinput";
import InfoDisplay from "@/components/InfoDisplay/InfoDisplay";
export default {
  components: {
    AIinput,
    InfoDisplay,
  },
  data() {
    return {
      ctxVal: "",
      answer: false,
      answerText: null,
      resizeHeight: 100,
      changeInputStyle: "relative",
    };
  },
  methods: {
    // 发送消息
    handleSendMsg(val) {
      this.changeInputStyle = "absolute";
      this.answerText = { templetId: 0, txt: val.txt, imgList: val.imgList };
      this.$refs.aiInput.canSend = false;
      this.$refs.aiInput.value = "";
      this.$refs.aiInput.imgList = [];
      this.$nextTick(() => {
        const h = this.$refs.aiInput.$el.offsetHeight;
        this.resizeHeight = h + 30;
        this.answer = true;
      });
    },
    // 关闭回答
    handleClose() {
      this.answer = false;
      this.changeInputStyle = "relative";
    },
    // 实时改变AI回答的高度
    changeAnswer() {
      this.$nextTick(() => {
        const h = this.$refs.aiInput.$el.offsetHeight;
        this.resizeHeight = h + 30;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.is-header {
  margin-bottom: 50px;
}
.is-h-d1 {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  .is-h-d1-m1 {
    width: 16px;
  }
  .is-h-d1-s1 {
    display: inline-block;
    margin-left: 5px;
  }
}
</style>
