<template>
  <div class="h-container">
    <div style="width: 100%">
      <div class="h-t-1" style="margin-top: 100px">
        你好，{{ getUserInfo.user_name || "-" }}
      </div>
      <div class="h-t-2">需要我怎么帮你呢？</div>
      <el-row :gutter="10">
        <el-col
          :span="12"
          v-for="(item, index) in advertisementMenu"
          :key="index"
          style="margin-bottom: 10px"
        >
          <div class="h-ce-1" @click="jump(item)">
            <div class="h-ce-1-d1">
              <img :src="item.icon" />

              <span class="label">{{ item.title }}</span>
            </div>
            <div class="h-ce-1-m">{{ item.note }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="h-footer">
      <div></div>
      <AIinput
        v-model="val"
        placeholder="发消息或选择类型创作"
        leftIcon
        bar
      ></AIinput>
    </div>
  </div>
</template>

<script>
// import advertisementMenu from "./advertisementMenu";
import AIinput from "@/components/AIinput/AIinput";
import store from "@/store/store";
import { GetChatTempletList } from "@/api/chat";
export default {
  components: {
    AIinput,
  },
  data() {
    return {
      store,
      advertisementMenu: [],
      val: "",
    };
  },
  created() {
    this.getChatTemplet();
  },
  methods: {
    // 获取后端模版列表
    getChatTemplet() {
      GetChatTempletList().then((res) => {
        if (res.code === 1) {
          this.advertisementMenu = res.data || [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    jump(item) {
      // this.$router.push(item.path);
      this.$router.push({
        path: "/copyGeneration",
        query: {
          title: item.title || "-",
          note: item.note || "-",
          type: item.type,
        },
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
