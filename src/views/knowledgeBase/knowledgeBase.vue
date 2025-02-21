<template>
  <el-container style="height: 100%">
    <div style="display: flex; justify-content: flex-end; margin-right: 24px">
      <el-button
        size="mini"
        type="text"
        icon="el-icon-arrow-left"
        @click="handleBack"
        >返回</el-button
      >
    </div>
    <el-header>
      <el-form ref="form" :model="form" label-width="80px" style="width: 30%">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span class="b-s-button" @click="handleSearch"> 搜 索 </span>
      <span class="b-s-button" @click="handleUpd({})"> 新 增 </span>
    </el-header>
    <el-main>
      <el-table :data="baseList" style="background: transparent">
        <el-table-column prop="Title" label="标签" />
        <el-table-column prop="AddTime" label="添加时间">
          <template slot-scope="scope">
            <span>{{ scope.row.AddTime.substring(0, 10) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Count" label="详情数量" />
        <el-table-column prop="SetStr" label="提示词前缀" />
        <el-table-column prop="Uid" label="添加用户" />
        <el-table-column prop="Note" label="简介" />
        <el-table-column prop="IsPublic" label="是否公开">
          <template slot-scope="scope">{{
            scope.row.IsPublic ? "公开" : "隐藏"
          }}</template>
        </el-table-column>
        <el-table-column prop="UserName" label="添加用户" />
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="handleDel(scope.row)"
            >
              <el-button type="text" size="small" slot="reference"
                >删除</el-button
              >
            </el-popconfirm>

            <el-button @click="handleUpd(scope.row)" type="text" size="small">
              修改
            </el-button>
            <el-button type="text" size="small" @click="handleDialog(scope.row)">
              上传文件
            </el-button>

            <el-button
              @click="handleDetails(scope.row)"
              type="text"
              size="small"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <baseUpd ref="bUpd" :data="baseInfo" @addAndUpd="handleAdd"></baseUpd>
      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        title="上传文件"
        width="30%"
      >
        <el-upload
          class="upload-demo"
          style=''
          action=""
          drag
          :on-change="
            (file, fileList) => handlePreview( file, fileList)
          "
          :file-list="fileList"
          :http-request="customUpload"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>单次最多50个文件</div>
          <div class="el-upload__tip" >
            单文件限制5M，单篇文章限2500字，只支持txt/docx
          </div>
          <!-- slot="tip" -->
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="current.pageInx"
        layout="total, sizes, prev, pager, next, jumper"
        :total="current.pageTotal"
      >
      </el-pagination>
    </el-footer>
  </el-container>
</template>
<script >
import {
  GetKnowledgeBaseList,
  DelKnowledgeBase,
  UpdKnowledgeBaseFileD,
} from "@/api/knowledgeBase";
import baseUpd from "./baseUpd.vue";
export default {
  components: {
    baseUpd,
  },
  data() {
    return {
      form: {
        title: "",
      },
      params: {
        pageIndex: 1,
        pageSize: 10,
      },
      baseList: [],
      current: {
        page: 1,
        pageInx: 1,
        pageTotal: 100,
      },
      baseInfo: null,
      dialogVisible: false,
      fileList:[],
      row:null
    };
  },
  created() {
    this.handleList();
  },
  watch: {
    // 监听分页参数变化
    "current.page"(newPage) {
      this.params.pageIndex = newPage;
      this.handleList(); // 自动查询
    },
    "current.pageInx"(newPageSize) {
      this.params.pageSize = newPageSize;
      this.handleList(); // 自动查询
    },
  },
  methods: {
    handleDialog(res){
      this.row=res
      this.dialogVisible = true
    },
    handleBack() {
      this.$router.go(-1);
    },
    handleSearch() {
      // 点击搜索按钮时触发数据查询
      this.params.pageIndex = 1; // 重置页码
      this.handleList();
    },
    handleList() {
      GetKnowledgeBaseList({ ...this.params, ...this.form }).then((res) => {
        if (res.code === 1) {
          this.baseList = res.data;
          this.current.pageTotal = res.total;
          this.form.title = "";
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.current.pageInx = val; // 更新每页条数
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current.page = val; // 更新当前页
    },
    // 删除
    handleDel(row) {
      console.log(row);
      DelKnowledgeBase({ id: row.Id }).then((res) => {
        if (res.code === 1) {
          this.handleList();
          this.$message({
            type: "success",
            message: "删除成功",
          });
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    handleAdd(res) {
      if (res) {
        this.handleList();
      }
      // SaveKnowledgeBase().then(res)
    },
    // 修改
    handleUpd(res) {
      this.baseInfo = res;
      console.log(this.baseInfo);
      this.$nextTick(() => {
        this.$refs.bUpd.dialogVisible = true;
      });
    },
    // 详情
    handleDetails(dil) {
      this.$router.push({
        path: "/baseDetails",
        query: {
          id: dil.Id,
        },
      });
    },
    // 上传图片之前的操作
    async handlePreview( file) {
      console.log(this.row, file);

      if (!file) return false;

      const isLt5M = file.raw.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("上传内容不能大于5M");
        return;
      }

      const formData = new FormData();
      formData.append("file", file.raw);
      formData.append("id", this.row.Id);

      try {
        const fileRes = await UpdKnowledgeBaseFileD(formData);
        console.log(fileRes);

        if (fileRes.code === 1) {
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败：" + fileRes.msg);
        }
      } catch (error) {
        this.$message.error("上传出错: " + error.message);
      }
    },
    customUpload() {},
  },
};
</script>
<style scoped lang='less'>
:deep.el-header {
  display: flex;
  align-content: center;
}

.b-s-button {
  background: #2f96ec;
  padding: 10px 15px 0 15px;
  height: 30px;
  text-align: center;
  border-radius: 5px;
  margin-left: 50px;
  cursor: default;
}
:deep .el-upload-dragger{
  background:transparent !important;
}

</style>

