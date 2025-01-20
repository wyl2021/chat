import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
Vue.mixin({
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'getToken',
      'getUserInfo',
      'clearUserInfo'
    ])
  },
  methods: {
    ...mapActions(['setToken', 'setUserInfo', 'logout']),
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
    },
    getHtmlContents (htmlString) {
      // 创建一个新的DOM解析器
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      // 使用querySelectorAll选择所有元素，然后遍历它们
      const elements = doc.querySelectorAll('*');
      let contents = '';
      elements.forEach(function (el) {
        // 将元素的内容（包括其后代）添加到数组中
        let innerText = ''
        if (el.tagName.toLowerCase() === 'input') {
          if (el.getAttribute('txt')) {
            innerText = el.getAttribute('txt');
            contents += innerText;
          }
        } else if (el.tagName.toLowerCase() === 'span') {
          if (el.innerText) {
            innerText = el.innerText;
            contents += innerText;
          }
        }

      });
      return contents;
    }
  }
})