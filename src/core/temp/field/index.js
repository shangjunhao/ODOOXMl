// 思路转换
// 原本: 子组件通过字符串拼接的方式返回一个处理好的字符串列表
// 但是: 根据单一性原则、所有的模版组件应该只负责传入数据的处理、
// 所有use只负责导出整理好的数据、至于数据究竟如何渲染、组件内部并不关心

import ast from './index.json'
import { convertField } from '../../utils/odoo-utils'

export function useFieldItem(props) {
  let fieldsAttrs = new WeakMap()
  const {
    modelFields,
    tree: { trees },
    search: { groups, fields, filters },
    fieldsAttrs: { fieldsRequire, fieldsReadonly, fieldsInvisible },
  } = props

  for (item of modelFields) {
    // 字段处理
    // item = convertField(item)
    const { _key, _name } = item

    // 属性处理
    let attrs = {}
    if (fieldsRequire.includes(_name)) {
      attrs.require = '1'
    }
    if (fieldsReadonly.includes(_name)) {
      attrs.readonly = '1'
    }
    if (fieldsInvisible.includes(_name)) {
      attrs.invisible = '1'
    }

    // 部件
    // const widget = convertWidget(item)
    // attrs.widget = widget

    fieldsAttrs[_name] = {
      attrs,
      field: item,
    }
  }

  return {
    ast,
  }
}

// export function useFieldItem(props) {
//   let fieldsAttrs = new WeakMap()
//   const {
//     modelFields,
//     tree: { trees },
//     search: { groups, fields, filters },
//     fieldsAttrs: { fieldsRequire, fieldsReadonly, fieldsInvisible },
//   } = props

//   for (item of modelFields) {
//     // 字段处理
//     // item = convertField(item)
//     const { _key, _name } = item

//     // 属性处理
//     let attrs = {}
//     if (fieldsRequire.includes(_name)) {
//       attrs.require = '1'
//     }
//     if (fieldsReadonly.includes(_name)) {
//       attrs.readonly = '1'
//     }
//     if (fieldsInvisible.includes(_name)) {
//       attrs.invisible = '1'
//     }

//     // 部件
//     // const widget = convertWidget(item)
//     // attrs.widget = widget

//     fieldsAttrs[_name] = {
//       attrs,
//       field: item,
//     }
//   }

//   return {
//     ast,
//   }

// // 列表视图
// const { _trees } = useFieldCode(trees, fieldsAttrs)

// // 搜索视图
// const { _groups } = useFieldCode(fields, fieldsAttrs)
// const { _fields } = useGroupsCode(groups, fieldsAttrs)
// const { _filters } = useFiltersCode(filters, fieldsAttrs)
// }

// export function useFieldCode(list, fieldsAttrs) {
//   //
//   let fieldErr = []
//   let fieldAttrs = []
//   let fieldViews = []
//   for (let name of list) {
//     let item = fieldsAttrs[name]
//     if (item) {
//       let { attrs, field } = item

//       // attrs
//       attrs.name = field._key
//       fieldAttrs.push(attrs)

//       // views
//       let code = `<!--  ${name} --><field ${attrs} />`
//       fieldViews.push(code)
//     } else {
//       fieldErr.push(name)
//     }
//   }

//   return { fieldErr, fieldAttrs, fieldViews }
// }

// export function useGroupsCode(list, fieldsAttrs) {
//   let fieldErr = []
//   let fieldAttrs = []
//   let fieldViews = []
//   for (let name of list) {
//     let item = fieldsAttrs[name]
//     if (item) {
//       let { attrs, field } = item

//       // attrs
//       attrs.string = _name
//       attrs.name = `group_${field._key}`
//       attrs.context = `{'group_by':'${field._key}'}`
//       fieldAttrs.push(attrs)

//       // views
//       let code = `<filter ${attrs}/>`
//       fieldViews.push(code)
//     } else {
//       fieldErr.push(name)
//     }
//   }

//   return { fieldErr, fieldAttrs, fieldViews }
// }

// export function useFiltersCode(list, fieldsAttrs) {
//   let fieldErr = []
//   let fieldAttrs = []
//   let fieldViews = []
//   for (let name of list) {
//     if (name === 'string') {
//       let item = fieldsAttrs[name]
//       if (item) {
//         let { attrs, field } = item

//         // attrs
//         if (fields.ttype === 'selection') {
//           // 下拉选项
//         } else if (fields.ttype === 'datetime') {
//           // 时间选项
//           attrs.name = `date_${field._key}`
//           attrs.date = field._key
//           attrs.string = field._name
//         }
//       }
//     } else if (typeof name === 'object') {
//     }
//     // let item = fieldsAttrs[name]
//     // if (item) {
//     //   let { attrs, field } = item
//     // }
//   }
// }

// export function useFieldCode(props) {
//   // 字段处理
//   const {
//     modelFields,
//     tree: { trees },
//     search: { groups, fields, filters },
//     fieldsAttrs: { fieldsRequire, fieldsReadonly, fieldsInvisible },
//   } = props

//   props.tree.fields = new Array(trees.length)
//   props.search._groups = []
//   props.search._fields = []
//   props.search._filters = []

//   for (item of modelFields) {
//     let attrs = {}
//     // 字段处理
//     // item = convertField(item)

//     // 属性处理
//     const { _key, _name } = item
//     if (fieldsRequire.includes(_name)) {
//       attrs.require = '1'
//     }
//     if (fieldsReadonly.includes(_name)) {
//       attrs.readonly = '1'
//     }
//     if (fieldsInvisible.includes(_name)) {
//       attrs.invisible = '1'
//     }
//     // const widget = convertWidget(item)
//     // attrs.widget = widget

//     // 取值处理
//     if (trees.includes(_name)) {
//       // 视图列表 校验:
//       attrs.name = _key
//       props.tree.fields.push(attrs)
//     }
//     if (fields.includes(_name)) {
//       // 搜索字段 校验:
//       attrs.name = _key
//       props.search._fields.push(attrs)
//     }
//     if (groups.includes(_name)) {
//       // 搜索分组 校验: 存储字段
//       attrs.string = _name
//       attrs.name = `group_${_key}`
//       attrs.context = `{'group_by':'${_key}'}`
//       props.search._groups.push(attrs)
//     }
//     if (filters.includes(_name)) {
//       // 搜索过滤 校验:
//     }

//     // 错误处理
//   }
// }
