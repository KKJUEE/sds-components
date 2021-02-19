import baseSet from "./SdsBaseSet";
import baseSetItem from "./SdsBaseSetItem";

baseSet.install = function (Vue) {
  Vue.component(baseSet.name, baseSet);
};

baseSetItem.install = function (Vue) {
  Vue.component(baseSetItem.name, baseSetItem);
};
export const SdsBaseSet = baseSet;
export const SdsBaseSetItem = baseSetItem
