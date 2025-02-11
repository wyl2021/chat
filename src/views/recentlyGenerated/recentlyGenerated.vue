<template>
  <div class="h-container">
    <InfoDisplay
      :resizeHeight="resizeHeight"
      :ques="answerText"
      ref="iplay"
      :isBack="false"
    ></InfoDisplay>
    <div class="h-footer">
      <AIinput
        :pic="type === 'img'"
        :film="type === 'video'"
        ref="aiInput"
        v-model="ctxVal"
        placeholder="输入您要撰写的主题"
        @sendMsg="handleSendMsg"
        @changeAnswer="changeAnswer"
      ></AIinput>
    </div>
  </div>
</template>

<script>
import AIinput from "@/components/AIinput/AIinput";
import InfoDisplay from "@/components/InfoDisplay/InfoDisplay";
import { Session } from "@/utils/storage";
export default {
  components: {
    AIinput,
    InfoDisplay,
  },
  watch: {
    $route: {
      handler() {
        const { sessionId, type } = this.$route.query;
        this.type = type;
        Session.set("sessionId", sessionId);
        this.$nextTick(() => {
          this.$refs.iplay.clear();
          this.$refs.iplay.getHistory();
        });
      },
      immediate: true,
    },
  },
  data() {
    return {
      resizeHeight: 100,
      answerText: {
        type: "history",
        role: "user",
        content: null,
      },
      answer: false,
      ctxVal: "",
      type: "text",
    };
  },
  mounted() {},
  methods: {
    // 发送消息
    handleSendMsg(val) {
      this.answerText = val;
      this.$refs.aiInput.isTab = false;
      this.$refs.aiInput.canSend = false;
      this.ctxVal = "";
      this.$nextTick(() => {
        const h = this.$refs.aiInput.$el.offsetHeight;
        this.resizeHeight = h + 30;
        this.answer = true;
      });
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
/* Add your CSS styles here */
</style>
