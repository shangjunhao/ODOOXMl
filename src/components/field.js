import { computed, reactive, ref, unref } from 'vue'
import Utils from '../code/odoo-utils'
import compiler from '../code/odoo-xml-compiler'

const { convertAttrs } = Utils

function useFieldRender(props) {
  // @todo 属性统一处理 不需要额外改动本页面代码
  // @question 是应该在外部处理数据 还是组件内只关心如何渲染
  //    将数据处理放在组件内部: 整体的业务逻辑更清晰、且外部的数据并不一定需要全部渲染
  //    但当某一数据有多个组件同时需要时, 可将其放在父组件中统一处理
  // @solution 这里只关心部分常见的属性配置、其余的属性配置通过 “xml修改” 完成

  // 属性配置 props._attrs
  let fieldAttr = unref(computed(() => convertAttrs(props._attrs)))

  // 导出数据
  const field = {
    fieldAttr,
    key: props._key,
    name: props._name,
  }

  // 导出字符串
  const temp = `
\t\t\t<!-- {{name}} -->
\t\t\t<field name="{{key}}"{{fieldAttr}}/>`
  const render = compiler(temp)
  const viewCodeField = computed(() => render(field))

  return { field, viewCodeField }
}

export default useFieldRender

// __tests__
// const props = {
//   id: 10909,
//   name: 'name',
//   field_description: '客户',
//   model_id: [526, '\u51fa\u8fd0\u8981\u6c42\u660e\u7ec6'],
//   ttype: 'datetime',
//   state: 'base',
//   index: false,
//   store: false,
//   readonly: true,
//   relation: false,
//
//   _key: '',
//   _name: '',
//   _attrs: {
//     colspan: '3',
//     nolabel: '1',
//     readonly: '1',
//     required: '1',
//     invisible: '1',
//     attrs: {
//       invisible: [('states', '!=', 'submit')],
//       readonly: [('states', '!=', 'draft')],
//     },
//     options: {
//       no_create_edit: 1,
//       currency_field: 'currency_id',
//     },
//     domain: [['states', '=', 'submit']],
//   },
// }
// const { viewCode } = useField(props)
