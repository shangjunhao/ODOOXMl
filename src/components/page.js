import { computed, reactive, ref, unref } from 'vue'
import { getMOdelDetail, getModelFields } from '../code/odoo-http'
import Utils from '../code/odoo-utils'
import useRecordView from './record'

const { convertModel, convertField, isExistenceStr } = Utils

async function usePageViews(props) {
  let data = reactive(props)
  // 模型层
  await getMOdelDetail(props.key).then((res) => {
    // 有多个数据组件需要加工后的数据、所以前置
    data.model = convertModel(res)
  })

  // 字段层
  await getModelFields(props.key).then((res) => {
    // 并不一定所有的字段都需要数据加工、所以后置
    data.fields = res
    // 但部分数据需要其他的数据辅助计算、所以前置
    const { fields_attrs } = props
    data.fields = res.map((item) => {
      const attrs = fields_attrs[item.name] || {}
      return convertField(item, attrs)
    })
  })

  // 视图
  console.log('props', data)
  // const Tree = useRecordView(props, 'tree')
  const Tree = useRecordView(data, 'tree')

  // 返回
  return Tree.viewCodeRecord.value
}

export default usePageViews
