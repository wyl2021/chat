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
      'clearUserInfo',
      'getActivePath',
      'getChatList'
    ])
  },
  methods: {
    ...mapActions(['setToken', 'setUserInfo', 'logout', 'setActivePath', 'setChatList']),
    createAiScript (arr = []) {
      let result = '<form id="myForm">';
      arr.forEach(item => {
        if (item.type === 'text') {
          // const txt = item.content.replace('/\r\n/g', '<br>');
          if (item.content === '/n') {
            result += '<br/>'
          } else {
            result += `<span>${item.content}</span>`;
          }
        } else if (item.type === 'input') {
          const len = this.textWidth(item.placeholder) + 10;
          result += `<input class="inputTs" required style="width: ${len || 130}px" type="text" placeholder="[${item.placeholder}]" />`;
        } else if (item.type === 'int') {
          const len = item.placeholder ? this.textWidth(item.placeholder) + 10 : 50;
          const reg = new RegExp(/[^\d]/g);
          result += `<input class="inputTs" required style="width: ${len || 130}px" number="true"  placeholder="[${item.placeholder || '请输入'}]" onkeyup="value=value.replace(${reg},'')" />`;
        } else if (item.type === 'select') {
          const arr = item.data || [];
          result += `<select class="selectTs" required txt="${arr[0].value}">`
          arr.forEach(item => {
            result += `<option value="${item.value}">${item.name}</option>`;
          });
          result += `</select>`;
        }
      });
      result += `</form>`;
      const txt = `<pre style="width: 100%;white-space: pre-wrap;line-height: 1.7">${result}</pre>`
      return txt;
    },
    // 文本宽度
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
    // 获取内容
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
        const domEle = el.tagName.toLowerCase();
        if (['select', 'input'].includes(domEle)) {
          if (el.getAttribute('txt')) {
            innerText = el.getAttribute('txt');
            contents += innerText;
          }
        } else if (domEle === 'span') {
          if (el.innerText) {
            innerText = el.innerText;
            contents += innerText;
          }
        } else if (domEle === 'select') {
          if (el.innerText) {
            innerText = el.querySelector('option:checked');
            contents += innerText;

          }

        }
      });
      let str = ""
      if (contents) {
        str = contents;
      } else {
        str = htmlString.replace(/<[^>]*>/g, '');
      }
      return str;
    },
    // 验证表单
    vaildateForm () {
      const form = document.getElementById('myForm');
      if (!form) return true;
      const elementsWithCustomAttr = form.querySelectorAll('[required]');
      for (let i = 0; i < elementsWithCustomAttr.length; i++) {
        const dom = elementsWithCustomAttr[i];
        if (!dom.value) {
          return false;
        }
      }
      return true;
    },
  }
})