export default {
  functional: true,
  props: {
    params: {
      type: Object,
    },
    column: {
      type: Object,
    },
    vm: {
      type: Object,
    },
    render: {
      type: [Function, String],
    },
    type: {
      type: String,
    }
  },
  render (h, context) {
    const { props } = context
    props.params.columnOption = props.column
    if (props.column.filter && props.type) {
      return h(
        'span',
        { class: 'sds-table-column-filter sds-thead-tools' },
        [
          props.render(h, props.params, props.vm, props.vm.$parent || {}),
          context.scopedSlots.default()
        ]
      )
    } else {
      return props.render(h, props.params, props.vm, props.vm.$parent || {})
    }
  }
}
