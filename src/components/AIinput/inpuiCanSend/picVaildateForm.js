
    // 图片验证表单
    export function picVaildate () {
       const form = document.getElementById('myForm');
       if (!form) return true;
       const elementsWithCustomAttr = form.querySelectorAll('[required]');
       for (let i = 0; i < elementsWithCustomAttr.length; i++) {
         const dom = elementsWithCustomAttr[i];
         if (!dom.value) {
           return false;
         }
        }
}
