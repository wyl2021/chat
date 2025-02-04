<template>
  <div style="display: flex; justify-content: flex-start; align-items: center">
    <el-upload
      class="upload-demo"
      action=""
      accept=".jpg, .jpeg, .png, .gif, .webp"
      :before-upload="handleBeforeUpload"
      multiple
      :show-file-list="false"
      :file-list="fileList"
    >
      <el-button size="mini" type="primary" icon="el-icon-picture"
        >参考图</el-button
      >
    </el-upload>
    <el-dropdown
      class="dropdown-demo"
      size="mini"
      trigger="click"
      @command="handleCommand"
    >
      <el-button
        style="margin-left: 10px"
        size="mini"
        type="primary"
        icon="el-icon-picture"
        >比例</el-button
      >
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-crop" command="1:1"
          >1:1 正方向，头像</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-crop" command="4:3"
          >4:3</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-crop" command="3:4"
          >3:4</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-crop" command="16:9"
          >16:9</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-crop" command="9:16"
          >9:16</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-crop" command="自定义"
          >自定义</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    // 选择比例的效果
    handleCommand(val) {
      let str = "<span>比例：</span>";
      if (val === "自定义") {
        const reg = new RegExp(/[^\d]/g);
        str += `<span>长</span><input type="text" class="inputTs" style="width: 80px" placeholder="请输入长多少" onkeyup="value=value.replace(${reg},'')" /><span>宽</span><input type="text" class="inputTs" style="width: 80px" placeholder="请输入宽多少" onkeyup="value=value.replace(${reg},'')" />`;
      } else {
        const arr = ["1:1", "4:3", "3:4", "16:9", "9:16"];
        str += `<select class="selectTs" txt="${val}">`;
        arr.forEach((ele) => {
          if (ele === val) {
            str += `<option value="${ele}" selected>${ele}</option>`;
          } else {
            str += `<option value="${ele}">${ele}</option>`;
          }
        });
        str += `</select>`;
      }
      this.$emit("change", str);
    },
    // 上传图片之前的操作
    handleBeforeUpload(file) {
      if (!file) return false;
      const that = this;
      const isLt5M = file.size / 1024 / 1024 < this.size;
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过 5MB!");
        return false;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64String = e.target.result; // Base64编码后的数据
        that.$emit("upload", base64String);
      };
      reader.readAsDataURL(file);
      return false;
    },
  },
};
</script>

<style lang="less" scoped></style>
