<template>
  <div class="sds-input"
    :class="[{'sds-input-focus-info-show': focused && (focusInfo || $slots.focusInfo)}]">
    <el-input
      v-bind="$attrs"
      :value="value"
      @focus="handleFocusEvent"
      @blur="handleBlurEvent"
      @input="handleInputEvent"
      @change="handleChangeEvent"
      @clear="handleClearEvent">
      <slot slot="prefix"><slot name="prefix"></slot></slot>
      <slot slot="suffix"><slot name="suffix"></slot></slot>
      <slot slot="prepend"><slot name="prepend"></slot></slot>
      <slot slot="append"><slot name="append"></slot></slot>
    </el-input>
    <div class="sds-input-focus-info" v-if="focusInfo || $slots.focusInfo"
      v-show="focused">
      <slot name="focusInfo">
        {{focusInfo}}
      </slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: "sds-input",
    inheritAttrs: false,
    props: {
      focusInfo: String,
      value: [String, Number]
    },
    data () {
      return {
        focused: false,
      }
    },
    methods: {
      handleBlurEvent (e) {
        this.focused = false;
        this.$emit("blur", e);
      },
      handleFocusEvent (e) {
        this.focused = true;
        this.$emit("focus", e);
      },
      handleInputEvent (value) {
        this.$emit("input", value);
      },
      handleChangeEvent (value) {
        this.$emit("change", value);
      },
      handleClearEvent () {
        this.$emit("clear");
      },
    },
  }
</script>
