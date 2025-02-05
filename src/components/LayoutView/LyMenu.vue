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
        <!-- <i class="el-icon-files"></i> -->
        <img class="icon-menu" :src="MenuIcon['最近生成'].unselectedImg" />
        <span>最近生成</span>
      </template>
      <el-menu-item
        :index="`6-${index + 1}`"
        v-for="(item, index) in recentlyChatList"
        :key="index"
      >
        <TooltipTxt :text="item.remark" :len="10" color="#757575"></TooltipTxt>
      </el-menu-item>
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
    </el-submenu>
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
import { GetChatList } from "@/api/chat";
import { Session } from "@/utils/storage";
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

  methods: {
    handleRecentlyChatList() {
      GetChatList({ pageIndex: 1, pageSize: 3, collect: 0 }).then((res) => {
        if (res.code === 1) {
          this.recentlyChatList = res.data || [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSelect(index) {
      console.log(Session.get('sessionId'))
      this.selectedIndex = index;
      this.$router.push(index);
      this.setActivePath(index);
      Session.remove('sessionId')

    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
      this.handleRecentlyChatList();
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
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
