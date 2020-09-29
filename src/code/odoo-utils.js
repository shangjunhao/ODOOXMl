const Utils = {
  convertId(options, type) {
    // 计算ID
    let sign = options.sign ? '_' + options.sign : ''
    switch (type) {
      case 'csv':
        return `id_${options.model._model}_${options.group.name}`
      case 'role':
        return 'group_' + options.model._model + '_' + options.id
      case 'menu':
        return options.model._model + '_menu' + sign
      case 'tree':
        return options.model._model + '_tree' + sign
      case 'form':
        return options.model._model + '_form' + sign
      case 'action':
        return options.model._model + '_action' + sign
      case 'search':
        return options.model._model + '_search' + sign
      default:
        break
    }
  },
  convertName(options, type) {
    // 计算Name
    switch (type) {
      case 'csv':
        return `name_${options.model._model}_${options.group.name}`
      case 'menu':
        return options.model._name + '' // 菜单
      case 'tree':
        return options.model._name + '表格'
      case 'form':
        return options.model._name + '表单'
      case 'action':
        return options.model._name + '' // 动作
      case 'search':
        return options.model._name + '搜索'
      default:
        break
    }
  },
  convertAttr(key, val) {
    // 计算Attr | 为不是必须的属性提供
    if (key === 'default_order') {
      console.log(val[0])
      val = val
        .map((item) => {
          return `${item.key} ${item.order}`
        })
        .join(', ')
    }
    if (val === undefined) return ''
    if (val === false) val = '0'
    return `${key}="${val}"`
  },
  convertAttrs(attrs) {
    // 计算Attrs | [ {key, val}]
    let res = attrs.map((item) => {
      const { key, val } = item
      return convertAttr(key, val)
    })
    return res.join(' ')
  },
  convertModel(data) {
    // 模型备用字段
    let model = {}
    // name             model_ss_customer_analysis
    // module           ss_picture
    // complete_name    ss_picture.model_ss_customer_analysis
    // display_name     客户研究模型
    model._name = data.display_name
    // 客户研究模型
    model._whole = data.name
    // model_ss_customer_analysis
    model._model = data.name.slice(6)
    // ss_customer_analysis
    model._fullName = data['complete_name']
    // ss_picture.model_ss_customer_analysis
    model._modelName = model._model.split('_').join('.')
    // ss.customer.analysis
    model._category = `base.module_category_` + data.module
    // base.module_category_ss_picture
    return model
  },
  convertField(data, attrs) {
    // 字段备用字段
    let field = {}
    // name: 'name',
    // field_description: '客户',
    // model_id: [526, '\u51fa\u8fd0\u8981\u6c42\u660e\u7ec6'],
    // ttype: 'datetime',
    // state: 'base',
    // index: false,
    // store: false,
    // readonly: true,
    // relation: false,
    field._key = data.name
    // 字段键
    field._name = data.field_description
    // 字段名
    field._isAllowGroup = data.store
    // 是否允许分组
    field._attrs = [{ key: 'widget', val: convertWidget(data) }]
    if (attrs && attrs.length) {
      for (let item of attrs) {
        field._attrs.push(item)
      }
    }
    return field
  },
  convertWidget(field) {
    // 计算字段部件
    let widget = ''
    // 图片
    if (field.name.indexOf('img') > -1) {
      widget = 'ssPicture'
    }
    switch (field.ttype) {
      case 'datetime':
        widget = 'date'
        break
      default:
        break
    }
    return widget
  },
  isExistenceStr(key, str) {
    // 检查是否存在与某个字符串
    const list = str.split('、')
    return list.includes(key)
  },
}

export default Utils
