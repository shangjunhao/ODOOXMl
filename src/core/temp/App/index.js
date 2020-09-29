import template from './index.json'
import initData from './initData'

// 这个组件特殊处理
export default (data) => {
  return {
    data: {},
    name: 'v-app',
    props: data,
    template: template.ast,
    templates: {
      'v-tree': {},
    },
    setUp(props) {
      const { model, fields } = initData(props)
      props.model = model
      props.fields = fields
      return props
    },
  }
}
