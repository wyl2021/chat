<!-- 找回密码 -->
<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    title="找回密码"
    width="370px"
    center
  >
    <el-form :model="form" ref="ruleForm" size="small">
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
        prop="pwd"
        label="新密码"
        :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]"
      >
        <el-input
          v-model.trim="form.pwd"
          type="password"
          show-password
          placeholder="请输入您的新密码"
        >
          <i slot="prefix" class="el-input__icon el-icon-lock"></i>
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
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleSubmit"
        >找回密码</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { recoverPassword, sendForgotPasswordCode } from "@/api/login";
import ElementUI from "element-ui";
export default {
  data() {
    return {
      resCode: "获取验证码",
      sLock: false,
      timer: null,
      form: {
        userPhone: "",
        pwd: "",
        code: null,
      },
      dialogVisible: false,
    };
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    // 重置表单数据
    resetForm() {
      this.form = {
        userPhone: "",
        pwd: "",
        code: null,
      };
    },
    //找回密码
    handleSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const res = await recoverPassword(this.form);
          if (res.code !== 1) return ElementUI.Message.error(res.msg);
          this.dialogVisible = false;
          // 用做找回密码后直接贴账号密码
          // this.$emit('register')
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 先验证手机号
    handleCountdown() {
      this.$refs.ruleForm.validateField("userPhone", async (valid) => {
        if (!valid) {
          const res = await sendForgotPasswordCode({
            userPhone: this.form.userPhone,
          });
          if (res.msg) return ElementUI.message.error(res.msg);
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
