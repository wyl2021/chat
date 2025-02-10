import moment from "moment";
export default {
  handleMessage (val) {
    console.log("val", val);
    const content = val.content;
    this.result = "";
    if (val.type === "image") {
      this.messages.push({
        type: "question",
        dataType: "image",
        content: {
          imgList: content?.data.filter((e) => e.type === "base64"),
          text: content.txt,
        },
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
     
      this.aiImgAnswer(content);
    } else if (val.type === "video") {
      this.messages.push({
        type: "question",
        dataType: 'video',
        content:{
          videoList:this.videoDate(content),
          text: content.find((e) => e.type === 'question')?.content || '',
        },
      });
     
      this.aiVideoAnswer(val);
      // this.messages.push({
      //   type: "question",
      //   dataType: "image",
      //   content: {
      //     imgList: content?.data.filter((e) => e.type === "base64"),
      //     text: content.txt,
      //   },
      //   time: moment().format("YYYY-MM-DD HH:mm:ss"),
      // });
    } else if (val.type === "history") {
      this.getHistory();
    } else {
      this.messages.push({
        type: "question",
        dataType: "text",
        content: {
          text: val?.content,
        },
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      this.aiAnswer({ templetId: val?.templetId, txt: val?.content });
    }
    console.log('messages',this.messages)
  },
 
}