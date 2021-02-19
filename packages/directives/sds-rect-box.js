import { on, off } from 'element-ui/lib/utils/dom';

const updateStyle = (target, { top, left, width, height }) => {
  target.style.top = top;
  target.style.left = left;
  target.style.width = width;
  target.style.height = height;
}

export default {
  install (Vue) {
    Vue.directive('sdsRectBox', {
      bind (el, binding, vnode) {
        el._mdRectHandle = e => {
          if (e.target !== el) {
            return;
          }
          let rectBox = document.createElement('div');
          const startX = e.clientX;
          const startY = e.clientY;
          rectBox.className = 'rect-box-fix';
          updateStyle(rectBox, {
            left: `${startX}px`,
            top: `${startY}px`,
            width: 0,
            height: 0
          });
          document.body.appendChild(rectBox);
          const moveHandle = (e) => {
            const endX = e.clientX;
            const endY = e.clientY;
            updateStyle(rectBox, {
              left: `${Math.min(startX, endX)}px`,
              top: `${Math.min(startY, endY)}px`,
              width: `${Math.abs(endX - startX)}px`,
              height: `${Math.abs(endY - startY)}px`
            })
          }
          const upHandle = () => {
            document.body.removeChild(rectBox);
            rectBox = null;
            off(el, 'mousemove', moveHandle);
            off(document, 'mouseup', upHandle);
          }
          on(el, 'mousemove', moveHandle);
          on(document, 'mouseup', upHandle);
        }
        on(el, 'mousedown', el._mdRectHandle);
      },
      unbind (el) {
        off(el, 'mousedown', el._mdRectHandle);
        delete el._mdRectHandle;
      }
    })
  }
}
