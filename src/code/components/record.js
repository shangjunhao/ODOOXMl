import { computed, reactive, ref, unref } from 'vue'
import compiler from '../odoo-xml-compiler'
import Utils from '../odoo-utils'

import useTreeView from './tree'

const { convertId, convertName, convertAttr } = Utils

export default function useRecordView(props, type) {
  // @todo test
  // let record = reactive({})
  // record.id = convertId(props, type)
  const id = unref(computed(() => convertId(props, type)))

  const name = unref(computed(() => convertName(props, type)))

  const typeView = unref(
    computed(() => {
      switch (type) {
        case 'tree':
          const { tree, viewCodeTree } = useTreeView(props)
          return viewCodeTree.value
          break
        case 'form':
          break
        case 'menu':
          break
        case 'search':
          break
        case 'action':
          break
        case 'kanban':
          break
        default:
          break
      }
    })
  )

  //
  const record = reactive({
    id,
    name,
    type,
    typeView,
    model: props.model._modelName,
  })
  // 数据渲染
  const temp = `
<!-- {{type}} -->
<record id="{{id}}" model="ir.ui.view">
    <field name="name">{{name}}</field>
    <field name="model">{{model}}</field>
    <field name="arch" type="xml">
        {{typeView}}
    </field>
</record>  
`
  const render = compiler(temp)
  const viewCodeRecord = computed(() => render(record))

  return { record, viewCodeRecord }
}

// __tests__
const props = {
  type: '',
  model: {},
}
