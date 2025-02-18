import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
Vue.mixin({
  data() {
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
    createAiScript(arr = []) {
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
          const len = this.textWidth(item.placeholder) + 15;
          result += `<span class="inputTTs protected" contenteditable="true" style="min-width: ${len || 130}px" required placeholder="[${item.placeholder}]"></span>`;
        } else if (item.type === 'int') {
          const len = item.placeholder ? this.textWidth(item.placeholder) + 10 : 50;
          const reg = new RegExp(/[^\d]/g);
          result += `<input class="inputTs protected" required style="width: ${len || 130}px" number="true"  placeholder="[${item.placeholder || '请输入'}]" onkeyup="value=value.replace(${reg},'')" />`;
        } else if (item.type === 'select') {
          const arr = item.data || [];
          result += `<select class="selectTs protected" required txt="${arr[0].value}">`
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
    textWidth(text, font) {
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


    // getHtmlContents(htmlString) {
    //   const parser = new DOMParser();
    //   const doc = parser.parseFromString(htmlString, 'text/html');

    //   let contents = '';  // 最终输出的内容
    //   let tempText = '';  // 暂存 span 的文本
    //   // let inputs = [];    // 存储 input 的 txt 值
    //   // 获取 form 下的子节点并过滤掉空白节点（&nbsp;）
    //   const formElements = Array.from(doc.body.querySelectorAll('form')).flatMap(form =>
    //     Array.from(form.childNodes).filter(node =>
    //       node.nodeType !== Node.TEXT_NODE || node.textContent.trim() !== ''
    //     )
    //   );
    //   console.log('formElements', formElements)
    //   // 先提取 form 外的纯文本（例如 `99`）
    //   // 提取 form 外部的纯文本
    //   let extraTextBeforeForm = '';
    //   const allText = doc.body.innerText.replace(/\s+/g, ' ').trim();
    //   // 找出 form 标签并提取前面的文本
    //   const formStartIndex = allText.indexOf('<form');
    //   if (formStartIndex > -1) {
    //     extraTextBeforeForm = allText.substring(0, formStartIndex).trim();
    //   }
    //   // 遍历 form 下的所有子节点
    //   formElements.forEach(node => {

    //     if (node.nodeType === Node.TEXT_NODE) {
    //       // 处理纯文本内容
    //       tempText += node.textContent + ' ';
    //     } else if (node.tagName === 'SPAN') {
    //       tempText += node.innerText.trim() + ' ';  // 累加 span 文本
    //     } else if (node.tagName === 'INPUT') {
    //       let txtValue = node.getAttribute('txt') || '';
    //       console.log('txtValue', txtValue)
    //       if (txtValue) {
    //         tempText += txtValue
    //         // let label = tempText.trim(); // 获取 span 可能的标签内容
    //         // inputs.push(`${label}${txtValue}`); // 形成 "长12" 或 "宽12"
    //         // tempText = ''; // 清空暂存 span 文本，防止重复
    //       }
    //     } else if (node.tagName === 'SELECT') {
    //       // 获取 select 中选中的 option
    //       const selectedOption = node.querySelector('option:checked');
    //       if (selectedOption) {
    //         tempText += selectedOption.innerText.trim() + ' ';  // 累加选中的 option 文本
    //       }
    //     } else {

    //       tempText += node.textContent + ' ';
    //     }
    //   });

    //   // 处理最后的 span 和 input 文本（如果它不是 input 相关的标签）
    //   contents = tempText.trim();

    //   // 处理 form 外部的纯文本（例如 `99`）
    //   // 提取 form 外部的纯文本
    //   if (extraTextBeforeForm) {
    //     contents = extraTextBeforeForm + ' ' + contents;
    //   }
    //   // 去掉多余的空格并返回
    //   console.log(tempText)
    //   return contents.trim();
    // },


    getHtmlContents(htmlString) {
      // console.log(htmlString)
      // 创建一个新的DOM解析器
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      let contents = '';

      // 获取并累加文本节点（如 123, &nbsp; 等）
      const textNodes = doc.body.childNodes;
      textNodes.forEach(function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (text) {
            contents += text;
          }
        }
      });
      // 使用querySelectorAll选择所有元素，然后遍历它们
      const elements = doc.querySelectorAll('*');
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
    vaildateForm() {
      const form = document.getElementById('myForm');
      if (!form) return true;
      const elementsWithCustomAttr = form.querySelectorAll('[required]');
      for (let i = 0; i < elementsWithCustomAttr.length; i++) {
        const dom = elementsWithCustomAttr[i];
        const val = dom.value || dom.innerText;
        if (!val) {
          return false;
        }
      }
      return true;
    },
  }
})