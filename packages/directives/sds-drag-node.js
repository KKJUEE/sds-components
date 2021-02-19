import { on, off } from 'element-ui/src/utils/dom';
import { isIE } from "../utils/utils";

export default {
  install (Vue) {
    Vue.directive('sdsDragNode', {
      bind (el, binding, vnode) {
        let shadowElm, dragWrap, dropWrap;
        el._dragstrartHandle = event => {
          if (!isIE()) {
            shadowElm = document.createElement('div');
            shadowElm.classList.add('dragging-shadow-box');
            shadowElm.innerHTML = vnode.context[binding.arg].length;
            document.body.appendChild(shadowElm);
            event.dataTransfer.setDragImage(shadowElm, 0, 0);
          }
          dragWrap = event.currentTarget;
          // setData方法 IE下只能为'text'或者'url',其余字段IE报错
          event.dataTransfer.setData('text', JSON.stringify(vnode.context[binding.arg]));
        }
        el._dragoverHandle = event => {
          // 必须，否则drop不生效
          event.preventDefault();
        }
        el._dropHandle = event => {
          event.preventDefault();
          dropWrap = event.currentTarget;
          if (dropWrap !== dragWrap) {
            const seleted = JSON.parse(event.dataTransfer.getData('text'));
            binding.value.dealDrop(seleted);
            event.dataTransfer.clearData();
            // 解决残留目标元素的问题
            dropWrap = null;
          }
        }
        el._dragendHandle = event => {
          !isIE() && document.body.removeChild(shadowElm);
          // drop到不能放置的区域为'none', 后者是禁止drop到当前元素
          if (event.dataTransfer.dropEffect !== 'none' && dragWrap !== dropWrap) {
            binding.value.dealDragend();
          }
          shadowElm = null;
          dragWrap = null;
          dropWrap = null;
        }
        on(el, 'dragstart', el._dragstrartHandle);
        on(el, 'dragover', el._dragoverHandle);
        on(el, 'drop', el._dropHandle);
        on(el, 'dragend', el._dragendHandle);
      },
      unbind (el) {
        off(el, 'dragstart', el._dragstrartHandle);
        off(el, 'dragover', el._dragoverHandle);
        off(el, 'drop', el._dropHandle);
        off(el, 'dragend', el._dragendHandle);
        delete el._dragstrartHandle;
        delete el._dragoverHandle;
        delete el._dropHandle;
        delete el._dragendHandle;
      }
    })
  }
}
