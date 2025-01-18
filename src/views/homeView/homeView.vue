<template>
  <div class="h-container">
    <div>2222</div>
    <div class="h-footer">
      <div></div>
      <AIinput v-model="val" bar></AIinput>
    </div>
  </div>
</template>

<script>
import AIinput from "@/components/AIinput/AIinput";
export default {
  components: {
    AIinput,
  },
  data() {
    return {
      val: "3423423",
    };
  },
};
</script>
<style lang="less" scoped>
.h-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 26px);
  height: calc(100% - 35px);
  padding: 10px 13px 20px 13px;
}
.h-footer {
  width: 70%;
  min-width: 460px;
  max-width: 800px;
}
</style>
