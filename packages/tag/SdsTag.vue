<template>
  <span class="sds-tag" :style="{height}" ref="tag">
    <span class="sds-tag__status" v-if="showIcon">
      <slot name="icon">
        <span :class="statusClass">
          <i class="fa fa-circle scale-half" :class="iconClass"></i>
          <span :title="status" class="sds-tag__status-text">
            <slot>{{status}}</slot>
          </span>
        </span>
      </slot>
    </span>
    <span v-if="showTag && !showIcon" class="sds-tag__label">
      <slot name="tag">
        <el-tag :title="label" class="sds-tag__el-tag" :class="tagClass"
                v-bind="{...$attrs}">
          <slot>{{label}}</slot>
        </el-tag>
      </slot>
    </span>
    <slot name="suffix">
      <span v-if="showSuffix">
        <el-tooltip v-bind="{...$attrs}" effect="dark" placement="right" class="sds-tag__tooltip">
          <i class="sds-tag__tooltip-icon el-icon-info"></i>
          <span slot="content">
            <slot name="content">
              <span>{{suffix}}</span>
            </slot>
          </span>
        </el-tooltip>
      </span>
    </slot>
  </span>
</template>

<script>
  export default {
    name: "sds-tag",
    props: {
      height: String,
      status: String,
      label: String,
      suffix: String,
      /**
       * tag-label: normal(正常) | warning(告警)| error(异常) | sub-health(亚健康) | danger(危险)
       *            | primary(eg:元数据+日志+缓存) | storage(eg:OSD) | maintained维护中 | third-part第三方
       *            | monitor(MON) | manager(OM) | tgt(TGT) | nas(NAS) | object(对象存储) | info(eg:信息标签)
       */
      statusClass: String,
      /** tag-status: normal(正常) | error(异常/失败) | sub-health(亚健康/降级)
       *            | unknown(未连接/未知) | primary(eg:已连接) | waiting(eg:排队中)
       */
      tagClass: String,
      iconClass: String,
      showIcon: {
        type: Boolean,
        default: false
      },
      showTag: {
        type: Boolean,
        default: true
      },
      // 控制suffix icon的显示,slot方式与v-if方式互斥，使用v-if控制是为了精准控制popper内容
      showSuffix: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleClick () {
        this.$emit("click")
      },
      handleClose () {
        this.$emit("close")
      }
    }
  }
</script>
