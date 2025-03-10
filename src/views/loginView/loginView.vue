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
        <span
          v-if="[0, 1].includes(activeIndex)"
          @click="$refs['rv'].dialogVisible = true"
          >账号注册</span
        >
        <span v-if="activeIndex === 0" @click="$refs['rp'].dialogVisible = true"
          >找回密码</span
        >
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
import retrievePassword from "./retrievePassword.vue";
import { swsLogin, oaLogin } from "@/api/login";
export default {
  components: {
    accountPassword,
    phonePassword,
    phoneCode,
    registerView,
    retrievePassword,
  },
  data() {
    return {
      activeIndex: 0, //0 账号登录  1 手机号登录  2 验证码登录
      submitLoading: false,
    };
  },
  mounted() {
    const token = this.getTokenFromUrl("token");
    const loginType = this.getTokenFromUrl("type");
    console.log(token, loginType);
    if (token && loginType) {
      this.aoAndswsLogin(token, loginType);
    }
  },
  methods: {
    getTokenFromUrl(param) {
      const urlParams = new URLSearchParams(window.location.hash.split("?")[1]);
      const value = urlParams.get(param);
      console.log(urlParams);
      // 处理 URL 编码后的单引号（如果存在）
      return value ? value.replace(/['"]/g, "") : null;
    },
    aoAndswsLogin(token, loginType) {
      console.log('token',token)
      if (loginType === "sws") {
        swsLogin({ token: token }).then((swsRes) => {
          if (swsRes.msg === 0) {
            if (swsRes.msg) {
              this.setToken(swsRes.data.token);
              this.$router.push({
                path: "/",
              });
              this.$message.success("登录成功");
            } else {
              this.$message.error(swsRes.msg);
            }
          } else {
            this.$message.error(swsRes.msg);
          }
        });
      } else if (loginType === "oa") {
        oaLogin({ token: token }).then((oaRes) => {
          if (oaRes.code === 0) {
            if (oaRes.msg) {
              this.setToken(oaRes.data.token);
              this.$router.push({
                path: "/",
              });
              this.$message.success("登录成功");
            } else {
              this.$message.error(oaRes.msg);
            }
          } else {
            this.$message.error(oaRes.msg);
          }
        });
      }
    },
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
        .then(async (res) => {
          if (res.msg) {
            this.$message.error(res.msg);
            return;
          }
          this.setToken(res.data.token);
          this.setUserInfo(res.data);
          // localStorage.setItem("token", res.data.token);
          this.$router.push({
            path: "/",
          });
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
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
    margin-top: 30px;
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
