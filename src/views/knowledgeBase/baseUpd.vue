<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :title="form.id ? '修改信息' : '新增信息'"
    width="37"
  >
    <el-form :model="form" ref="ruleForm" size="small">
      <!-- <el-form-item label="知识库id">
        <el-input v-model.trim="form.id"></el-input>
      </el-form-item> -->
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
      <!-- <el-form-item label="文件">
        <el-upload
          class="upload-demo"
          drag
          action=""
          multiple
          :on-change="handlePreview"
          :file-list="fileList"
          :http-request="customUpload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传txt/docx文件，且不超过5M
          </div>
        </el-upload>
      </el-form-item> -->
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
  computed: {
    // 计算属性，确保 `data` 变化时，`form` 自动同步
    computedForm() {
      return this.data ? {
        id: this.data.Id || null,
        title: this.data.Title || "",
        note: this.data.Note || "",
        isPublic: this.data.IsPublic===1 || false,
      } : { ...this.form };  // 保证在没有数据时，表单不会为空
    }
  },
  watch: {
    computedForm: {
      handler(newForm) {
        this.form = { ...newForm }; // 在 computed 属性变化时同步到 form
      },
      deep: true,  // 深度监听
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
    // // 上传图片之前的操作
    // async handlePreview(file) {
    //   console.log(file);
    //   if (!file) return false;
    //   const that = this;
    //   const isLt5M = file.raw.size / 1024 / 1024 < 5;
    //   if(!isLt5M){
    //     that.$message.error('上传内容不能大于5M')
    //     return 
    //   }
    //   const formData = new FormData();
    //     formData.append("file", file.raw);
    //     formData.append("id", this.form.id);
    //     const fileRes=await UpdKnowledgeBaseFileD(formData)
    //     console.log(fileRes)
    //     if(fileRes.code===1){
    //         that.$message.success("上传成功");
    //     }else{
    //         that.$message.error("上传失败：" + fileRes.msg);
    //     }
    // },
    customUpload() {},
  },
};
</script>

<style lass="less" scoped>
:deep .el-upload-dragger{
  background:transparent !important;
}
</style>