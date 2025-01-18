<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    background-color="#000"
    text-color="#fff"
    active-text-color="#2f95eb"
    :collapse="isCollapse"
  >
    <el-menu-item index="1">
      <i class="el-icon-plus"></i>
      <span slot="title">ChatCar</span>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="el-icon-search"></i>
      <span slot="title">智能搜索</span>
    </el-menu-item>
    <el-menu-item index="3">
      <i class="el-icon-news"></i>
      <span slot="title">文案生成</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="el-icon-picture-outline"></i>
      <span slot="title">图片生成</span>
    </el-menu-item>
    <el-menu-item index="5">
      <i class="el-icon-video-play"></i>
      <span slot="title">视频生成</span>
    </el-menu-item>
    <el-submenu
      index="6"
      style="border-top: 1px solid #323232; border-bottom: 1px solid #323232"
    >
      <template slot="title">
        <i class="el-icon-files"></i>
        <span>最近生成</span>
      </template>
      <el-menu-item index="6-1">
        <TooltipTxt text="奔驰s680" :len="10" color="#757575"></TooltipTxt>
      </el-menu-item>
      <el-menu-item index="6-2"
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
      </el-menu-item>
    </el-submenu>
    <el-menu-item index="7">
      <i class="el-icon-star-off"></i>
      <span slot="title">收藏夹</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import TooltipTxt from "@/components/TooltipTxt/TooltipTxt.vue";
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
    return {};
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="less" scoped></style>
