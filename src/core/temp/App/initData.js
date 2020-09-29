import { getFields, getModels } from '../../server/odoo-http'
import { convertModel, convertField } from '../../utils/odoo-utils'

// Utils
let msgList = []
function writeDomMsg(str) {
  msgList.push(str)
  document.body.innerHTML = ''
  document.write(msgList.join('</br>'))
}

// initData
async function initData(option) {
  const { key, module } = option
  // 数据请求
  return new Promise((res, rej) => {
    getModels(key, module).then((resModel) => {
      // records
      if (resModel.length) {
        writeDomMsg('模型数据: 请求成功!')
        let model = resModel.records[0]
        model = convertModel(model)
        getFields(model._modelName).then((resFields) => {
          writeDomMsg('字段数据: 请求成功!')
          let fields = resFields.records
          fields = initField(fields, option)
          res({
            model,
            fields,
          })
        })
      } else {
        writeDomMsg('请求模型数据失败!')
      }
    })
  })
}

// initField
function initField(modelFields, props) {
  let fieldsAttrs = new WeakMap()
  const {
    // modelFields,
    // tree: { trees },
    // search: { groups, fields, filters },
    fieldsAttrs: { fieldsRequire, fieldsReadonly, fieldsInvisible },
  } = props

  for (let item of modelFields) {
    // 字段处理
    let field = convertField(item)
    const { _key, _name } = field

    // 属性处理
    // @todo 这里的判断方式不行 需要更改为正则匹配
    if (fieldsRequire.includes(_name)) {
      field._attrs.require = '1'
    }
    if (fieldsReadonly.includes(_name)) {
      field._attrs.readonly = '1'
    }
    if (fieldsInvisible.includes(_name)) {
      field._attrs.invisible = '1'
    }

    // 部件
    // const widget = convertWidget(item)
    // attrs.widget = widget

    fieldsAttrs[_name] = field
  }

  return fieldsAttrs
}

export default initData
