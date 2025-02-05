<template>
  <div class="ar-container" v-if="visible">
    <div class="wave" :style="waveStyle"></div>
    <div class="ar-record" @mousedown="startRecording" @mouseup="release">
      <img src="@/assets/images/voice.png" />
    </div>
    <div style="text-align: center">按住开始录音，释放发送语音</div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: "show",
    event: "change",
  },
  computed: {
    waveStyle() {
      return {
        backgroundColor: `rgba(255, 0, 0, ${this.volumeLevel})`,
        animation: "wave-animation 2s infinite",
      };
    },
  },
  watch: {
    show: {
      handler(val) {
        this.visible = val;
      },
    },
  },
  data() {
    return {
      mediaStream: null, // 音频流
      visible: false,
      mediaRecorder: null,
      audioChunks: [],
      audioURL: null,
      volumeLevel: 0, // 初始音量级别
      startTime: 0,
      endTime: 0,
      maxTime: 59,
    };
  },
  // 释放录音
  beforeDestroy() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop(); // 确保停止录制（如果还在录制的话）
    }
    const tracks = this.mediaStream.getTracks(); // 假设你已经将媒体流保存在了mediaStream变量中
    tracks.forEach((track) => track.stop()); // 停止并释放媒体流轨道资源
  },
  methods: {
    // 开始录音
    async startRecording() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          this.mediaStream = stream; // 保存在mediaStream变量中
          this.getVolumeSize(stream); // 获取音量大小
          this.mediaRecorder = new MediaRecorder(stream);
          this.audioChunks = []; // 清除之前的录音数据
          this.mediaRecorder.ondataavailable = (e) => {
            this.audioChunks.push(e.data);
          };
          this.mediaRecorder.start();
          this.startTime = new Date().getTime(); // 开始记录的时间
          console.log("开始录音");
        } catch (err) {
          this.$message.error("录音识别失败", err);
        }
      } else {
        this.$message.error("不支持录音功能！");
      }
    },
    // 获取音量的大小
    getVolumeSize(stream) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 256; // 分辨率
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        requestAnimationFrame(updateVolume);
        analyser.getByteFrequencyData(dataArray);
        let levels = Array.from(dataArray);
        let level =
          levels
            .slice()
            .sort((a, b) => a - b)
            .splice(-10)
            .reduce((a, b) => a + b, 0) / 10; // 取最后10个数据的平均值作为音量表示
        this.volumeLevel = level / 256; // 归一化到0到1之间
        // 对录音时间的控制
        if (this.startTime > 0) {
          const currentTime = new Date().getTime();
          const t = Math.floor((currentTime - this.startTime) / 1000);
          if (t > this.maxTime) {
            this.release();
            return false;
          }
        }
      };
      updateVolume(); // 开始更新音量
    },
    // 停止录音
    stopRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
        this.mediaRecorder.stop();
        this.mediaStream.getTracks().forEach((track) => track.stop()); // 停止媒体流中的所有轨道
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, {
            type: "audio/ogg; codecs=opus",
          });
          this.audioURL = URL.createObjectURL(audioBlob);
          this.endTime = new Date().getTime(); // 结束记录的时间
          this.sendAudio();
        };
      }
    },
    // 发送录音
    sendAudio() {
      if (this.audioURL) {
        const duration = Math.floor((this.endTime - this.startTime) / 1000);
        this.$emit("sendAudio", {
          audioURL: this.audioURL,
          duration: duration,
        });
        this.audioURL = null; // 重置
        this.audioChunks = [];
        this.startTime = 0;
        this.endTime = 0;
      } else {
        this.$message.error("请先开始录音");
      }
    },
    // 放开
    release() {
      this.stopRecording();
      this.$emit("change", false);
    },
  },
};
</script>
<style lang="less" scoped>
.ar-container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  z-index: 5000;
}
.ar-record {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 auto;
  margin-top: 100px;
  cursor: pointer;
  border: 1px solid #fff;
  img {
    width: 80%;
  }
  &:active {
    background: #2f95eb;
  }
}
.wave {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  margin-top: 260px;
  background-color: #f00; /* 初始颜色 */
  transition: background-color 0.5s; /* 平滑过渡效果 */
}
@keyframes wave-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
