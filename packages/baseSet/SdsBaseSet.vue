<template>
  <div class="sds-base-set">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: "sds-base-set",
    componentName: 'BaseSet',
    props: {
      accrdion: {
        type: Boolean,
        default: false
      },
      value: {
        type: [Array, String, Number],
        default () {
          return []
        }
      }
    },
    provide () {
      return {
        baseSet: this
      }
    },
    data () {
      return {
        activeNames: this.accrdion ? [].concat(this.value[0]) : [].concat(this.value),
        cacheVnode: null,
        currentVnode: null,
        allItems: {},
        activeItem: {}
      }
    },
    watch: {
      value (newVal, oldVal) {
        this.activeNames = [].concat(newVal)
      },
      activeNames: {
        immediate: true,
        handler (newVal, oldVal) {
          this.addActiveItem(newVal)
        }
      }
    },
    methods: {
      getModalTrigger (instance) {
        return Object.prototype.toString.call(instance) === '[object MouseEvent]' || Object.prototype.toString.call(instance) === '[object PointerEvent]'
      },
      createModal (title) {
        this.modal = this.$modal.confirm({
          title: this.$t('components.base_set_modal_title', { title: title }),
          footer: this.$createElement('div', {
          }, [
            this.$createElement('el-button', {
              on: {
                click: this.handleUnSave
              }
            }, this.$t('components.base_set_dont_save')),
            this.$createElement('el-button', {
              on: {
                click: this.handleCancel
              }
            }, this.$t('components.base_set_cancel')),
            this.$createElement('el-button', {
              props: {
                type: 'primary'
              },
              on: {
                click: this.handleSave
              }
            }, this.$t('components.base_set_save')),
          ])
        });
      },
      handleModal (type, callback, item = null) {
        let beSaveItem;
        for (let key in this.activeItem) {
          if (this.activeItem[key].isUpdated) {
            beSaveItem = this.activeItem[key]
            break
          }
        }
        this.beSaveItem = item || beSaveItem
        this.beSaveItem.$emit('handleModal', {
          type: type,
          callback: callback
        })
      },
      handleSave (instance) {
        let isModalTrigger = this.getModalTrigger(instance)
        !isModalTrigger && (this.beSaveItem = instance)
        this.handleModal('save', (Message) => {
          isModalTrigger && this.modal.hide()
          this.$notify({
            title: Message,
            type: 'success'
          })
          this.beSaveItem.setInitData()
          isModalTrigger && this.handleItemClick(this.currentItem)
        }, !isModalTrigger && instance)
      },
      handleCancel () {
        this.handleModal('cancel', () => {
          this.modal.hide()
        })
      },
      handleUnSave (instance) {
        let isModalTrigger = this.getModalTrigger(instance)
        this.handleModal('unsave', function () {
          this.$nextTick(() => {
            isModalTrigger && this.modal.hide()
            isModalTrigger && this.handleItemClick(this.currentItem)
          })
        }.bind(this), !isModalTrigger && instance)
      },
      setActiveNames (activeNames) {
        activeNames = [].concat(activeNames)
        let value = this.accrdion ? activeNames[0] : activeNames
        this.activeNames = activeNames;
        this.$emit('input', value)
        this.$emit('change', value)
      },
      handleItemClick (item) {
        if (this.accrdion) {
          if (this.activeNames[0] !== '' && this.activeItem[this.activeNames[0]].isUpdated) {
            this.currentItem = this.activeItem[this.activeNames[0]]
            this.createModal(this.activeItem[this.activeNames[0]].title)
          } else {
            let name = (this.activeNames[0] || this.activeNames[0] === 0) && this.activeNames[0] === item.name ? '' : item.name
            this.setActiveNames(name)
          }
        } else {
          let needSaveItem = {};
          for (let key in this.activeItem) {
            if (this.activeItem[key].isUpdated) {
              needSaveItem[key] = this.activeItem[key]
            }
          }
          let entries = Object.entries(needSaveItem)
          if (entries.length) {
            entries.length === 1 && this.createModal(needSaveItem[entries[0][0]].title)
            if (entries.length > 1) {
              let title = entries.map(v => v[1].title).join('、')
              this.$modal.info({
                title: title + this.$t('components.base_set_modal_tip'),
              })
            }
          } else {
            let activeNames = this.activeNames.slice(0)
            let index = activeNames.indexOf(item.name)
            if (index > -1) {
              activeNames.splice(index, 1)
            } else {
              activeNames.push(item.name)
            }
            this.setActiveNames(activeNames)
          }
        }
      },
      handleAddItem (item) {
        this.$set(this.allItems, item.name, item)
      },
      handleRemoveItem (item) {
        delete this.allItems[item.name]
      },
      addActiveItem (active) {
        const that = this
        that.$nextTick(() => {
          this.activeItem = active.reduce((accumulator, cur) => {
            that.allItems[cur] && (accumulator[cur] = that.allItems[cur])
            return accumulator
          }, {})
        })
      }
    },
  }
</script>
