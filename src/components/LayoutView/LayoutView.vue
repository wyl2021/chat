<template>
  <div class="ly-container">
    <div class="ly-silder" ref="ls">
      <div class="ly-logo">
        <div
          style="
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-shrink: 0;
          "
          v-if="!collose"
        >
          <div class="logo">
            <img src="@/assets/images/logo.jpg" />
          </div>
          <span style="font-size: 15px; font-weight: 500">硕为思ChatCar</span>
        </div>
        <div style="cursor: pointer" @click="handleCollose">
          <span
            style="font-size: 20px"
            :class="collose ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          ></span>
        </div>
      </div>
      <div style="padding: 0px 13px">
        <LyMenu></LyMenu>
      </div>
    </div>
    <div class="ly-body"></div>
  </div>
</template>

<script>
import LyMenu from "./LyMenu.vue";
export default {
  components: {
    LyMenu,
  },
  data() {
    return {
      collose: false,
    };
  },
  methods: {
    handleCollose() {
      this.collose = !this.collose;
      if (this.collose) {
        this.$refs.ls.style.width = "50px";
      } else {
        this.$refs.ls.style.width = "260px";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.ly-container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  min-width: 1200px;
  min-height: 768px;
  overflow: auto;
}
.ly-silder {
  width: 260px;
  background: black;
  height: 100%;
  transition: all 0.3s;
}
.ly-logo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 13px;
  .logo {
    display: inline-block;
    width: 26px;
    height: 26px;
    border-radius: 26px;
    background: #212126;
    overflow: hidden;
    text-align: center;
    line-height: 26px;
    margin-right: 10px;
    img {
      width: 100%;
    }
  }
}
</style>
