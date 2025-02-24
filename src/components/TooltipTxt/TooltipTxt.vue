<template>
  <span>
    <el-tooltip v-if="showTip" :effect="type" :placement="position">
      <template #content>
        <pre
          style="
            max-width: 560px;
            max-height: 270px;
            overflow: auto;
            white-space: pre-wrap;
          "
          >{{ text }}</pre
        >
      </template>
      <span :style="{ color: color }">{{ value }}</span>
    </el-tooltip>
    <span :style="{ color: color }" v-else>
      {{ value }}
    </span>
  </span>
</template>

<script>
export default {
  props: {
    len: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      default: "top",
    },
    type: {
      type: String,
      default: "dark",
    },
    color: {
      type: String,
      default: "",
    },
  },
  watch: {
    text: {
      handler(val) {
        const txt = this.truncateString(val, this.len);
        this.value = txt;
        if (txt.includes("...")) {
          this.showTip = true;
        } else {
          this.showTip = false;
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      showTip: false,
      value: "",
    };
  },
  methods: {
    truncateString(str, maxBytes) {
      let result = "";
      let currentBytes = 0;
      for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        // 对于ASCII字符，每个字符1个字节，对于其他字符，通常是2-4个字节
        if (charCode <= 0x7f) {
          currentBytes += 1;
        } else {
          currentBytes += 2;
        }
        if (currentBytes <= maxBytes) {
          result += str[i];
        } else {
          result += "...";
          break;
        }
      }
      return result;
    },
  },
};
</script>

<style lang="css" scoped></style>
