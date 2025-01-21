<template>
  <div class="h-container">
    <div style="width: 100%">
      <div class="h-t-3">
        <img src="@/assets/images/icon_13.png" />{{ templateInfo.title }}
      </div>
      <div class="h-t-2">{{ templateInfo.note }}</div>
      <div class="h-c-tag">
        <div
          v-for="(item, index) in cgTag"
          :key="index"
          class="tag"
          :class="tagActive === index ? 'tag-active' : ''"
          @click="handleCgTag(index)"
        >
          {{ item.title }}
        </div>
      </div>
      <el-row :gutter="10">
        <el-col
          :span="6"
          v-for="(item, index) in ctxList"
          :key="index"
          style="margin-bottom: 10px"
        >
          <div class="h-ce-1" @click="handleChangeAiCtx(item)">
            <div class="h-ce-1-d2">
              <img :src="item.icon"   />
              <span class="label"> {{ item.title }}</span>
              <div class="desc">{{ item.note }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <InfoDisplay
      v-if="answer"
      :resizeHeight="resizeHeight"
      :ques="answerText"
    ></InfoDisplay>
    <div class="h-footer">
      <AIinput
        ref="aiInput"
        :isTemplate="isTemplate"
        v-model="ctxVal"
        placeholder="输入您要撰写的主题"
        @sendMsg="handleSendMsg"
        @changeAnswer="changeAnswer"
        :templateId="templateId"
      ></AIinput>
    </div>
  </div>
</template>

<script>
import AIinput from "@/components/AIinput/AIinput";
import InfoDisplay from "@/components/InfoDisplay/InfoDisplay";
// import cgTag from "./cgTag";
import { GetChatTempletById, GetChatTempletByType } from "@/api/chat";
export default {
  components: {
    AIinput,
    InfoDisplay,
  },
  data() {
    return {
      cgTag: [],
      ctxList: [],
      ctxVal: "",
      tagActive: 0,
      answer: false,
      answerText: "",
      resizeHeight: 100,
      isTemplate: false,
      templateInfo: null, ///页面传值
      templateId: 0 // 模板 ID，可以根据需要动态设置
    };
  },
  mounted() {
    // this.handleCgTag(0);
  },
  async created() {
    await this.handleType();
    this.handleCgTag(0);
    console.log(this.$route.query);
  },
  methods: {
    handleImgError(event) {
      // 当图片加载失败时设置默认图片
      event.target.src = require('@/assets/images/car.png');
    },
    // 按照类型
    async handleType() {
      this.templateInfo = this.$route.query;
      if (!this.templateInfo.type) {
        this.$message.error("参数获取失败");
        return;
      }
      const res = await GetChatTempletByType({ type: this.templateInfo.type });
      if (res.code === 1) {
        this.cgTag = res.data || [];
      } else {
        this.$message.error(res.msg);
      }
      console.log(this.cgTag);
    },
    handleCgTag(n) {
      this.tagActive = n;
      const row = this.cgTag[n];
      this.ctxList = row.data || [];
    },
    // 获取模版
    handleChangeAiCtx(row) {
      // 获取 AI 文本
      GetChatTempletById({ id: row.id }).then((res) => {
        if (res.code === 1) {
          const data = res.data || [];
          const dom = this.createAiScript(data);
          this.$refs.aiInput.isTab = true;
          this.$refs.aiInput.canSend = true;
          this.ctxVal = dom;
          this.isTemplate = true;
          this.templateId= Number(row.id)
        }
      });
    },
    // 发送消息
    handleSendMsg(val) {
      console.log(val)
      // 获取创建对话参数
      // this.answerText = val;
      // this.ctxVal = "";
      // this.$refs.aiInput.isTab = false;
      // this.$refs.aiInput.canSend = false;
      // this.isTemplate = false;
      // this.$nextTick(() => {
      //   const h = this.$refs.aiInput.$el.offsetHeight;
      //   this.resizeHeight = h + 30;
      //   this.answer = true;
      // });
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

<style lang="less" scoped></style>
