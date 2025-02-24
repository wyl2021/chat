<!-- 用户信息 -->
<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    title="用户信息"
    width="370px"
    center
  >
    <el-form ref="ruleForm" size="small" v-if="dialogVisible">
      <el-form-item
        v-for="(item, index) in formFields"
        :key="index"
        :label="item.label"
      >
        <el-input
          v-model.trim="item.value"
          :readonly="true"
          :placeholder="item.placeholder"
        >
          <i :slot="item.prefixSlot" :class="item.prefixIcon"></i>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
  
  <script>
import store from "@/store/store";
export default {
  data() {
    return {
      store,
      dialogVisible: false,
      
    };
  },
  computed: {
    formFields() {
      const userInfo = store.getters.getUserInfo || {};
      return [
        {
          label: "用户名",
          value: userInfo.user_name || "-",
          placeholder: "请输入您的用户名",
          prefixSlot: "prefix",
          prefixIcon: "el-input__icon el-icon-user",
        },
        {
          label: "oaId",
          value: userInfo.user_oaid || "-",
          placeholder: "请输入您的 oaId",
          prefixSlot: "prefix",
          prefixIcon: "el-input__icon el-icon-user",
        },
        {
          label: "swsId",
          value: userInfo.user_swsid || "-",
          placeholder: "请输入您的 swsId",
          prefixSlot: "prefix",
          prefixIcon: "el-input__icon el-icon-user",
        },
        {
          label: "邮箱",
          value: userInfo.email || "-",
          placeholder: "请输入您的邮箱",
          prefixSlot: "prefix",
          prefixIcon: "el-input__icon el-icon-message",
        },
        {
          label: "手机号",
          value: userInfo.phone || "-",
          placeholder: "请输入您的手机号",
          prefixSlot: "prefix",
          prefixIcon: "el-input__icon el-icon-mobile",
        },
        {
          label: "公司名",
          value: userInfo.company || "-",
          placeholder: "请输入您的公司名",
          prefixSlot: "prefix",
          prefixIcon: "el-input__icon el-icon-discount",
        },
      ];
    },
  },
  methods: {},
};
</script>
  
  <style lang="less" scoped>
.addr {
  cursor: pointer;
}
.el-input__suffix {
  opacity: 1 !important;
  transition: none !important;
}

.el-input__suffix-inner {
  visibility: visible !important;
}
</style>
  