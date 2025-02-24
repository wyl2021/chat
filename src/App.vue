<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style lang="less">
@import url("@/assets/styles/variable.less");
@import url("@/assets/styles/elementDark.less");
#app {
  min-width: 100%;
  height: 100%;
  color: var(--fontColorHighlight);
  font-size: @fontSize;
}
</style>
