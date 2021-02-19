<template>
  <div class="sds-breadcrumb-bar">
    <el-breadcrumb>
      <el-breadcrumb-item v-for="(item, index) in levels" :key="item.path">
        <span v-if="item.redirect === 'none' || index === levels.length - 1 && !isDetail">
          {{getI18nTextByMeta(item.meta)}}
        </span>
        <router-link v-else :to="item.path">
          {{getI18nTextByMeta(item.meta)}}
        </router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="isDetail">
        <div class="sds-breadcrumb-select" :class="[{'is-opened': selectDropdownVisible}]">
          <span class="sds-breadcrumb-select-title-wrapper">
            <span class="sds-breadcrumb-select-title">{{_selectedMap ? _selectedMap[labelKey] : ""}}</span>
            <i class="fa fa-caret-down sds-breadcrumb-select-arrow"></i>
          </span>
          <el-select v-model="_selectedMap" :value-key="valueKey"
            @visible-change="handleVisibleChange"
            ref="select"
            popper-class="sds-breadcrumb-select-popper">
            <div class="sds-breadcrumb-detail-search"
              :slot="searchSlot"
              :class="[{loading}]"
              v-loading="loading">
              <el-input class="sds-breadcrumb-detail-search-input" v-model="search"
                prefix-icon="fa fa-search"
                :placeholder="$t('components.placeholder_search')"
                ref="searchInput"
                v-if="!loading">
              </el-input>
              <div v-if="searchDetails.length===0 && !loading" class="sds-breadcrumb-detail-search-empty">
                {{$t("e l.select.noMatch")}}
              </div>
            </div>
            <ul class="sds-breadcrumb-select-scroll"
              v-scrollbar="{disabled: !selectDropdownVisible || loading, delay: 300, end: handleScrollEnd}">
              <el-option v-for="option in searchDetails"
                :value="option"
                :label="option[labelKey]"
                :key="option[valueKey]">
              </el-option>
              <li v-if="scrollLoading" class="align-center sds-primary-color">Loading...</li>
            </ul>
          </el-select>
        </div>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="sds-active-breadcrumb-item" v-if="!isDetail">
      <span class="sds-active-breadcrumb-item-text">
        {{getI18nTextByMeta(lastLevelMeta)}}
      </span>
      <el-tooltip placement="right" v-if="lastLevelMeta.tooltip" popper-class="sds-breadcrumb-popper">
        <div slot="content" v-html="getI18nTextByMeta(lastLevelMeta, lastLevelMeta.tooltip)"></div>
        <i class="fa fa-info-circle fa-1"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  import { isObject, isUnDefined, isIE } from "../utils/utils";
  import { escapeRegexpString } from "element-ui/lib/utils/util"
  const SELECTED_MAP_CACHE_KEY = "DETAIL_SELECTED_MAP";
  const SELECTED_LABEL_KEY = "DETAIL_SELECTED_LABEL_KEY";
  const SELECTED_VALUE_KEY = "DETAIL_SELECTED_VALUE_KEY";

  export default {
    name: "sds-breadcrumb-bar",
    props: {
      innerPage: Boolean,
    },
    data () {
      return {
        search: "",
        selectDropdownVisible: false,
        loading: true,
        details: [],
        scrollLoading: false,
        requesting: false,
        selectedMap: null
      }
    },
    created () {
      this.initSelectedMap();
      this.$eventBus.$on("request-names-api", this.assignRequestNamesApi);
    },
    mounted () {
      this.resolveReadonlyFocus();
    },
    beforeDestroy () {
      this.$eventBus.$off("request-names-api", this.assignRequestNamesApi);
    },
    computed: {
      levels () {
        return this.$route.matched.filter(item => {
          return item.meta && (item.meta.title || item.meta.breadcrumb);
        });
      },
      lastLevelMeta () {
        const lastLevel = this.levels[this.levels.length - 1];
        return lastLevel ? lastLevel.meta : null;
      },
      searchDetails () {
        let details = this.details;
        if (this.search) {
          details = details.filter(item => {
            return new RegExp(escapeRegexpString(this.search), 'i').test(item[this.labelKey]);
          });
        }
        return details;
      },
      labelKey () {
        return this.$route.params.labelKey || sessionStorage.getItem(SELECTED_LABEL_KEY) || "label";
      },
      valueKey () {
        return this.$route.params.valueKey || sessionStorage.getItem(SELECTED_VALUE_KEY) || "value";
      },
      _selectedMap: {
        set (val) {
          this.selectedMap = val;
        },
        get () {
          const selectedMap = this.selectedMap;
          if (isObject(selectedMap)) {
            return selectedMap;
          }
          return {
            [this.valueKey]: this.selectedVal,
            [this.labelKey]: this.$route.params[this.labelKey]
          };
        }
      },
      selectedVal () {
        let selectedVal = this.selectedMap ? this.selectedMap[this.valueKey]
          : this.$route.params[this.valueKey];
        return isUnDefined(selectedVal) ? selectedVal : String(selectedVal);
      },
      isDetail () {
        return this.$route.meta.detailed;
      },
      searchSlot () {
        return this.searchDetails.length > 0 ? 'default' : 'empty';
      }
    },
    watch: {
      _selectedMap (val) {
        val && sessionStorage.setItem(SELECTED_MAP_CACHE_KEY, JSON.stringify(val));
      },
      selectedVal (newVal, oldVal) {
        if (isUnDefined(newVal)) {
          return;
        }
        if (oldVal) {
          this.$router.replace({
            name: this.$route.name,
            params: this._selectedMap,
          });
        }
        this.$eventBus.$emit("breadcrumb-select-change", newVal);
      },
      isDetail (val) {
        this.resolveReadonlyFocus();
        if (!val) {
          this._selectedMap = null;
          sessionStorage.removeItem(SELECTED_MAP_CACHE_KEY);
          sessionStorage.removeItem(SELECTED_LABEL_KEY);
          sessionStorage.removeItem(SELECTED_VALUE_KEY);
        } else {
          sessionStorage.setItem(SELECTED_LABEL_KEY, this.labelKey);
          sessionStorage.setItem(SELECTED_VALUE_KEY, this.valueKey);
        }
      },
      searchSlot () {
        this.$nextTick(() => {
          if (isIE()) {
            requestAnimationFrame(() => {
              let inputIns = this.$refs.searchInput;
              if (!inputIns) {
                return;
              }
              let input = this.$refs.searchInput.getInput();
              input.value = "";
              this.searchInputFocus();
              input.value = this.search;
            });
          } else {
            this.searchInputFocus();
          }
        });
      }
    },
    methods: {
      initSelectedMap () {
        if (!this.isDetail) {
          return;
        }
        const selectedMapCache = JSON.parse(sessionStorage.getItem(SELECTED_MAP_CACHE_KEY));
        if (selectedMapCache &&
          String(selectedMapCache[this.valueKey]) !== this.$route.params[this.valueKey]) {
          this.$router.go(-1);
        }
        this._selectedMap = selectedMapCache;
      },
      handleVisibleChange (visible) {
        this.selectDropdownVisible = visible;
        if (!visible) {
          return;
        }
        this.search = "";
        if (this.enableCache && this.details.length > 0) {
          return;
        }
        this.loading = true;
        this.details = [];
        this.requestNames();
      },
      resolveReadonlyFocus () {
        if (!isIE() || !this.isDetail) {
          return;
        }
        this.$nextTick(() => {
          let inputIns;
          this.$refs.select && (inputIns = this.$refs.select.$refs.reference);
          inputIns && (inputIns.getInput().setAttribute("unselectable", "on"));
        });
      },
      searchInputFocus () {
        this.$refs.searchInput && this.$refs.searchInput.focus();
      },
      getI18nTextByMeta (meta = {}, key) {
        key = key || (meta.title || meta.breadcrumb);
        return meta.replaceI18nWord ? this.$replaceI18nWord(`aside.${key}`)
          : this.$t(`aside.${key}`);
      },
      assignRequestNamesApi (requestNamesApi, enableCache) {
        this.requestNamesApi = requestNamesApi;
        this.enableCache = enableCache;
      },
      requestNames (pagination) {
        if (typeof this.requestNamesApi !== "function" || this.requesting) {
          return;
        }
        this.requesting = true;
        return this.requestNamesApi(pagination)
          .then(resp => {
            let respData = resp.data || [];
            this.requesting = false;
            this.pagination = respData.pagination;
            this.loading = false;
            this.details = this.details.concat(this.pagination ? respData.data : respData);
          });
      },
      handleScrollEnd () {
        let pagination = this.pagination;
        if (!pagination || this.requesting ||
          pagination.pagenum === pagination.total) {
          return;
        }
        let params = {
          pagenum: ++pagination.pagenum,
          pagesize: pagination.pagesize
        };
        this.scrollLoading = true;
        this.requestNames(params)
          .then(resp => {
            this.scrollLoading = false;
          });
      }
    }
  }
</script>
