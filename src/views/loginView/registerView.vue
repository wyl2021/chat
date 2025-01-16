<!-- 账号注册 -->
<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    title="账号注册"
    width="370px"
    center
  >
    <el-form :model="form" ref="ruleForm" size="small" v-if="dialogVisible">
      <el-form-item
        prop="userName"
        label="用户名"
        :rules="verificate({ type: 'account', msg: '请输入用户名' })"
      >
        <el-input v-model.trim="form.userName" placeholder="请输入您的用户名">
          <i slot="prefix" class="el-input__icon el-icon-user"></i>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="userEmail"
        label="邮箱"
        :rules="verificate({ type: 'email', msg: '请输入邮箱' })"
      >
        <el-input v-model.trim="form.userEmail" placeholder="请输入您的邮箱">
          <i slot="prefix" class="el-input__icon el-icon-message"></i>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="userPhone"
        label="手机号"
        :rules="verificate({ type: 'mobile', msg: '请输入手机号' })"
      >
        <el-input v-model.trim="form.userPhone" placeholder="请输入您的手机号">
          <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="userCompany"
        label="公司名"
        :rules="verificate({ msg: '请输入公司名' })"
      >
        <el-input
          v-model.trim="form.userCompany"
          placeholder="请输入您的公司名"
        >
          <i slot="prefix" class="el-input__icon el-icon-discount"></i>
        </el-input>
      </el-form-item>

      <el-form-item
        prop="pwd"
        label="密码"
        :rules="verificate({ type: 'password', msg: '请输入密码' })"
      >
        <el-input
          v-model.trim="form.pwd"
          type="password"
          show-password
          placeholder="请输入您的密码"
        >
          <i slot="prefix" class="el-input__icon el-icon-lock"></i>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="code"
        label="手机验证码"
        :rules="verificate({ msg: '请输入验证码' })"
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
        >注 册</el-button
      >
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import verificate from "@/utils/verificate";
import { sendRegisterCode, register } from "@/api/login";
export default {
  data() {
    return {
      verificate,
      form: {
        userName: "",
        userEmail: "",
        userPhone: "",
        userCompany: "",
        pwd: "",
        code: null,
      },
      dialogVisible: false,
      resCode: "获取验证码",
      sLock: false,
      timer: null,
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
        userName: "",
        userEmail: "",
        userPhone: "",
        userCompany: "",
        pwd: "",
        code: null,
      };
    },

    // 先验证手机号
    handleCountdown() {
      this.$refs.ruleForm.validateField(["userName", "userPhone"], (valid) => {
        if (!valid) {
          this.countdownFun(async () => {
            const res = await sendRegisterCode({
              userName: this.form.userName,
              userPhone: this.form.userPhone,
            });
            if (res.msg) {
              this.$message.error(res.msg);
              return false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 倒计时的方法
    countdownFun(callback) {
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
      callback && callback();
    },
    // 账号注册
    handleSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const res = await register(this.form);
          if (res.code !== 1) {
            this.$message.error(res.msg);
            return false;
          }
          this.$message.success("注册成功");
          this.dialogVisible = false;
          // 用做注册成功后直接贴账号密码
          // this.$emit('register')
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.addr {
  cursor: pointer;
}
</style>
