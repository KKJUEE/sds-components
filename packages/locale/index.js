import Vue from 'vue';
import VueI18n from 'vue-i18n';
import elLocale from "element-ui/lib/locale";
import messages from "./lang";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'zh',
  messages,
  silentTranslationWarn: true
});
Object.keys(messages.zh).forEach(namespace => {
  Vue.prototype[`$t_${namespace}`] = function (key) {
    return this.$t(`${namespace}.${key}`)
  };
});
// element-ui语言包兼容
elLocale.i18n((key, value) => i18n.t(key, value));

export default i18n;
