<template>
  <div class="h-container">
    <div style="width: 100%">
      <div class="h-t-3"><img src="@/assets/images/icon_13.png" />公关广告</div>
      <div class="h-t-2">多种类型创作，一键成文</div>
      <div class="h-c-tag">
        <div
          v-for="(item, index) in cgTag"
          :key="index"
          class="tag"
          :class="tagActive === index ? 'tag-active' : ''"
          @click="handleCgTag(index)"
        >
          {{ item.label }}
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
              <img :src="item.img" />
              <span class="label"> {{ item.label }}</span>
              <div class="desc">{{ item.desc }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <InfoDisplay v-if="answer"></InfoDisplay>
    <div class="h-footer">
      <AIinput
        ref="aiInput"
        v-model="ctxVal"
        placeholder="输入您要撰写的主题"
      ></AIinput>
    </div>
  </div>
</template>

<script>
import AIinput from "@/components/AIinput/AIinput";
import InfoDisplay from "@/components/InfoDisplay/InfoDisplay";
import cgTag from "./cgTag";
import { GetChatTempletById } from "@/api/chat";
export default {
  components: {
    AIinput,
    InfoDisplay,
  },
  data() {
    return {
      cgTag,
      ctxList: [],
      ctxVal: "",
      tagActive: 0,
      answer: false,
    };
  },
  mounted() {
    this.handleCgTag(0);
  },
  methods: {
    handleCgTag(n) {
      this.tagActive = n;
      const row = this.cgTag[n];
      this.ctxList = row.children || [];
    },
    // 获取模版
    handleChangeAiCtx(row) {
      // 获取 AI 文本
      GetChatTempletById({ id: row.apiId }).then((res) => {
        if (res.code === 1) {
          const data = res.data || [];
          const dom = this.createAiScript(data);
          this.$refs.aiInput.isTab = true;
          this.$refs.aiInput.canSend = true;
          this.ctxVal = dom;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
