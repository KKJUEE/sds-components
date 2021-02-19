<template>
  <div class="sds-modal-body">
    <template v-if="rootModal.isInfo">
      <div class="sds-modal-info-msg-wrapper"
         v-if="infoMsg || ($scopedSlots.infoMsg && $scopedSlots.infoMsg())">
        <slot name="infoMsg">
          <p class="sds-modal-info-msg" v-html="infoMsg">
          </p>
        </slot>
      </div>
      <sds-detail-collapse
        v-if="details.length > 0"
        :title="$t('components.modal_expandDetail')"
        class="sds-modal-detail-collapse">
        <p v-for="detail in details" :key="detail">
          {{detail}}
        </p>
      </sds-detail-collapse>
      <el-form v-if="rootModal.type==='yes'" :model="form" :rules="rules" ref="form">
        <el-form-item class="sds-modal-yes-form-item" prop="yes">
          <el-input class="sds-modal-yes-input" v-model="form.yes" maxlength="3"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <slot></slot>
  </div>
</template>

<script>
  import { TYPES } from "./SdsModal";
  import SdsDetailCollapse from "../detailCollapse/SdsDetailCollapse";

  export default {
    components: {
      SdsDetailCollapse,
    },
    name: "sds-modal-body",
    inject: ["rootModal"],
    data () {
      return {
        form: {
          yes: ""
        },
        rules: {
          yes: [
            { required: true, pattern: /YES$/, trigger: "change", message: this.$t("components.modal_yes_validate") }
          ]
        }
      }
    },
    computed: {
      infoMsg () {
        let msg = "";
        const extraYesTip = this.rootModal.type === TYPES.YES ? this.$t("components.modal_yes_msg") : "";
        if (this.rootModal.infoMsg) {
          msg = this.rootModal.infoMsg + extraYesTip;
        } else {
          msg = extraYesTip;
        }
        return msg;
      },
      details () {
        return this.rootModal.details || [];
      }
    },
    methods: {
      checkForm () {
        let result;
        this.$refs.form.validate(valid => {
          result = valid;
        });
        return result;
      },
      resetForm () {
        this.$refs.form && this.$refs.form.resetFields();
      }
    }
  }
</script>
