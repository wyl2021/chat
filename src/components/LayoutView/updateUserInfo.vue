<!-- 修改信息 -->
<template>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      title="修改信息"
      width="370px"
      center
    >
      <el-form :model="form" ref="ruleForm" size="small" v-if="dialogVisible">
      
        <el-form-item
          prop="txtPwd"
          label="新密码"
        >
          <el-input
            v-model.trim="form.txtPwd"
            type="password"
            show-password
            placeholder="请输入您的新密码"
          >
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item
        prop="txtEmail"
        label="邮箱"
       
      >
        <el-input v-model.trim="form.txtEmail" placeholder="请输入您的邮箱">
          <i slot="prefix" class="el-input__icon el-icon-message"></i>
        </el-input>
      </el-form-item>
      <el-form-item
          prop="txtPhone"
          label="手机号"
         
        >
          <el-input v-model.trim="form.txtPhone" placeholder="请输入您的手机号">
            <i slot="prefix" class="el-input__icon el-icon-mobile"></i>
          </el-input>
        </el-form-item>
      <el-form-item
        prop="txtCompany"
        label="公司名"
        
      >
        <el-input
          v-model.trim="form.txtCompany"
          placeholder="请输入您的公司名"
        >
          <i slot="prefix" class="el-input__icon el-icon-discount"></i>
        </el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleSubmit"
          >修改信息</el-button
        >
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </template>
  
  <script>
  import verificate from "@/utils/verificate";
  import { updUser,getUserInfo } from "@/api/login";
  export default {
    data() {
      return {
        verificate,
        form: {
          txtPwd: "",
          txtEmail:"",
          txtPhone: "",
          txtCompany:""
        },
        dialogVisible: false,
      };
    },
   
    methods: {
      // 重置表单数据
      resetForm() {
        this.form = {
            txtPwd: "",
          txtEmail:"",
          txtPhone: "",
          txtCompany:""
        };
      },
      //修改信息
     async handleSubmit() {
        const res = await updUser(this.form);
            if (res.code !== 1) {
              this.$message.error(res.msg);
            }else{
                const userInfo= await getUserInfo()
                await this.setUserInfo(userInfo.data)
                this.resetForm()
                this.$message.success('修改成功')
                this.dialogVisible = false;
            }
            
      },
    
    },
  };
  </script>
  
  <style lang="less" scoped>
  .addr {
    cursor: pointer;
  }
  </style>
  