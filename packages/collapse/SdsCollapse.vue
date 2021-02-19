<template>
  <div class="sds-collapse" @change="change">
    <el-collapse v-bind="$attrs" v-model="activeName">
      <el-collapse-item v-for="item in collapseList"
        v-bind:key="item.id"
        :title="item.title"
        :name="item.name"
        :disabled="item.disabled">
        <template slot="title">
          <div @click="pauseEvent">
            <span class="sds-collapse__icon-prefix">
              <slot name="prefix">
                <i class="sds-collapse__icon" v-if="!!item.prefixIcon" :class="item.prefixIcon"></i>
              </slot>
            </span>
            <span class="sds-collapse__title" v-if="item.title"
              @click="activeClick(item.title)">
              {{item.title}}
            </span>
            <div v-else-if="!!item.titleList && !item.title && item.titleList.length !== 0">
              <div class="sds-collapse__custom-title">
                <div class="sds-collapse__title-item" v-for="titleItem in item.titleList"
                  v-bind:key="titleItem.id"
                  @click="!titleItem.click ? '' : activeClick(titleItem)">
                  <span class="sds-collapse__icon-prefix" v-if="!!titleItem.prefixIcon">
                    <i :class="titleItem.prefixIcon"></i>
                  </span>
                  <span>{{titleItem.key}}</span>
                  <span v-if="!!titleItem.value">: {{titleItem.value}}</span>
                  <span class="sds-collapse__icon-suffix" v-if="!!titleItem.suffixIcon">
                    <i :class="titleItem.suffixIcon"></i>
                  </span>
                </div>
              </div>
            </div>
            <span class="sds-collapse__icon-suffix">
              <slot name="suffix">
                <i class="fa fa-caret-down" v-if="!!item.suffixIcon" :class="item.suffixIcon"></i>
              </slot>
            </span>
          </div>
          <span class="sds-collapse__icon-suffix">
            <slot name="suffix">
              <i class="fa fa-caret-down" v-if="!!item.suffixIcon" :class="item.suffixIcon"></i>
            </slot>
          </span>
        </template>
        <slot name="customTitle"></slot>
        <slot></slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import { isObject, isString, pauseEvent } from "../utils/utils"; // 需要全局国际化
  export default {
    name: "sds-collapse",
    props: {
      /**
       * collapseList: [{
       *   name: String
       *   title: String/titleList: Array
       *   title: String
       *   suffixIcon
       *   prefixIcon
       * }]
       * titleList: [{
       *   key: String
       *   value: String/number
       *   suffixIcon
       *   prefixIcon
       *   click
       * }]
       */
      collapseList: Array
    },
    data () {
      return {
        activeName: ''
      }
    },
    methods: {
      pauseEvent,
      /**
       * title点击/titleList中存在click的子title 展开/关闭事件
       * @param active
       */
      activeClick (active) {
        if (!isObject(active) && !isString(active)) return;
        let activeAvailable = isObject(active) ? active.key : active;
        this.activeName = this.activeName === activeAvailable ? '' : activeAvailable;
      },
      change (activeName) {
        this.$emit("change", activeName);
      }
    }
  }
</script>

<style scoped>

</style>
