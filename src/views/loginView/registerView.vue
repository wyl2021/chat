<!-- 账号注册 -->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="账号注册"
    width="45%"
    :before-close="handleClose"
    center
  >
    <el-form :model="form" ref="ruleForm">
      <el-form-item
        prop="userName"
        label="用户名"
        :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
      >
        <el-input v-model.trim="form.userName" placeholder="请输入您的用户名">
          <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="userEmail"
        label="邮箱"
        :rules="[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: '邮箱格式不正确',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model.trim="form.userEmail" placeholder="请输入您的邮箱">
          <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="userPhone"
        label="手机号"
        :rules="[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model.trim="form.userPhone" placeholder="请输入您的手机号">
          <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="userCompany"
        label="公司名"
        :rules="[{ required: true, message: '请输入公司名', trigger: 'blur' }]"
      >
        <el-input
          v-model.trim="form.userCompany"
          placeholder="请输入您的公司名"
        >
          <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
        </el-input>
      </el-form-item>

      <el-form-item
        prop="pwd"
        label="密码"
        :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
      >
        <el-input
          v-model.trim="form.pwd"
          type="password"
          show-password
          placeholder="请输入您的密码"
        >
          <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="code"
        label="手机验证码"
        :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
      >
        <el-input v-model.trim="form.code" placeholder="请输入验证码">
          <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
          <span slot="append" class="addr" @click="handleCountdown">{{
          resCode
        }}</span>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">注 册</el-button>
    </span>
  </el-dialog>
</template>
<script >
export default {
  data() {
    return {
      form: {
        userName: "",
        userEmail: "",
        userPhone: "",
        userCompany: "",
        pwd: "",
        code: null,
      },
      dialogVisible: false,
      resCode:'获取验证码',
      sLock: false,
      timer: null,
    };
  },
  methods: {
    // 关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
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
// 账号注册
handleSubmit(){
    this.$refs.ruleForm.validate((valid) => {
      if (valid) {
        console.log("账号注册",this.form);
      } else {
        console.log("error submit!!");
        return false;
      }
    });
}
  },
};
</script>
<style scoped lang='less'>
::v-deep(.el-dialog) {
  background-color: #1e1e1e;
}
::v-deep(.el-dialog__title){
    color:#FFF
}
::v-deep(.el-input__inner){
   border: 1px solid #454545;
  outline: none; 
  background-color: transparent !important; /* 去掉默认背景色 */
}

</style>
