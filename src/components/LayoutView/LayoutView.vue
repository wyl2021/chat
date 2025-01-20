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
        <img class="logo-img" src="https://www.swsai.com/style/dist/img/icon/logo.png" />
          <!-- <div class="logo">
            <img src="@/assets/images/logo.jpg" />
          </div>
          <span style="font-size: 15px; font-weight: 500">硕为思ChatCar</span> -->
        </div>
        <div style="cursor: pointer" @click="handleCollose">
          <span
            style="font-size: 20px"
            :class="collose ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          ></span>
        </div>
      </div>
      <div style="padding: 0px 13px">
        <LyMenu :isCollapse="collose"></LyMenu>
      </div>
    </div>
    <div class="ly-body">
      <div class="ly-b-header">
        <div></div>
        <div class="ly-b-h-r">
          <span class="el-icon-bell" style="font-size: 15px"></span>
          <userCp></userCp>
        </div>
      </div>
      <div class="ly-b-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import userCp from "./userCp.vue";
import LyMenu from "./LyMenu.vue";
export default {
  components: {
    LyMenu,
    userCp,
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
        this.$refs.ls.style.width = "100px";
      } else {
        this.$refs.ls.style.width = "260px";
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/styles/variable.less");
.ly-container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  min-width: 1200px;
  min-height: 768px;
  overflow: auto;
  background: @backgroundDark;
}
.ly-silder {
  width: 260px;
  background: black;
  height: 100%;
  transition: all 0.3s;
  flex-shrink: 0;
}
.ly-logo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 13px;
  .logo-img {
      display: inline-block;
    width: 177px;
    height: 50px;
    overflow: hidden;
    text-align: center;
    line-height: 50px;
    margin: auto;
    }
  // .logo {
  //   display: inline-block;
  //   width: 26px;
  //   height: 26px;
  //   border-radius: 26px;
  //   background: #212126;
  //   overflow: hidden;
  //   text-align: center;
  //   line-height: 26px;
  //   margin-right: 10px;
  //   img {
  //     width: 100%;
  //   }
  // }
}
.ly-body {
  width: 100%;
  height: 100%;
}
.ly-b-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0px 13px;
  .ly-b-h-r {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
.ly-b-content {
  width: 100%;
  height: calc(100% - 50px);
}
</style>
