<template>
  <div class="u-outter" @mouseover="handleMouseover">
    <div>
      <img src="@/assets/images/user-copy.png" />
    </div>
    <div
      class="u-inner"
      v-show="showInfo"
      @mouseover="handleMouseover"
      @mouseout="handleMouseOut"
    >
      <div class="u-i-d1">
        <img src="@/assets/images/user.png" />
        <span>用户：李某某</span>
      </div>
      <div class="u-i-d1">
        <img src="@/assets/images/account.png" />
        <span>账号：<TooltipTxt text="123456" :len="6"></TooltipTxt></span>
      </div>
      <div class="u-i-footer">
        <div class="u-i-f-btn">
          <img src="@/assets/images/out.png" /> <span>退出登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TooltipTxt from "@/components/TooltipTxt/TooltipTxt.vue";
export default {
  components: {
    TooltipTxt,
  },
  data() {
    return {
      showInfo: false,
    };
  },
  methods: {
    handleMouseover() {
      this.showInfo = true;
    },
    handleMouseOut() {
      this.showInfo = false;
    },
  },
};
</script>

<style lang="less" scoped>
.u-outter {
  position: relative;
  margin-left: 10px;
  img {
    width: 28px;
  }
}
.u-inner {
  position: absolute;
  width: 150px;
  height: auto;
  right: 0px;
  border: 1px solid #3b3b3c;
  border-radius: 7px;
  font-size: 13px;
  background: #212126;
}
.u-i-d1 {
  display: flex;
  align-items: center;
  padding: 0px 13px;
  margin-top: 10px;
  img {
    width: 13px;
    margin-right: 7px;
  }
}
.u-i-footer {
  border-top: 1px solid #3b3b3c;
  margin-top: 10px;
  padding: 7px 10px;
}
.u-i-f-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  width: 100%;
  background: #3b3b3c;
  border-radius: 4px;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
  img {
    width: 14px;
    margin-right: 7px;
  }
}
</style>
