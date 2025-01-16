<template>
  <el-form :model="form" ref="ruleForm">
    <el-form-item
      prop="userPhone"
      label="手机号"
      :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' }]"
    >
      <el-input v-model.trim="form.userPhone" placeholder="请输入您的手机号">
        <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
      </el-input>
    </el-form-item>
    <el-form-item
      prop="code"
      label="验证码"
      :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]"
    >
      <el-input v-model.trim="form.code" placeholder="请输入验证码">
        <i slot="prefix" class="el-input__icon el-icon-lock"></i>
        <span slot="append" class="addr" @click="handleCountdown">{{
          resCode
        }}</span>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      resCode: "获取验证码",
      sLock: false,
      timer: null,
      form: {
        userPhone: "",
        code: "",
      },
    };
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    // 提交
    submit() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            resolve(this.form);
          } else {
            console.log("error submit!!");
            reject(false);
            return false;
          }
        });
      });
    },
    // 先验证手机号
    handleCountdown() {
      this.$refs.ruleForm.validateField("userPhone", (valid) => {
        if (!valid) {
          this.countdownFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 倒计时的方法
    countdownFun() {
      if (this.sLock) {
        return;
      }
      this.sLock = true;
      this.resCode = "60s";
      let time = 59;
      this.timer = setInterval(() => {
        if (time < 0) {
          clearInterval(this.timer);
          this.resCode = "获取验证码";
          this.sLock = false;
        } else {
          this.resCode = `${time}s`;
          time--;
        }
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.addr {
  cursor: pointer;
}
</style>
