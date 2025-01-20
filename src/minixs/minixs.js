import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
Vue.mixin({
  computed: {
    ...mapGetters([
      'getToken',
      'getUserInfo',
      'clearUserInfo'
    ])
  },
  methods: {
    ...mapActions(['setToken', 'setUserInfo','logout']),
    createAiScript (arr = []) {
      let result = '';
      arr.forEach(item => {
        if (item.type === 'text') {
          // const txt = item.content.replace('/\r\n/g', '<br>');
          result += `<span>${item.content}</span>`;
        } else if (item.type === 'input') {
          const len = this.textWidth(item.placeholder) + 10;
          result += `<input class="inputTs" style="width: ${len || 130}px" type="text" placeholder="[${item.placeholder}]" />`;
        }
      });
      const txt = `<pre style="width: 100%;white-space: pre-wrap;line-height: 1.7">${result}</pre>`
      return txt;
    },
    textWidth (text, font) {
      // 创建一个canvas元素用于测量文本
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // 设置字体样式
      context.font = font || '13.5px Arial';

      // 测量文本
      const metrics = context.measureText(text);

      // 返回文本宽度
      return metrics.width;
    }
  }
})