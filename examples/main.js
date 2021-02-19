import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
// import i18n from "../src/locale"
import "font-awesome/css/font-awesome.css"
// import utils from "../src/utils";
import SdsUI from '../packages'
// Vue.use(i18n)
Vue.use(ElementUI)
Vue.use(SdsUI)
// Vue.use(utils)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
