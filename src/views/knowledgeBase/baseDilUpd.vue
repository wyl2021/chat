<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :title="type==='edit' ? '修改信息' : type==='view'?'详情':'新增信息'"
    width="37"
  >
    <el-form :model="form" ref="ruleForm" size="small">
      <el-form-item prop="contents" label="内容" :rules="verificate({ msg: '请输入内容' })">
        <el-input v-model.trim="form.contents" type="textarea" :autosize="{ minRows: 1, maxRows: 10 }"></el-input>
      </el-form-item>
      <!-- <el-form-item label="文件" :rules="verificate({ msg: '请输入内容' })">
            <el-upload
  class="upload-demo"
  drag
  action="https://jsonplaceholder.typicode.com/posts/"
  multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
        </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button v-if="type!=='view'" type="primary" @click="handleSure">确 定</el-button>
    </span>
  </el-dialog>
</template>
  
  <script>
import verificate from "@/utils/verificate";
import { SaveKnowledgeBaseD } from "@/api/knowledgeBase";
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
        idD: null,
        contents: "",
      },
      type:'new'
    };
  },
  watch: {
    data: {
      handler(newData) {
        console.log(newData);
        if (newData) {
          this.form.id = newData.id || null;
          this.form.idD = newData.idD || null;
          this.form.contents = newData.contents || "";
          this.type=newData.type
        }
      },
      deep: true,
    },
  },
  methods: {
    handleSure() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          SaveKnowledgeBaseD(this.form).then((res) => {
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
  },
};
</script>
  
  <style>
</style>