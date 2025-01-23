<template>
  <div class="h-container">
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
        v-for="(item, index) in collectList"
        :key="index"
        style="margin-bottom: 10px"
      >
        <div class="h-c-collect" @click="jump(item)">
          <div class="remark">{{ item.remark || "-" }}</div>
          <div class="templetName">{{ item.templetName || "-" }}</div>
          <div class="h-c-collect-d" v-if="item.data">
            <div v-if="item.data[0].type === 'question'" class="content">
              {{ item.data[0].content || "-" }}
            </div>
            <div v-if="item.data[0].type === 'imageUrl'">
              <img v-if="item.data[0].data" :src="item.data[0].data[0].url" />
            </div>
            <div v-if="item.data[0].type === 'videoUrl'">
              <video
                v-if="item.data[0].data"
                :src="item.data[0].data[0].url"
              ></video>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script >
import { GetChatList } from "@/api/chat";
export default {
  data() {
    return {
      collectList: [],
      prams: {
        pageIndex: 1,
        pageSize: 10,
        collect: 1,
      },
    };
  },
  created() {
    this.handleCollect();
  },
  methods: {
    handleCollect() {
      GetChatList(this.prams).then((res) => {
        if (res.code === 1) {
          this.collectList = res.data || [];
          console.log(this.collectList);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style scoped lang='less'>
</style>
