const utils = [];
const install = function (Vue) {
  utils.forEach(plugin => {
    Vue.use(plugin);
  });
};
export default {
  install
}
