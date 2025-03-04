<template>
  <div class="h-container">
    <div
      style="
        width: 100%;
        height: calc(100% - 80px);
        overflow-y: auto;
        overflow-x: hidden;
      "
    >
      <div class="h-t-3">
        <img :src="icon" />{{ title }}
      </div>
      <div class="h-t-2">{{ note }}</div>
      <div class="h-c-tag">
        <div
          v-for="(item, index) in cgTag"
          :key="index"
          class="tag"
          :class="activeIndex === index ? 'tag-active' : ''"
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
              <img :src="item.icon" />
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
      @close="answer = false"
    ></InfoDisplay>
    <div class="h-footer">
      <AIinput
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
// import cgTag from "./cgTag";
import { GetChatTempletById, GetChatTempletByType } from "@/api/chat";
export default {
  components: {
    AIinput,
    InfoDisplay,
  },
  watch: {
    ctxVal(val) {
      if (!val) {
        this.templateId = 0;
      }
    },
  },

  data() {
    return {
      type: "公关广告",
      title: "公关广告",
      icon:'https://www.swsai.com/style/dist/img/icon/home1_1.png',
      cgTag: [],
      ctxList: [],
      ctxVal: "",
      answer: false,
      answerText: null,
      resizeHeight: 100,
      templateId: 0, // 模板 ID，可以根据需要动态设置
      note: "多种类型创作，一键成文",
      activeIndex: 0,
    };
  },
  mounted() {},
  async created() {
    const { type, note, title,icon } = this.$route.query;
    this.type = type || this.type;
    this.note = note || this.note;
    this.title = title || this.title;
    this.icon=icon|| this.icon;
    await this.getList();
    this.handleCgTag(0);
  },
  methods: {
    // 发送消息
    handleSendMsg(val) {
      this.answerText = { templetId: 0, content: val.content, imgList: val.imgList };
      console.log(" this.answerText", this.answerText);
      this.$refs.aiInput.isTab = false;
      this.$refs.aiInput.canSend = false;
      this.ctxVal = "";
      this.$nextTick(() => {
        const h = this.$refs.aiInput.$el.offsetHeight;
        this.resizeHeight = h + 30;
        this.answer = true;
      });
    },
    handleImgError(event) {
      // 当图片加载失败时设置默认图片
      event.target.src = require("@/assets/images/car.png");
    },
    // 获取内容list
    async getList() {
      try {
        const res = await GetChatTempletByType({
          type: this.type,
        });
        if (res.code === 1) {
          const arr = res.data || [];
          this.cgTag = arr;
        } else {
          this.$message.error(res.msg);
        }
      } catch (error) {
        // TODO:
      }
    },
    // 选择类型获取对应的内容
    handleCgTag(n) {
      this.activeIndex = n;
      const row = this.cgTag[n];
      if (row) {
        const arr = row.data || [];
        arr.forEach((ele) => {
          ele.img = require("@/assets/images/icon_ctb.png"); // 图片路径
        });
        this.ctxList = arr;
     
      }
    },
    // 获取模版
    handleChangeAiCtx(row) {
      this.templateId = Number(row.id);
      // 获取 AI 文本
      GetChatTempletById({ id: row.id }).then((res) => {
        if (res.code === 1) {
          const data = res.data || [];
          const dom = this.createAiScript(data);
          this.$refs.aiInput.isTab = true;
          this.$refs.aiInput.canSend = false;
          this.ctxVal = dom;
        }
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

<style lang="less" scoped></style>
