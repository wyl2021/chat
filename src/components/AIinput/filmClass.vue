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
        <el-dropdown-item icon="el-icon-paperclip" command="裂变类型"
          >裂变类型</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-picture-outline" command="图片生成视频"
          >图片生成视频</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <el-upload
      class="upload-demo"
      action=""
      multiple
      :before-upload="handleBeforeUpload"
      :show-file-list="false"
      :file-list="fileList"
      :http-request="customUpload"
    >
      <el-button size="mini" type="primary" icon="el-icon-picture"
        >素材上传</el-button
      >
    </el-upload>
  </div>
</template>

<script>
import {
  GetChatTempletByType,
  UploadFile,
  GetUploadId,
  CompleteMultipartUpload,
  UploadPart,
} from "@/api/chat";
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
      fileDateList: [],
    };
  },
  created() {
    // this.handleDropdownList()
  },
  methods: {
    customUpload() {},
    handleCommand(val) {
      const arr = ["混剪类型", "裂变类型", "图片生成视频"];
      let dataType = 1;
      let str =
        "<form id='myForm' style='display:inline-block'><span>已</span>";
      str += `<select class="selectTs protected" txt="${val}" required >`;
      arr.forEach((ele) => {
        if (ele === val) {
          str += `<option value="${ele}" selected>${ele}</option>`;
        } else {
          str += `<option value="${ele}">${ele}</option>`;
        }
      });
      str += "</select>";
      str += "<span>创建视频。品牌车型</span>";
      str += `<span required class="inputTTs protected" contenteditable="true" style="min-width: 210px" placeholder="[填写车型，准确到输入品牌、车型]" ></span>`;
      str += "<span>分裂数量</span>";
      const arr1 = [1, 2, 3, 4];
      str += `<select class="selectTs protected" txt="1" required >`;
      arr1.forEach((ele) => {
        if (ele === 1) {
          str += `<option value="${ele}" selected>${ele}</option>`;
        } else {
          str += `<option value="${ele}">${ele}</option>`;
        }
      });
      str += "</select><br>";
      str += "<span>视频文案</span>";
      str += `<span required class="inputTTs protected" contenteditable="true" style="min-width:505px" placeholder="[围绕车型特点、优势、品牌，应简洁明了，要给出小于10个字到主题，或者14个字内" ></span>`;
      str += `<span class="inputTTs protected" contenteditable="true" required style="min-width:360px" placeholder="到副主题，如果不填封面没有文字或者根据车型随机出文案]" ></span><br>`;
      str += "<span>视频长度</span>";
      const arr2 = ["15秒内", "30秒内", "45秒内", "60秒内"];
      str += `<select class="selectTs protected" txt="15" required >`;
      arr2.forEach((ele) => {
        if (ele === 15) {
          str += `<option value="${ele}" selected>${ele}</option>`;
        } else {
          str += `<option value="${ele}">${ele}</option>`;
        }
      });
      str += "</select>";
      str += "<span>视频BGM</span>";
      str += `<span class="inputTTs protected" contenteditable="true" required style="min-width:100px" placeholder="抖音热门BGM" ></span><br>`;
      str += "<span>其他要求</span>";
      str += `<span class="inputTTs protected" contenteditable="true" required style="min-width:100px" placeholder="[其他补充要求]" ></span></form>`;
      this.$emit("change", { str, dataType, type: "video" });
    },
    // 上传图片之前的操作
    async handleBeforeUpload(file) {
      console.log(file, this.fileList);
      if (!file) return false;
      const that = this;
      const isLt5M = file.size / 1024 / 1024 < this.size;
      const fileType = file.type.startsWith("image") ? "imageUrl" : "videoUrl";
      //       const handleSuccess = (url) => {
      //   that.fileDateList.push({
      //     type: fileType,
      //     role: "user",
      //     data: [
      //       {
      //         type: fileType === "imageUrl" ? "originalImage" : "originalVideo",
      //         url: url,
      //       },
      //     ],
      //   });
      //   that.$message.success("上传成功");
      // };
      if (isLt5M) {
        // 小于5M
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        try {
          const response = await UploadFile(formData); // 上传文件接口
          if (response.code === 1) {
            // that.fileDateList.push({
            //   type: fileType,
            //   role: "user",
            //   data: [
            //     {
            //       type:
            //         fileType === "imageUrl" ? "originalImage" : "originalVideo",
            //       url: response.data.address,
            //     },
            //   ], // 上传成功返回的地址
            // });
            // that.$message.success("上传成功");
            const fileDateS = {
              type: fileType,
              role: "user",
              data: [
                {
                  type:
                    fileType === "imageUrl" ? "originalImage" : "originalVideo",
                  url: response.data.address,
                },
              ],
            };
            that.$emit("upload", fileDateS);
            that.$message.success("上传成功");
          } else {
            that.$message.error("上传失败：" + response.msg);
          }
        } catch (error) {
          that.$message.error("上传错误，请重试");
        }
      } else {
        // 大于 5MB：分片上传
        try {
          console.log("file.name", file.name);
          const uploadIdResponse = await GetUploadId({ fileName: file.name }); // 创建分片 ID
          if (uploadIdResponse.code !== 1) return;
          const { uploadId, address } = uploadIdResponse.data;

          const chunkSize = 5 * 1024 * 1024; // 每片 5MB
          const chunks = Math.ceil(file.size / chunkSize);

          for (let i = 0; i < chunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(file.size, start + chunkSize);
            const chunkFile = file.slice(start, end); // 生成分片

            const formData = new FormData();
            formData.append("address", address);
            formData.append("uploadId", uploadId);
            formData.append("chunk", i);
            formData.append("chunks", chunks);
            formData.append("file", chunkFile);

            await UploadPart(formData); // 上传分片
          }

          // 所有分片上传完成后，合并分片
          const mergeResponse = await CompleteMultipartUpload({
            uploadId,
            address,
          });
          if (mergeResponse.code === 1) {
            const fileDateL = {
              type: fileType,
              role: "user",
              data: [
                {
                  type:
                    fileType === "imageUrl" ? "originalImage" : "originalVideo",
                  url: mergeResponse.data.address,
                },
              ],
            };
            that.$emit("upload", fileDateL);
            that.$message.success("上传成功");
            // that.fileDateList.push({
            //   type: fileType,
            //   role: "user",
            //   data: [
            //   {  type:
            //       fileType === "imageUrl" ? "originalImage" : "originalVideo",
            //     url: mergeResponse.data.address,}
            //   ],
            // });
          } else {
            that.$message.error("合并失败：" + mergeResponse.msg);
          }
        } catch (error) {
          that.$message.error("分片上传错误，请重试");
        }
      }

      console.log(that.fileDateList);

      // const reader = new FileReader();
      // reader.onload = function (e) {
      //   const base64String = e.target.result; // Base64编码后的数据
      //   that.$emit("upload", base64String);
      // };
      // reader.readAsDataURL(file);
      // return false;
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
