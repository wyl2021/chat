<template>
  <div class="h-container">
    <div style="width: 100%">
      <div
        style="
          font-size: 17px;
          font-weight: 550;
          letter-spacing: 2px;
          margin-top: 100px;
        "
      >
        你好，李某某
      </div>
      <div
        style="
          font-size: 17px;
          font-weight: 550;
          margin-top: 10px;
          letter-spacing: 2px;
          margin-bottom: 20px;
        "
      >
        需要我怎么帮你呢？
      </div>
      <el-row :gutter="10">
        <el-col
          :span="12"
          v-for="(item, index) in advertisementMenu"
          :key="index"
          style="margin-bottom: 10px"
        >
          <div class="h-ce-1">
            <div class="h-ce-1-d1">
              <img :src="item.img" />
              <span class="label">{{ item.label }}</span>
            </div>
            <div class="h-ce-1-m">{{ item.desc }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="h-footer">
      <div></div>
      <AIinput
        v-model="val"
        placeholder="发消息或选择类型创作"
        leftIcon
        bar
      ></AIinput>
    </div>
  </div>
</template>

<script>
import advertisementMenu from "./advertisementMenu";
import AIinput from "@/components/AIinput/AIinput";
export default {
  components: {
    AIinput,
  },
  data() {
    return {
      advertisementMenu,
      val: "",
    };
  },
};
</script>
<style lang="less" scoped>
.h-container {
  // display: flex;
  // justify-content: space-between;
  // flex-direction: column;
  // align-items: center;
  position: relative;
  width: 70%;
  min-width: 460px;
  max-width: 800px;
  height: calc(100% - 1px);
  margin: 0 auto;
  border-top: 1px solid transparent;
}

.h-footer {
  position: absolute;
  bottom: 20px;
  left: 0px;
  width: 100%;
}
</style>
