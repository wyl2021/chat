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
        <img class="logo-img" src="https://www.swsai.com/style/dist/img/icon/logo.png" />
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
      <div style="padding: 0px 13px">
        <LyMenu :isCollapse="collose"></LyMenu>
      </div>
      <!-- <el-switch
      class="ly-switch"
  v-model="value"
  active-color="#222127"
  inactive-color="#EEEEEE"
  @change="handleTheme"
  >

</el-switch> -->
<el-button @click="toggleTheme" class="theme-toggle">
      <span v-if="isDarkMode" class="moon-icon">🌙</span>
      <span v-else class="sun-icon">🌞</span>
    </el-button>
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
      value:true,
      isDarkMode: false // 默认使用明亮模式
    };
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme();
    },
    applyTheme() {
      if (this.isDarkMode) {
        // 应用黑暗模式样式
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        // 应用明亮模式样式
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
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
.ly-container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  min-width: 1200px;
  min-height: 768px;
  overflow: auto;
  background: @backgroundDark;
}
.ly-silder {
  width: 260px;
  background: black;
  height: 100%;
  transition: all 0.3s;
  flex-shrink: 0;
}
.ly-logo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 13px;
  .logo-img {
      display: inline-block;
    width: 177px;
    height: 50px;
    overflow: hidden;
    text-align: center;
    line-height: 50px;
    margin: auto;
    }
  // .logo {
  //   display: inline-block;
  //   width: 26px;
  //   height: 26px;
  //   border-radius: 26px;
  //   background: #212126;
  //   overflow: hidden;
  //   text-align: center;
  //   line-height: 26px;
  //   margin-right: 10px;
  //   img {
  //     width: 100%;
  //   }
  // }
}
.ly-switch{
  position: fixed;
    left: 100px;
    bottom: 0;
}
.ly-body {
  width: 100%;
  height: 100%;
}
.ly-b-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0px 13px;
  .ly-b-h-r {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
.ly-b-content {
  width: 100%;
  height: calc(100% - 50px);
}
/* 太阳和月亮按钮样式 */
.theme-toggle {
  background: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
  transition: 0.3s;
}

.sun-icon,
.moon-icon {
  font-size: 2rem;
  transition: 0.3s;
}

.theme-toggle:hover .sun-icon {
  color: #f39c12;
}

.theme-toggle:hover .moon-icon {
  color: #3498db;
}
</style>
