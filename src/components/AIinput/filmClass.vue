<template>
  <div style="display: flex; justify-content: flex-start; align-items: center">
    <el-dropdown
      class="dropdown-demo"
      size="mini"
      trigger="click"
      @command="handleCommand"
    >
      <el-button
        style="margin-right: 10px"
        size="mini"
        type="primary"
        icon="el-icon-s-marketing"
        >二创类型</el-button
      >
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-s-management" command="混剪类型"
          >混剪类型</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-paperclip" command="混剪类型"
          >混剪类型</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-picture-outline" command="图片生成视频"
          >图片生成视频</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <el-upload
      class="upload-demo"
      action=""
      accept=".jpg, .jpeg, .png, .gif, .webp"
      multiple
      :before-upload="handleBeforeUpload"
      :show-file-list="false"
      :file-list="fileList"
    >
      <el-button size="mini" type="primary" icon="el-icon-picture"
        >素材上传</el-button
      >
    </el-upload>
  </div>
</template>

<script>
import { GetChatTempletByType } from "@/api/chat";
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
      dropdownList: [], ///视频上传类型列表
    };
  },
  created() {
    // this.handleDropdownList()
  },
  methods: {
    handleCommand(val) {
      const arr = ["混剪类型", "混剪类型", "图片生成视频"];
      let str = "<span>已</span>";
      str += `<select class="selectTs" txt="${val}">`;
      arr.forEach((ele) => {
        if (ele === val) {
          str += `<option value="${ele}" selected>${ele}</option>`;
        } else {
          str += `<option value="${ele}">${ele}</option>`;
        }
      });
      str += "</select>";
      str += "<span>创建视频。品牌车型</span>";
      str += `<input type="text" class="inputTs" style="width: 210px" placeholder="[填写车型，准确到输入品牌、车型]"  />`;
      str += "<span>分裂数量</span>";
      const arr1 = [1, 2, 3, 4];
      str += `<select class="selectTs" txt="1">`;
      arr1.forEach((ele) => {
        if (ele === 1) {
          str += `<option value="${ele}" selected>${ele}</option>`;
        } else {
          str += `<option value="${ele}">${ele}</option>`;
        }
      });
      str += "</select><br>";
      str += "<span>视频文案</span>";
      str += `<input type="text" class="inputTs" style="width:505px" placeholder="[围绕车型特点、优势、品牌，应简洁明了，要给出小于10个字到主题，或者14个字内"  />`;
      str += `<input type="text" class="inputTs" style="width:360px" placeholder="到副主题，如果不填封面没有文字或者根据车型随机出文案]" /><br>`;
      str += "<span>视频长度</span>";
      const arr2 = ["15秒内", "30秒内", "45秒内", "60秒内"];
      str += `<select class="selectTs" txt="15">`;
      arr2.forEach((ele) => {
        if (ele === 15) {
          str += `<option value="${ele}" selected>${ele}</option>`;
        } else {
          str += `<option value="${ele}">${ele}</option>`;
        }
      });
      str += "</select>";
      str += "<span>视频BGM</span>";
      str += `<input type="text" class="inputTs" style="width:100px" placeholder="抖音热门BGM"  /><br>`;
      str += "<span>其他要求</span>";
      str += `<input type="text" class="inputTs" style="width:100px" placeholder="[其他补充要求]"  />`;
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
    handleDropdownList() {
      GetChatTempletByType({ type: "二创类型" }).then((res) => {
        if (res.code === 1) {
          this.dropdownList = res.data || [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
