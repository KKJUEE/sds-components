<template>
  <div class="sds-empty" :style="{height}">
    <div class="sds-empty-image-wrapper">
      <slot name="image">
        <img :src="image"/>
      </slot>
    </div>
    <slot name="description">
      <span v-if="description !== false" class="sds-empty-description">
        {{description || $t("components.empty_text")}}
      </span>
    </slot>
  </div>
</template>

<script>
  import emptyImgPath from "../assets/images/empty.png";

  export default {
    name: "sds-empty",
    props: {
      description: String,
      image: {
        type: String,
        default: emptyImgPath
      },
      height: String,
    },
  }
</script>
