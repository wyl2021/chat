<template>
  <div class="lg-outer">
    <div class="lg-inner">
      <div class="lg-logo">
        <img
          src="https://card-img1.oss-cn-beijing.aliyuncs.com/van-chatcar/icon/logo.png"
        />
      </div>
      <div class="lg-select">
        <div
          class="lg-s-d1"
          :class="activeIndex === 0 ? 'lg-s-d1-active' : ''"
          @click="handleLoginType(0)"
        >
          账号登录
        </div>
        <div
          class="lg-s-d1"
          :class="[1, 2].includes(activeIndex) ? 'lg-s-d1-active' : ''"
          style="margin-left: 20px"
          @click="handleLoginType(1)"
        >
          手机号登录
        </div>
      </div>
      <accountPassword ref="ap" v-if="activeIndex === 0"></accountPassword>
      <phonePassword ref="pp" v-if="activeIndex === 1"></phonePassword>
      <phoneCode ref="pc" v-if="activeIndex === 2"></phoneCode>
    
      <div class="lg-iss">
        <span v-if="[0, 1].includes(activeIndex)" @click="$refs['rv'].dialogVisible=true">账号注册</span>
        <span v-if="activeIndex === 0" @click="$refs['rp'].dialogVisible=true">找回密码</span>
        <span v-if="activeIndex === 1" @click="handleLoginType(2)"
          >验证码登录</span
        >
      </div>
      <el-button
        class="lg-submit"
        type="primary"
        @click="handleSubmit"
        :loading="submitLoading"
        >登录</el-button
      >
    </div>
    <retrievePassword ref="rp"></retrievePassword>
    <registerView ref="rv"></registerView>
  </div>
</template>

<script>
import accountPassword from "./accountPassword.vue";
import phonePassword from "./phonePassword.vue";
import phoneCode from "./phoneCode.vue";
import registerView from "./registerView.vue";
import ElementUI from "element-ui";
import retrievePassword from "./retrievePassword.vue"
export default {
  components: {
    accountPassword,
    phonePassword,
    phoneCode,
    registerView,
    retrievePassword
  },
  data() {
    return {
      activeIndex: 0,//0 账号登录  1 手机号登录  2 验证码登录
       submitLoading: false,
    };
  },
  methods: {
 
    // 切换不同登录模式
    handleLoginType(n) {
      this.activeIndex = n;
    },
    // 登录
    handleSubmit() {
      const formName = ["ap", "pp", "pc"][this.activeIndex];
      this.submitLoading = true;
      this.$refs[formName]
        .submit()
        .then(async(res) => {
      console.log(res)
      if(res.msg) return ElementUI.Message.error(res.msg);
        localStorage.setItem("token",res.data.token);  
        this.$router.push({
          path: "/",
        })
       }) .finally(() => {
          this.submitLoading = false;
        });
      }
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/styles/variable.less");
.lg-outer {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("https://card-img1.oss-cn-beijing.aliyuncs.com/van-chatcar/image/loginBg.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.lg-inner {
  width: 300px;
  height: auto;
  position: absolute;
  top: 50%;
  right: 20%;
  transform: translateY(-50%);
  .lg-logo {
    width: 100%;
    text-align: center;
    img {
      width: 186px;
    }
  }
  .lg-select {
    display: flex;
    justify-content: flex-start;
    justify-content: center;
    color: @fontColorDark;
    font-size: 15px;
    margin-top: 10px;
    cursor: pointer;
    margin-bottom: 15px;
  }

  .lg-s-d1 {
    border-bottom: 1px solid transparent;
    padding: 5px 0px;
  }
  .lg-s-d1-active {
    border-bottom: 1px solid @borderPrimaryDark;
    color: @fontColorHighlightDark;
  }
  .lg-iss {
    display: flex;
    justify-content: space-between;
    color: #218bda;
    cursor: pointer;
  }
}
.lg-submit {
  width: 100%;
  height: 36px;
  letter-spacing: 5px;
  margin-top: 20px;
  font-weight: 500;
  font-size: 15px;
}
</style>
