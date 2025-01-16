<template>
  <div id="app" class="theme-dark">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
};
</script>

<style lang="less">
@import url("@/assets/styles/variable.less");
@import url("@/assets/styles/elementDark.less");
#app {
  width: 100%;
  height: 100%;
  color: @fontColorHighlightDark;
  font-size: @fontSize;
}
.theme-dark {
  background: @backgroundDark;
}
</style>
