<template>
  <el-menu
    :default-active="getActivePath"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    @select="handleSelect"
    background-color="#000"
    text-color="#fff"
    active-text-color="#2f95eb"
    :collapse="isCollapse"
  >
    <el-menu-item index="/home">
      <!-- <i class="el-icon-plus"></i> -->
      <img
        class="icon-menu"
        :src="
          getActivePath === '/home'
            ? MenuIcon['ChatCar'].selectedImg
            : MenuIcon['ChatCar'].unselectedImg
        "
      />
      <span slot="title">ChatCar</span>
    </el-menu-item>
    <el-menu-item index="/intelligentSearch">
      <!-- <i class="icon-search"  ></i> -->
      <img
        class="icon-menu"
        :src="
          getActivePath === '/intelligentSearch'
            ? MenuIcon['智能搜索'].selectedImg
            : MenuIcon['智能搜索'].unselectedImg
        "
      />
      <span slot="title">智能搜索</span>
    </el-menu-item>
    <el-menu-item index="/copyGeneration">
      <!-- <i class="el-icon-news"></i> -->
      <img
        class="icon-menu"
        :src="
          getActivePath === '/copyGeneration'
            ? MenuIcon['文案生成'].selectedImg
            : MenuIcon['文案生成'].unselectedImg
        "
      />

      <span slot="title">文案生成</span>
    </el-menu-item>
    <el-menu-item index="/imageGeneration">
      <!-- <i class="el-icon-picture-outline"></i> -->
      <img
        class="icon-menu"
        :src="
          getActivePath === '/imageGeneration'
            ? MenuIcon['图片生成'].selectedImg
            : MenuIcon['图片生成'].unselectedImg
        "
      />

      <span slot="title">图片生成</span>
    </el-menu-item>
    <el-menu-item index="/filmGeneration">
      <!-- <i class="el-icon-video-play"></i> -->
      <img
        class="icon-menu"
        :src="
          getActivePath === '/filmGeneration'
            ? MenuIcon['视频生成'].selectedImg
            : MenuIcon['视频生成'].unselectedImg
        "
      />

      <span slot="title">视频生成</span>
    </el-menu-item>
    <el-submenu
      index="6"
      style="border-top: 1px solid #323232; border-bottom: 1px solid #323232"
    >
      <template slot="title">
        <img class="icon-menu" :src="MenuIcon['最近生成'].unselectedImg" />
        <span>最近生成</span>
      </template>
      <el-submenu v-for="(item, index) in recentlyChatList" :key="index" :index="`6-${index+1}`">
        <template slot="title"> 
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item
          :index="`6-${index + 1}-${index2+1}`"
          v-for="(item2, index2) in item.data"
          :key="index2"
          @click.native="handleSelect1(item2)"
        >
          <div style="justify-content: space-between; display: flex">
            <TooltipTxt
              :text="item2.remark"
              :len="20"
              color="#757575"
            ></TooltipTxt>
            <span @click.stop="handleCancel(item2.id, index2)">
              <img
                style="width: 15px; height: 15px"
                src="@/assets/images/del.png"
              />
            </span>
          </div>
        </el-menu-item>
      </el-submenu>
    </el-submenu>
    <!-- <el-menu-item index="6-2"
        ><TooltipTxt
          text="汽车洞察系统有什么令人舒适的"
          :len="10"
          color="#757575"
        ></TooltipTxt>
      </el-menu-item>
      <el-menu-item index="6-3">
        <TooltipTxt
          text="新能源汽车2024年市场情况"
          :len="10"
          color="#757575"
        ></TooltipTxt>
      </el-menu-item> -->
    <el-menu-item index="/collectView">
      <!-- <i class="el-icon-star-off"></i> -->
      <img
        class="icon-menu"
        :src="
          getActivePath === '/collectView'
            ? MenuIcon['收藏夹'].selectedImg
            : MenuIcon['收藏夹'].unselectedImg
        "
      />
      <span slot="title">收藏夹</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import TooltipTxt from "@/components/TooltipTxt/TooltipTxt.vue";
import MenuIcon from "./LaMenuIcon";
import { Session } from "@/utils/storage";
import { mapGetters } from "vuex";
import { DelChat } from "@/api/chat";
export default {
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TooltipTxt,
  },
  data() {
    return {
      MenuIcon,
      selectedIndex: "",
      recentlyChatList: [], ///最近生成列表
    };
  },
  created() {
    this.recentlyChatList = this.getChatList;
  },
  computed: {
    ...mapGetters(["getChatList"]),
  },
  watch: {
    getChatList(newList) {
      this.recentlyChatList = newList;
    },
  },
  methods: {
    handleSelect(index) {
      // console.log(Session.get('sessionId'))
      if (index.includes("6-")) return;
      this.selectedIndex = index;
      index === "/collectView"
        ? this.$router.push({
            path: index,
            query: {
              collect: 1,
            },
          })
        : this.$router.push(index);
      this.setActivePath(index);
      Session.remove("sessionId");
    },
    handleSelect1(item) {
      console.log(item);
      // 341011739171858
      // this.$router.replace({
      //   path: "/recentlyGenerated",
      //   query: {
      //     collect: 0,
      //     sessionId: 829211741315623,
      //     type: 'video',
      //   },
      // });
      this.$router.replace({
        path: "/recentlyGenerated",
        query: {
          collect: 0,
          sessionId: item.id,
          type: item.type,
        },
      });
      this.setActivePath("");
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
      this.setChatList();
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleCancel(id, index) {
      console.log(id, index);
      DelChat({ sessionId: id }).then((res) => {
        if (res.code === 1) {
          this.setChatList();

          if (index === 0) {
            this.setActivePath("/home");
            this.$router.push("/home");
          } else {
            this.handleSelect1(this.recentlyChatList[index - 1]);
          }

          this.$message.success("删除成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.icon-menu {
  // background-image:url('@/assets/images/search.svg'); ///url('https://www.swsai.com/style/dist/img/icon/Frame15_1.png'); /* 使用本地 SVG 图片 */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 18px;
  height: 18px;
  display: inline-block;
  margin-right: 10px;
}
</style>
