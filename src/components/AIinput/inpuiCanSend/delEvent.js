export default function delEvent (e, r, that) {
  const startContainer = r.startContainer;
  const startOffset = r.startOffset;
  const endOffset = r.endOffset;
  const textContent = startContainer.textContent;

  if (e.inputType === 'deleteContentBackward') {
    // 当内容是dom时
    if (startContainer.nodeType === Node.ELEMENT_NODE) {
      const str = startContainer.classList.toString();
      if (str.includes("protected") && startOffset === 0) {
        // 输入框没有内容的情况下 不允许删除
        e.preventDefault();
      }
    } else {
      // 判断光标的父类元素
      const parentNode = startContainer.parentNode;
      if (parentNode && parentNode.className.includes('protected') && startOffset === 1) {
        // 输入框只剩下1个字符的时候，自己来处理
        e.preventDefault();
        const parentNode = startContainer.parentNode;
        parentNode.innerText = "";
        that.handleInputX(e); // 触发输入事件
      } else if (parentNode && parentNode.className.includes('protected') && startOffset === 0 && textContent.length === endOffset) {
        e.preventDefault();
        const parentNode = startContainer.parentNode;
        parentNode.innerText = "";
        that.handleInputX(e); // 触发输入事件
      }
    }
  } else if (e.inputType === 'insertFromPaste') {
    if (startContainer.nodeType === Node.ELEMENT_NODE) {
      const str = startContainer.classList.toString();
      if (str.includes("protected") && startOffset === 0) {
        // 复制粘贴的功能，前提请开启获取复制粘贴的内容
        e.preventDefault();
        // startContainer.innerText = that.modifiedContent;
        that.handleInputX(e);
        r.deleteContents();
        r.insertNode(document.createTextNode(that.modifiedContent));
        const selection = window.getSelection();
        // 调整光标位置
        r.collapse(false);
        selection.removeAllRanges();
        selection.addRange(r);
      }
    }
  }
}