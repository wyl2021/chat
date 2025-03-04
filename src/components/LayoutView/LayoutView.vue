<template>
  <div class="ly-container">
    <div class="ly-silder" ref="ls">
      <div class="ly-logo">
        <div
          style="
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-shrink: 0;
          "
          v-if="!collose"
        >
          <img
            class="logo-img"
            src="https://www.swsai.com/style/dist/img/icon/logo.png"
          />
          <!-- <div class="logo">
            <img src="@/assets/images/logo.jpg" />
          </div>
          <span style="font-size: 15px; font-weight: 500">硕为思ChatCar</span> -->
        </div>
        <div style="cursor: pointer" @click="handleCollose">
          <span
            style="font-size: 20px"
            :class="collose ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          ></span>
        </div>
      </div>
      <div
        style="
          padding: 0px 13px;
          width: calc(100% - 26px);
          height: 100%;
          overflow-y: auto;
        "
      >
        <LyMenu :isCollapse="collose"></LyMenu>
      </div>
      <el-button @click="toggleTheme" class="theme-toggle">
        <span v-if="isDarkMode" class="moon-icon">🌙</span>
        <span v-else class="sun-icon">🌞</span>
      </el-button>
      <!-- <el-switch
      class="ly-switch"
  v-model="value"
  active-color="#222127"
  inactive-color="#EEEEEE"
  @change="handleTheme"
  >

</el-switch> -->
    </div>
    <div class="ly-body">
      <div class="ly-b-header">
        <div></div>
        <div class="ly-b-h-r">
          <span class="el-icon-bell" style="font-size: 15px"></span>
          <userCp></userCp>
        </div>
      </div>
      <div class="ly-b-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import userCp from "./userCp.vue";
import LyMenu from "./LyMenu.vue";
export default {
  components: {
    LyMenu,
    userCp,
  },
  data() {
    return {
      collose: false,
      value: true,
      isDarkMode: true, // 默认使用明亮模式
    };
  },
  mounted() {
    this.applyTheme(); // 初始加载时应用当前主题
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme();
      console.log(this.isDarkMode);
    },
    applyTheme() {
      const rootElement = document.body;

      if (this.isDarkMode) {
        // 切换到暗色主题
        rootElement.classList.add("dark-theme");
        rootElement.classList.remove("light-theme");
      } else {
        // 切换到亮色主题
        rootElement.classList.add("light-theme");
        rootElement.classList.remove("dark-theme");
      }
    },
    // handleTheme(e){
    //   console.log(e)
    //   if(e){

    //   }else{

    //   }
    // },
    handleCollose() {
      this.collose = !this.collose;
      if (this.collose) {
        this.$refs.ls.style.width = "100px";
      } else {
        this.$refs.ls.style.width = "260px";
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/styles/variable.less");

/* 太阳和月亮按钮样式 */
.theme-toggle {
  background: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
  transition: 0.3s;
  border-color: transparent !important;
  background: transparent !important;
  width: 20px;
  height: 20px;
  padding: 2px !important;
  margin-right: 5px !important;
}

.sun-icon,
.moon-icon {
  font-size: 15px;
  transition: 0.3s;
}

.theme-toggle:hover .sun-icon {
  color: #f39c12;
}

.theme-toggle:hover .moon-icon {
  color: #3498db;
}
</style>
