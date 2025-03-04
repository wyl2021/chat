<template>
  <div class="bd-content">
    <div style="display: flex; justify-content: flex-end">
      <el-button
        size="mini"
        type="text"
        icon="el-icon-arrow-left"
        @click="handleBack"
        >返回</el-button
      >
    </div>
    <div class="bd-body">
      <el-table v-show="!loading" :data="baseDetailsList">
        <el-table-column prop="Id" label="id" />
        <el-table-column prop="Title" label="标签" />
        <el-table-column prop="AddTime" label="添加时间">
          <template slot-scope="scope">
            <span>{{ scope.row.AddTime.substring(0, 10) }}</span>
          </template>
        </el-table-column>
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

            <el-button
              @click="handleAction('edit',scope.row)"
              type="text"
              size="small"
            >
              修改
            </el-button>
            <el-button
              @click="handleAction('view',scope.row)"
              type="text"
              size="small"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="handleAction('new')">增 加</el-button>
      </div>
      <baseDilUpd
        ref="bDilUpd"
        @addAndUpd="handleAdd"
        :data="baseDilInfo"
      ></baseDilUpd>
      <div v-show="loading" class="loading-text">
        <el-spinner></el-spinner> 数据加载中...
      </div>
    </div>
    <div class="bd-footer">
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
    </div>
  </div>
</template>

<script>
import {
  GetKnowledgeBaseToContentsD,
  DelKnowledgeBaseD,
  GetKnowledgeBaseListD,
} from "@/api/knowledgeBase";
import baseDilUpd from "./baseDilUpd.vue";
export default {
  components: {
    baseDilUpd,
  },
  data() {
    return {
      baseDetailsList: [],
      id: null,
      loading: true, // 控制加载状态
      params: {
        pageIndex: 1,
        pageSize: 10,
      },
      current: {
        page: 1,
        pageInx: 1,
        pageTotal: 100,
      },
      baseDilInfo: null,
      baseDilContents: "",
    };
  },
  watch: {
    $route(to) {
      this.id = to.query.id;
    },
    // 监听分页参数变化
    "current.page"(newPage) {
      this.params.pageIndex = newPage;
      this.handleDilList(); // 自动查询
    },
    "current.pageInx"(newPageSize) {
      this.params.pageSize = newPageSize;
      this.handleDilList(); // 自动查询
    },
  },
  created() {
    this.id = this.$route.query.id;
    this.handleDilList();
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
    handleDilList() {
      GetKnowledgeBaseListD({ ...this.params, id: this.id }).then((res) => {
        if (res.code === 1) {
          this.baseDetailsList = res.data;
          this.current.pageTotal = res.total;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error(res.msg);
        }
      });
    },
    // 删除
    handleDel(del) {
      console.log(del);
      if (!(this.id && del.Id)) return;
      DelKnowledgeBaseD({ id: Number(this.id), idD: Number(del.Id) }).then(
        (res) => {
          if (res.code === 1) {
            this.handleDilList();
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
        }
      );
    },
    // 修改and增加 调修改增加界面
    async handleAction(action, upd = null) {
      if (action === "new") {
        // 新增时，只需要传递 id
        this.baseDilInfo = {
          id: Number(this.id),
          idD: null,
          contents: "",
        };
        this.$refs.bDilUpd.dialogVisible = true;
      } else if (action === "edit" && upd && upd.Id) {
        // 修改时，需要传递 id 和 idD，并且调用详情接口
        await this.handleDil({ Id: upd.Id }); // 获取详情数据
        this.baseDilInfo = {
          id: Number(this.id),
          idD: Number(upd.Id) || null,
          contents: this.baseDilContents || "",
        };
        this.$refs.bDilUpd.dialogVisible = true;
      } else if (action === "view" && upd && upd.Id) {
        // 查看详情时，只需要传递 idD，并获取详情数据
        await this.handleDil({ Id: upd.Id }); // 获取详情数据并显示
        this.baseDilInfo = {
          id: Number(this.id),
          idD: Number(upd.Id) || null,
          contents: this.baseDilContents || "",
        };
        this.$refs.bDilUpd.dialogVisible = true;
      }
    },
    // 详情
    handleDil(dil) {
      console.log(dil);
      if (!dil.Id) return;
      GetKnowledgeBaseToContentsD({ idD: dil.Id }).then((res) => {
        if (res.code === 1) {
          this.baseDilContents = res.data;
          this.baseDilInfo.contents = res.data;

          console.log(res);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取修改增加结果
    handleAdd(res) {
      if (res) {
        this.handleDilList();
      }
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.current.pageInx = val; // 更新每页条数
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current.page = val; // 更新当前页
    },
  },
};
</script>

<style scoped lang='less'>
.bd-content {
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  .bd-body {
    height: 80%;
  }
  .bd-footer {
    position: fixed;
    bottom: 20px;
  }
}
</style>