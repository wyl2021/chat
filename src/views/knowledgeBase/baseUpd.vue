<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :title="form.id?'修改信息':'新增信息'"
    width="37"
  >
    <el-form :model="form" ref="ruleForm" size="small">
      <el-form-item label="知识库id">
        <el-input v-model.trim="form.id"></el-input>
      </el-form-item>
      <el-form-item label="标题" :rules="verificate({ msg: '请输入标题' })">
        <el-input v-model.trim="form.title"></el-input>
      </el-form-item>
      <el-form-item label="简介" :rules="verificate({ msg: '请输入简介' })">
        <el-input v-model.trim="form.note"></el-input>
      </el-form-item>
      <el-form-item label="是否公开">
        <el-switch v-model="form.isPublic"></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSure">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import verificate from "@/utils/verificate";
import { SaveKnowledgeBase } from "@/api/knowledgeBase";
export default {
  props: {
    data: {
      type: Object,
      default:null
    },
  },
  data() {
    return {
      verificate,
      dialogVisible: false,
      form: {
        id: this.data?.Id || null,
        title: this.data?.Title || "",
        note: this.data?.Note || "",
        isPublic: this.data?.IsPublic || 0,
      },
    };
  },
  methods: {
    handleSure() {
      console.log(this.form);
      SaveKnowledgeBase(this.form).then((res) => {
        if (res.code === 1) {
          this.$emit("addAndUpd", true);
          this.dialogVisible = false;
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style>
</style>