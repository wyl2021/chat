<template>
  <div class="dialog-container" @click="startPlay">
    <div style="margin-right: 10px">{{ srcObj.duration }}秒</div>
    <div class="audio-animation" :class="playState ? 'audioPlay' : ''">
      <div id="one"></div>
      <div id="two"></div>
      <div id="three"></div>
      <div id="four"></div>
    </div>
    <audio ref="audioPlayer" class="audioStyle" @ended="handleEnded"></audio>
  </div>
</template>

<script>
export default {
  props: {
    srcObj: {
      type: Object,
      default: () => {
        return {
          audioURL: "",
          duration: 0,
        };
      },
    },
  },
  data() {
    return {
      playState: false,
    };
  },
  mounted() {
    this.$refs.audioPlayer.src = this.srcObj.audioURL;
    this.$refs.audioPlayer.load(); // 加载音频文件
  },
  methods: {
    // 开始播放
    startPlay() {
      this.playState = !this.playState;
      if (this.playState) {
        this.$refs.audioPlayer.play();
      } else {
        this.$refs.audioPlayer.pause();
      }
    },
    // 播放完毕
    handleEnded() {
      this.playState = false;
    },
  },
};
</script>

<style lang="css" scoped>
.audioStyle {
  width: 0px;
  height: 0px;
}
@keyframes yuying {
  0% {
    height: 0%;
  }
  20% {
    height: 50%;
  }
  50% {
    height: 100%;
  }
  80% {
    height: 50%;
  }
  100% {
    height: 0%;
  }
}

.dialog-container {
  width: auto;
  height: 25px;
  border-radius: 7px;
  padding: 2px 7px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: black;
  margin-bottom: 5px;
}
.dialog-container .audio-animation {
  width: 16px;
  height: 20px;
}
.audioPlay #one {
  animation: yuying 0.6s infinite 0.15s;
  -webkit-animation: yuying 0.6s infinite 0.15s;
}
.audioPlay #two {
  animation: yuying 0.6s infinite 0.3s;
  -webkit-animation: yuying 0.6s infinite 0.3s;
}
.audioPlay #three {
  animation: yuying 0.6s infinite 0.45s;
  -webkit-animation: yuying 0.6s infinite 0.45s;
}
.audioPlay #four {
  animation: yuying 0.6s infinite 0.6s;
  -webkit-animation: yuying 0.6s infinite 0.6s;
}
#one,
#two,
#three,
#four {
  width: 2px;
  border-radius: 50px;
  background-color: #fff;
  vertical-align: middle;
  display: inline-block;
}
#one {
  margin-left: 2px;
  height: 25%;
}
#two {
  margin-left: 2px;
  height: 50%;
}
#three {
  margin-left: 2px;
  height: 75%;
}
#four {
  margin-left: 2px;
  height: 90%;
}
</style>
