import { computed, reactive, ref, unref } from 'vue'
import useFieldRender from './field'
import compiler from '../code/odoo-xml-compiler'
import Utils from '../code/odoo-utils'

const { convertId, convertName, convertAttrs } = Utils

function useTreeView(props) {
  // ID
  let id = unref(computed(() => convertId(props, 'tree')))

  // Name
  let name = unref(computed(() => convertName(props, 'tree')))

  // Model computed() => props.model.model
  let model = unref(computed(() => props.model.model))

  // Tree
  let treeAttr = unref(computed(() => convertAttrs(props.tree_attrs)))

  // Fields
  let fields = unref(
    computed(() => {
      // @todo 输出字段视图
      return props.fields.map((item) => {
        const { field, viewCodeField } = useFieldRender(item)
        return viewCodeField.value
      })
    })
  )

  // 导出数据
  const tree = { id, name, model, treeAttr, fields }
  // 导出字符串
  const temp = `<tree string="{{name}}"{{treeAttr}}>{{fields}}</tree>`
  const render = compiler(temp)
  const viewCodeTree = computed(() => render(tree))

  return { tree, viewCodeTree }
}

export default useTreeView

// __tests__
// const props = {
//   // 主配置
//   key: '',
//   sign: '',
//   // 请求数据
//   model: {},
//   fields: [],
//   // 列表属性配置
//   tree_attrs: {
//     editable: false,
//     default_edit: '0',
//     default_create: '0',
//     default_delete: '0',
//     order: [
//       ['id', 'asc'],
//       ['name', 'desc'],
//     ],
//   },
//   tree_fields: '客户、工厂',
//   tree_require: '',
//   tree_readonly: '客户',
//   tree_invisible: '',
// }
// const { viewCode } = useTreeView(props)
