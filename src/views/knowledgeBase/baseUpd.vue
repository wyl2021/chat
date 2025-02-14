<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :title="form.id ? '修改信息' : '新增信息'"
    width="37"
  >
    <el-form :model="form" ref="ruleForm" size="small">
      <el-form-item label="知识库id">
        <el-input v-model.trim="form.id"></el-input>
      </el-form-item>
      <el-form-item
        prop="title"
        label="标题"
        :rules="verificate({ msg: '请输入标题' })"
      >
        <el-input v-model.trim="form.title"></el-input>
      </el-form-item>
      <el-form-item
        prop="note"
        label="简介"
        :rules="verificate({ msg: '请输入简介' })"
      >
        <el-input v-model.trim="form.note"></el-input>
      </el-form-item>
      <el-form-item label="是否公开">
        <el-switch v-model="form.isPublic"></el-switch>
      </el-form-item>
      <el-form-item label="文件">
        <el-upload
          class="upload-demo"
          drag
          action=""
          multiple
          :before-upload="handleBeforeUpload"
          :show-file-list="false"
          :file-list="fileList"
          :http-request="customUpload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传txt/docx文件，且不超过5M
          </div>
        </el-upload>
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
import { SaveKnowledgeBase,UpdKnowledgeBaseFileD } from "@/api/knowledgeBase";
export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      verificate,
      dialogVisible: false,
      form: {
        id: null,
        title: "",
        note: "",
        isPublic: 0,
      },
      fileList: [],
  
    };
  },
  watch: {
    data: {
      handler(newData) {
        if (newData) {
          this.form.id = newData.Id || null;
          this.form.title = newData.Title || "";
          this.form.note = newData.Note || "";
          this.form.isPublic = newData.IsPublic || 0;
        }
      },
    },
  },
  methods: {
    handleSure() {
      console.log(this.form);
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          SaveKnowledgeBase(this.form).then((res) => {
            if (res.code === 1) {
              this.$emit("addAndUpd", true);
              this.dialogVisible = false;
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    // 上传图片之前的操作
    async handleBeforeUpload(file) {
      console.log(file);
      if (!file) return false;
      const that = this;
      const isLt5M = file.size / 1024 / 1024 < 5;
      if(!isLt5M){
        that.$message.error('上传内容不能大于5M')
        return 
      }
      const formData = new FormData();
        formData.append("file", file);
        formData.append("id", this.form.id);
        const fileRes=await UpdKnowledgeBaseFileD(formData)
        console.log(fileRes)
        if(fileRes.code===1){
            that.$message.success("上传成功");
        }else{
            that.$message.error("上传失败：" + fileRes.msg);
        }
    },
    customUpload() {},
  },
};
</script>

<style>
</style>