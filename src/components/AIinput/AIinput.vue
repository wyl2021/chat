<template>
  <div class="h-f-outter" ref="aut">
    <div class="h-f-top" v-if="bar">
      <span
        class="st"
        v-for="(item, index) in barArr"
        :key="index"
        :style="item.style"
      >
        <img :src="item.img" /><span>{{ item.label }}</span></span
      >
    </div>
    <div class="h-f-pic">
      <div class="h-f-pic-d1" v-for="(item, index) in imgList" :key="index">
        <img :src="item" />
        <span
          class="el-icon-error h-f-pic-d1-del"
          @click="handleDelPic(index)"
        ></span>
      </div>
    </div>
    <div class="h-f-inner">
      <div
        ref="ine"
        class="h-f-input"
        :class="leftIcon ? '' : 'h-f-input-text'"
        :contenteditable="!disabled"
        v-html="value"
        :placeholder="placeholder"
        @input="handleInput"
        v-if="!isTab"
      ></div>
      <div
        ref="ine1"
        class="h-f-input1"
        :contenteditable="!disabled"
        v-html="value"
        :placeholder="placeholder"
        @input="handleInputX"
        v-if="isTab"
      ></div>
      <div class="h-fi">
        <div class="h-f-lo">
          <!--图片功能-->
          <imageClass
            v-if="pic"
            @upload="handleUpload"
            @change="handleChangeTypeClass"
          ></imageClass>
          <!--视频功能-->
          <filmClass
            v-if="film"
            @upload="handleUpload"
            @change="handleChangeTypeClass"
          ></filmClass>
          <!---------------------------------------------------------->
          <span class="op-btn" v-if="leftIcon">
            <img src="https://www.swsai.com/style/dist/img/icon/Frame3.png" />
          </span>
        </div>
        <div class="h-f-ro">
          <span class="op-btn">
            <img src="@/assets/images/voice.png" />
          </span>
          <span class="op-btn">
            <img src="@/assets/images/line.png" />
          </span>
          <span class="op-btn" @click="sendMsg">
            <img v-if="!canSend" src="@/assets/images/upload.png" />
            <img v-else src="@/assets/images/uploadWhite.png" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import barArr from "./barArr";
import filmClass from "./filmClass.vue";
import imageClass from "./imageClass.vue";
export default {
  components: {
    filmClass,
    imageClass,
  },
  props: {
    leftIcon: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      default: "",
    },
    bar: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请输入",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    pic: {
      type: Boolean,
      default: false, ///图片
    },
    film: {
      type: Boolean,
      default: false, //视频
    },
  },
  model: {
    prop: "modelValue",
    event: "change",
  },
  computed: {
    otherType() {
      return {
        pic: this.pic,
        film: this.film,
      };
    },
  },
  watch: {
    modelValue: {
      handler(val) {
        this.value = val;
      },
      immediate: true,
    },
    otherType: {
      handler(val) {
        if (val.pic || val.film) {
          this.isTab = true;
        } else {
          this.isTab = false;
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      barArr,
      value: "",
      isTab: false,
      isSecond: false,
      secTop: 0,
      canSend: false,
      xh: 23,
      imgList: [],
    };
  },
  methods: {
    // 发送信息
    async sendMsg() {
      if (!this.canSend) return;
      let str = "";
      if (this.isTab) {
        str = this.$refs.ine1.innerHTML;
      } else {
        str = this.$refs.ine.innerHTML;
      }
      let ctx = this.getHtmlContents(str);
      if (ctx) {
        this.$emit("sendMsg", this.handleData(ctx));
      }
      this.clearVal();
    },
    handleData(ctx) {
      let parameter = {};
      if (this.getActivePath.includes("/imageGeneration")) {
        const qList = this.imgList.map((item) => ({
          type: "base64",
          role: "user",
          content: item,
        }));

        qList.push({
          type: "question",
          role: "user",
          content: ctx,
        });

        Object.assign(parameter, {
          ratio: ctx,
          data: qList,
        });
      } else {
        parameter={
          txt: ctx, 
          imgList: this.imgList
        }
      }
      return parameter;
    },
    // 清空内容
    clearVal() {
      if (this.$refs.ine) {
        this.$refs.ine.innerText = "";
      }
      if (this.$refs.ine1) {
        this.$refs.ine1.innerText = "";
      }
    },
    // 失去焦点的时候赋值
    handleBlur(name) {
      const val = this.$refs[name].innerHTML;
      this.$emit("change", val);
    },
    // 实时判断是否换个输入框
    handleInput() {
      const val = this.$refs.ine.innerHTML;
      const ctx = this.getHtmlContents(val);
      if (ctx) {
        this.canSend = true;
      } else {
        this.canSend = false;
        this.$refs.ine.innerText = "";
      }
      const h = this.$refs.ine.offsetHeight;
      if (h > this.xh && !this.isSecond) {
        this.isTab = true;
        this.isSecond = true;
      }
      this.changeAnswer();
    },
    // 上传类型的数据
    handleChangeTypeClass(typeStr) {
      this.value += typeStr;
      this.canSend = true;
    },
    // 上传文件
    handleUpload(img) {
      this.imgList.push(img);
    },
    // 第二个input实时判断是否换个输入框
    handleInputX(e) {
      if (e.target != this.$refs.ine1) {
        e.target.setAttribute("txt", e.target.value);
      }
      // 上面的内容是对内部input赋值
      const val = this.$refs.ine1.innerHTML;
      const ctx = this.getHtmlContents(val);
      if (ctx) {
        this.canSend = true;
      } else {
        this.canSend = false;
        this.$refs.ine1.innerText = "";
        this.isSecond = false;
      }
      const h = this.$refs.ine1.offsetHeight;
      if (h <= this.xh && !this.isSecond && !this.pic && !this.film) {
        this.isTab = false;
      }
      this.changeAnswer();
    },
    // 实时改变AI回答框高度
    changeAnswer() {
      this.$emit("changeAnswer");
    },
    // 删除图片
    handleDelPic(n) {
      this.imgList.splice(n, 1);
    },

    // 计算光标的位置
    selectionPosition() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        // 创建一个临时的span元素来计算位置
        const span = document.createElement("span");
        span.style.color = "transparent";
        range.insertNode(span);

        // 计算span元素的位置
        let rect = span.getBoundingClientRect();
        let top = rect.top;

        // 移除临时的span元素
        span.parentNode.removeChild(span);
        // 打印光标相对于输入框顶部的位置
        return top;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.h-f-outter {
  position: relative;
  width: 100%;
  height: auto;
  background: #222127;
}
.h-f-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  .st {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 17%;
    padding: 5px 6px;
    border: 1px solid #333335;
    border-radius: 10px;
    margin-left: 10px;
    font-size: 13px;
    color: #5e5e5e;
    cursor: pointer;
    img {
      height: 14px;
    }
    span {
      display: inline-block;
      margin-left: 5px;
    }
  }
}
.h-f-inner {
  position: relative;
  width: calc(100% - 20px);
  height: auto;
  border: 1px solid #333335;
  border-radius: 15px;
  padding: 10px 13px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  .h-fi {
    display: flex;
    height: 26px;
    justify-content: space-between;
  }
  .h-f-lo {
    display: flex;
    align-items: center;
    height: 100%;
    .op-btn {
      cursor: pointer;
    }
    img {
      width: 24px;
    }
  }
  .h-f-ro {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .op-btn {
      cursor: pointer;
    }
    img {
      width: 24px;
    }
  }
}
.h-f-pic {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap; /* 允许子项换行 */
  max-height: 200px;
  overflow-y: auto;
  .h-f-pic-d1 {
    position: relative;
    margin-left: 7px;
    margin-top: 5px;
    img {
      height: 110px;
    }
    .h-f-pic-d1-del {
      position: absolute;
      cursor: pointer;
      top: 2px;
      right: 3px;
      color: #212126;
      font-size: 14px;
    }
  }
}
.h-f-input {
  position: absolute;
  word-wrap: break-word;
  white-space: normal;
  outline: none;
  width: calc(100% - 126px);
  left: 42px;
  top: 14px;
  font-size: 14px;
  line-height: 1.2;
}
.h-f-input:empty:before {
  content: attr(placeholder);
  color: #424242;
}
.h-f-input1 {
  position: relative;
  word-wrap: break-word;
  white-space: normal;
  outline: none;
  font-size: 14px;
  margin-bottom: 7px;
  line-height: 1.2;
  padding: 3px 0px;
  height: auto;
  max-height: 200px;
  overflow-y: auto;
}
.h-f-input1:empty:before {
  content: attr(placeholder);
  color: #424242;
}
.h-f-input-text {
  left: 13px;
  width: calc(100% - 96px);
}
</style>
