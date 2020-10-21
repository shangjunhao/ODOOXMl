import {
  convertId,
  convertName,
  convertModel,
  convertField,
} from './odoo-utils'

function getMyFields(fieldsObj, str, type) {
  let views = []
  let results = []
  let errList = []
  // 格式化参数
  if (typeof str === 'string') {
    views = str.split('、')
  } else if (Array.isArray(str)) {
    views = str
  } else {
    views = []
  }
  // 遍历
  for (let i = 0, len = views.length; i < len; i++) {
    // let filtersList = []
    const viewItem = views[i]
    const name = viewItem['name'] || viewItem
    if (fieldsObj[name]) {
      // 存在、按不同的需求添加属性
      let separator = true
      let item = fieldsObj[name]
      let base = item._base // 请求到的属性
      let attrs = Object.assign({}, item._attrs)
      switch (type) {
        case 'tree':
          // attrs.string = item._name
          break
        case 'fields':
          // attrs.string = item._name
          break
        case 'filters':
          if (viewItem.domain) {
            // 该配置参数为对象 可能有domain属性
            attrs.domain = viewItem.domain
            attrs.name = item._key + viewItem.sign
            attrs.string = item._name + viewItem.string
          } else if (base.ttype === 'selection') {
            attrs.string = item._name
            // 这里需要获取
          } else if (base.ttype === 'datetime' || base.ttype === 'date') {
            attrs.name = `date_${item._key}`
            attrs.date = item._key
            attrs.string = item._name
          } else {
          }

          // 判断与上一个name是否相同
          if (i === 2) {
            separator = true
          }
          break
        case 'groups':
          if (item._isAllowGroup) {
            attrs.name = `group_${item._key}`
            attrs.string = item._name
            attrs.context = `{'group_by': '${item._key}'}`
          }
          break
        default:
          // tree fields
          break
      }
      results.push({ attrs, separator })
    } else {
      // 该字段说明在本模型 不存在
      errList.push(name)
    }
  }
  return results
}

export default function getData(option, model, fields) {
  // @todo
  // 默认配置合并、数据校验、数据请求

  // 模型数据处理
  option.model = model = convertModel(model)

  // 模型字段第一次处理
  option.fields = fields = fields.map((item) => convertField(item))

  let fieldsObj = {}
  for (let field of fields) {
    fieldsObj[field._name] = field
  }

  // 列表数据
  option.tree.id = convertId(option, 'tree')
  option.tree.name = convertName(option, 'tree')
  option.tree.fields = getMyFields(fieldsObj, option.tree.trees, 'tree')

  // 搜索视图
  option.search.id = convertId(option, 'search')
  option.search.name = convertName(option, 'search')
  option.search.fields = getMyFields(fieldsObj, option.search.fields, 'fields')
  option.search.filters = getMyFields(
    fieldsObj,
    option.search.filters,
    'filters'
  )
  option.search.groups = getMyFields(fieldsObj, option.search.groups, 'groups')

  // 动作视图
  option.action.id = convertId(option, 'action')
  option.action.name = convertName(option, 'action')
  if (option.form) {
    option.action.view_ids = `[(5, 0, 0),(0, 0, {'view_mode': 'tree', 'view_id': ref('${option.tree.id}')}),(0, 0, {'view_mode': 'form', 'view_id': ref('${option.form.id}')}),]`
  } else {
    option.action.view_ids = `[(5, 0, 0),(0, 0, {'view_mode': 'tree', 'view_id': ref('${option.tree.id}')}),]`
  }

  // 菜单视图
  option.menu.id = convertId(option, 'menu')
  option.menu.name = convertName(option, 'menu')
  option.menu.groups = option.menu.groups || `group_${model._model}_lock`

  // 业务视图
  option.business = option.business.map((item) => {
    item.id = `action_${item.methods}`
    item.code = `action=records.${item.methods}(${item.params.join()})`
    return item
  })

  // 权限视图
  if (option.children) {
    let implied_ids = {}
    option.category.name = `${model._name}-权限组`
    option.category.groups = option.category.baseGroups.map((item) => {
      let groupItem = {}
      groupItem.eval = []
      const { id, name, base } = item

      groupItem.id = `group_${model._model}_${id}`
      groupItem.name = `辅助组-${model._name}-${name}`

      // 记录已有ID
      implied_ids[id] = groupItem.id

      base.map((itemID) => {
        if (implied_ids[itemID]) {
          groupItem.eval.push(`(4,ref('${implied_ids[itemID]}'))`)
        } else {
          console.log('分组继承出错, ', implied_ids[itemID])
        }
      })
      groupItem.eval = groupItem.eval.toString()
      return groupItem
    })
  }

  // 返回数据
  return option
}
