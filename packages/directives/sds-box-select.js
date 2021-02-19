import { on, off } from 'element-ui/lib/utils/dom';

export default {
  install (Vue) {
    Vue.directive('sdsBoxSelect', {
      bind (el, binding, vnode) {
        el._mdBoxHandle = event => {
          if (event.target !== el) {
            return;
          }
          let sTop = el.scrollTop;
          let endTop = 0;
          const xAxis = [event.clientX, 0];
          const yAxis = [event.clientY, 0];
          const muHandle = event => {
            // 获取鼠标的坐标
            xAxis[1] = event.clientX;
            yAxis[1] = event.clientY;
            xAxis.sort((a, b) => a - b);
            yAxis.sort((a, b) => a - b);
            endTop = el.scrollTop;
            if (endTop > sTop) {
              yAxis[0] -= endTop - sTop;
            } else {
              yAxis[1] += sTop - endTop;
            }
            const w = xAxis[1] - xAxis[0];
            const h = yAxis[1] - yAxis[0];
            const childList = [...vnode.elm.children].filter(c => c.draggable);
            const arr = [];
            for (let i = 0; i < childList.length; i++) {
              const { left, top, right, bottom, width, height } = childList[i].getBoundingClientRect();
              const condition1 = Math.max(xAxis[1], right) - Math.min(xAxis[0], left) <= w + width;
              const condition2 = Math.max(yAxis[1], bottom) - Math.min(yAxis[0], top) <= h + height;
              if (condition1 && condition2) {
                arr.push(childList[i].dataset.value);
              }
            }
            if (typeof binding.value === 'function') {
              binding.value(arr);
            }
            off(document, 'mouseup', muHandle);
          }
          on(document, 'mouseup', muHandle);
        }
        on(el, 'mousedown', el._mdBoxHandle);
      },
      unbind (el) {
        off(el, 'mousedown', el._mdBoxHandle);
        delete el._mdBoxHandle;
      }
    })
  }
}
