export default {
  install (Vue) {
    Vue.directive('sds-empty-row', {
      update (el, binding, vnode) {
        const { createNumber, lang, langForCreate } = binding.value
        let isExist = false
        el.tableBody = el.querySelector('tbody');
        el.tableBody.setAttribute('lang', lang);
        for (let item of el.tableBody.children) {
          if (item.hasAttribute('data-number')) {
            el.emptyRow = item
            isExist = true
            el.emptyCell = el.emptyRow.querySelector('.sds-row-mask--empty__cell')
            break
          }
        }
        const colspan = el.tableBody.previousElementSibling.children.length
        if (!el.emptyRow) {
          el.emptyRow = document.createElement('tr');
          el.emptyCell = document.createElement('td');
          el.emptyCell.className = 'el-table_1_column_0 is-center sds-row-mask--empty__cell';
          el.emptyRow.className = 'el-table__row sds-row-mask--empty';
          el.emptyRow.appendChild(el.emptyCell);
        }
        el.emptyCell.setAttribute('colspan', colspan);
        el.emptyCell.setAttribute('rowspan', 1);
        el.emptyRow.setAttribute('data-number', langForCreate + ` (${createNumber})`);
        !isExist && createNumber !== 0 && el.tableBody.insertBefore(el.emptyRow, el.tableBody.childNodes[0]);
        isExist && createNumber === 0 && el.tableBody.removeChild(el.emptyRow)
      },
      unbind (el) {
        delete el.tableBody;
        delete el.emptyRow;
        delete el.emptyCell;
      }
    })
  }
}
