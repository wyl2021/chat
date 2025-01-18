<template>
  <div class="h-f-outter">
    <div class="h-f-top" v-if="bar">
      <span class="st" style="margin-left: 0px">
        <img src="@/assets/images/PublicRelationsAdvertising.png" /><span
          >公关广告</span
        ></span
      >
      <span class="st">
        <img src="@/assets/images/car.png" />
        <span>汽车媒体</span>
      </span>
      <span class="st">
        <img src="@/assets/images/WeMedia.png" />
        <span>自媒体人</span>
      </span>
      <span class="st">
        <img src="@/assets/images/owner.png" />
        <span>用户车主</span>
      </span>
      <span class="st">
        <img src="@/assets/images/brand.png" />
        <span>品牌官方</span>
      </span>
      <span class="st">
        <img src="@/assets/images/intelligentSearch.png" />
        <span>智能搜索</span>
      </span>
      <span class="st">
        <img src="@/assets/images/Copywriting.png" />
        <span>文案生成</span>
      </span>
      <span class="st" style="width: 10%">
        <img src="@/assets/images/more.png" />
        <span>更多</span>
      </span>
    </div>
    <div class="h-f-inner">
      <div
        ref="ine"
        class="h-f-input"
        :class="leftIcon ? '' : 'h-f-input-text'"
        contenteditable="true"
        v-html="value"
        @blur="handleBlur"
        @input="handleInput"
        v-if="!isTab"
      ></div>
      <div
        ref="ine1"
        class="h-f-input1"
        contenteditable="true"
        v-html="value"
        @blur="handleBlur"
        v-else
      ></div>
      <div class="h-fi">
        <div class="h-f-lo">
          <span class="op-btn" v-if="leftIcon">
            <img src="@/assets/images/input.png" />
          </span>
        </div>
        <div class="h-f-ro">
          <span class="op-btn">
            <img src="@/assets/images/voice.png" />
          </span>
          <span class="op-btn">
            <img src="@/assets/images/line.png" />
          </span>
          <span class="op-btn">
            <img src="@/assets/images/upload.png" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
  },
  model: {
    prop: "modelValue",
    event: "change",
  },
  watch: {
    modelValue: {
      handler(val) {
        this.value = val;
      },
      immediate: true,
    },
  },
  data() {
    return {
      value: "",
      isTab: false,
      isFirst: true,
      secTop: 0,
    };
  },
  methods: {
    // 失去焦点的时候赋值
    handleBlur(e) {
      const val = e.target.innerHTML;
      this.$emit("change", val);
    },
    // 实时判断是否换个输入框
    handleInput() {
      const T = this.selectionPosition();
      if (this.isFirst) {
        this.secTop = T;
        this.isFirst = false;
      } else {
        if (this.secTop != T) {
          this.isTab = true;
        }
      }
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
      width: 16px;
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
  .h-fi {
    display: flex;
    height: 26px;
    justify-content: space-between;
  }
  .h-f-lo {
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
.h-f-input {
  position: absolute;
  word-wrap: break-word;
  white-space: normal;
  outline: none;
  width: calc(100% - 126px);
  left: 42px;
  top: 14px;
  font-size: 14px;
}
.h-f-input1 {
  position: relative;
  word-wrap: break-word;
  white-space: normal;
  outline: none;
  font-size: 14px;
  margin-bottom: 7px;
}
.h-f-input-text {
  left: 13px;
  width: calc(100% - 96px);
}
</style>
