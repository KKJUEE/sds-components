import Vue from 'vue'
import { isArray } from "@/utils/utils"; // 需要全局国际化

/**
 * notification内部中的按钮触发事件，返回notify对象
 * @param message notify对象
 * @param button 按钮对象
 */
function btnClick (message, button) {
  button.click(message)
}

/**
 * notify按钮组生成函数
 * @param self this，必要参数，$createElement需要
 * @param buttons 按钮组对象
 * @return {VNode} 生成的按钮组VNode
 */
function renderFooter (self, messages) {
  const h = self.$createElement;
  if (isArray(messages.buttons)) {
    let instances = []
    for (let button of messages.buttons) {
      let instance = h(
        'el-button',
        {
          style: button.style || {},
          attrs: button.attrs || {},
          on: {
            click: btnClick.bind(self, messages, button) // 改变this指向，仅仅绑定到当前函数
          }
        }, [
          button.text
        ]
      )
      instances.push(instance)
    }
    return h(
      "div", {
        class: ['sds-notification__message-button'],
      },
      instances
    )
  }
}

/**
 * 绑定到VUE原型方法上，方便调用
 * @param messages
 * messages
 *  title: *
 *  message: *
 * @return {ElNotificationComponent}
 */
Vue.prototype.$sdsNotify = function (messages = {}) {
  const h = this.$createElement;
  let notifyObj = {}
  notifyObj = {
    id: '',
    title: messages.title,
    type: "info",
    dangerouslyUseHTMLString: true,
    message: h(
      "div",
      {
        class: [
          "sds-notification__message",
        ],
      },
      [
        h('div', {
          class: 'sds-notification__text'
        }, messages.message),
        renderFooter(this, messages) // this必须需要，在renderFooter中，因为未绑定vue实例，无法获取this参数
      ]
    )
  }
  let propsArray = Object.keys(messages)
  propsArray.forEach(key => {
    if (key === 'message' || key === 'buttons') return; // 排除自定义的message和buttons
    notifyObj[key] = messages[key]
  })
  this.option = this.$notify(notifyObj)
  return this.option
}

Vue.prototype.$sdsNotify.close = function (notify) {
  notify.close()
}
