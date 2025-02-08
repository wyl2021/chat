<template>
  <div class="h-container">
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
        v-for="(item, index) in collectList"
        :key="index"
        style="margin-bottom: 10px"
      >
        <div class="h-c-collect" @click="jump(item)">
          <div class="remark">{{ item.remark || "-" }}</div>
          <div class="templetName">{{ item.templetName || "-" }}</div>
          <div class="h-c-collect-d" v-if="item.data">
            <div v-if="item.data[0].type === 'question'" class="content">
              {{ item.data[0].content || "-" }}
            </div>
            <div v-if="item.data[0].type === 'imageUrl'">
              <img v-if="item.data[0].data" :src="item.data[0].data[0].url" />
            </div>
            <div v-if="item.data[0].type === 'videoUrl'">
              <video
                v-if="item.data[0].data"
                :src="item.data[0].data[0].url"
              ></video>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <InfoDisplay
      v-if="answer"
      :resizeHeight="resizeHeight"
      :ques="answerText"
      @close="answer = false"
    ></InfoDisplay>

    <div class="h-footer" v-if="isJump">
      <AIinput
        ref="aiInput"
        v-model="ctxVal"
        placeholder="输入您要撰写的主题"
        @sendMsg="handleSendMsg"
        @changeAnswer="changeAnswer"
      ></AIinput>
    </div>
  </div>
</template>
<script>
import AIinput from "@/components/AIinput/AIinput";
import { GetChatList } from "@/api/chat";
import InfoDisplay from "@/components/InfoDisplay/InfoDisplay";
import { Session } from "@/utils/storage";
export default {
  components: {
    AIinput,
    InfoDisplay,
  },
  data() {
    return {
      collectList: [],
      prams: {
        pageIndex: 1,
        pageSize: 10,
        collect: 1,
      },
      resizeHeight: 100,
      isJump: false,
      answerText: null,
      answer: false,
      ctxVal: "",
    };
  },
  created() {
    console.log(this.$route.query.collect)
    if(!this.$route.query.collect){
      this.handleCollect();
    }else{
      this.jump({id:this.$route.query.sessionId||0}); // 每次路由变化时刷新数据
    }
  },
  watch: {
  '$route'(to, from) {
    console.log('to:', to);
    console.log('from:', from);
    if(to.query.collect==="0"){
    this.jump({id:to.query.sessionId||0}); // 每次路由变化时刷新数据
    }
  }
},
  methods: {
    jump(val) {
      this.answerText = {
        type: "history",
        role: "user",
        content: null,
      };
      Session.set("sessionId", val?.id);
      this.isJump = true;
      this.$nextTick(() => {
        const h = this.$refs.aiInput.$el.offsetHeight;
        this.resizeHeight = h + 30;
        this.answer = true;
      });
    },
    handleCollect() {
      GetChatList(this.prams).then((res) => {
        if (res.code === 1) {
          this.collectList = res.data || [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 发送消息
    handleSendMsg(val) {
      this.answerText = val;
      this.$refs.aiInput.isTab = false;
      this.$refs.aiInput.canSend = false;
      this.ctxVal = "";
      this.$nextTick(() => {
        const h = this.$refs.aiInput.$el.offsetHeight;
        this.resizeHeight = h + 30;
        this.answer = true;
      });
    },
    // 实时改变AI回答的高度
    changeAnswer() {
      this.$nextTick(() => {
        const h = this.$refs.aiInput.$el.offsetHeight;
        this.resizeHeight = h + 30;
      });
    },
  },
};
</script>
<style scoped lang="less"></style>
