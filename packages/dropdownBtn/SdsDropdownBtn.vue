<template>
  <el-dropdown v-split-btn
    v-on="$listeners"
    v-bind="$attrs"
    @visible-change="handleVisibleChange"
    :split-button="type==='split-button'"
    class="sds-dropdown-btn">
    <el-button type="more" icon="fa fa-ellipsis-h"
      :class="{'is-hover': show}"
      v-if="type==='more'">
      {{btnName}}
    </el-button>
    {{content}}
    <el-dropdown-menu slot="dropdown" class="sds-more-btn-menu">
      <slot>
        <el-dropdown-item v-for="item in options"
          :key="item.command"
          v-bind="item">
          {{item.text}}
        </el-dropdown-item>
      </slot>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
  export default {
    name: "sds-dropdown-btn",
    inheritAttrs: false,
    data () {
      return {
        show: false
      }
    },
    directives: {
      'split-btn': {
        bind (el, binding, vnode) {
          if (vnode.componentInstance.$parent.type === 'more') return;
          el._prevBtnSpan = el.querySelectorAll('.el-button')[0].children[0];
          el._nextBtnSpan = el.querySelectorAll('.el-button')[1].children[0];
          if (vnode.componentInstance.$parent.icon) {
            el._prevBtnSpanIcon = document.createElement('i');
            el._prevBtnSpanIcon.className = vnode.componentInstance.$parent.icon;
            el._prevBtnSpan.insertBefore(el._prevBtnSpanIcon, el._prevBtnSpan.childNodes[0])
          }
          el._nextBtnSpan.querySelector('.el-icon-arrow-down').className = 'fa fa-ellipsis-h'
        }
      }
    },
    props: {
      options: {
        type: Array,
        required: true
      },
      type: {
        type: String,
        default: 'more'
      },
      content: {
        type: String,
      },
      icon: {
        type: String,
      },
      btnName: {
        type: String,
        default () {
          return this.$t('components.more')
        }
      }
    },
    methods: {
      handleVisibleChange (visible) {
        this.show = visible
      }
    }
  }
</script>
