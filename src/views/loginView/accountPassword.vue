<template>
  <el-form :model="form" ref="ruleForm">
    <el-form-item
      prop="userName"
      label="账号"
      :rules="verificate({ msg: '请输入账号' })"
    >
      <el-input v-model.trim="form.userName" placeholder="请输入您的账号">
        <i slot="prefix" class="el-input__icon el-icon-user"></i>
      </el-input>
    </el-form-item>
    <el-form-item
      prop="pwd"
      label="密码"
      :rules="verificate({ msg: '请输入密码' })"
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
  </el-form>
</template>

<script>
import verificate from "@/utils/verificate";
import { accountLogin } from "@/api/login";
export default {
  data() {
    return {
      verificate,
      form: {
        userName: "",
        pwd: "",
      },
    };
  },
  methods: {
    // 提交
    submit() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            const res = await accountLogin(this.form);
            resolve(res);
          } else {
            console.log("error submit!!");
            reject(false);
            return false;
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
