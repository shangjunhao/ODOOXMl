// 指令属性解析

let instructs = [':', 'v-has:', 'v-if'] // 已有指令

export default function analysisAstAttrs(attrs, reactive) {
  console.log(attrs, reactive)
  // 属性处理 (vue中这里可以进行指令、事件等处理)
  let primordial = {}
  for (let attr in attrs) {
    let index = instructs.findIndex((ins) => {
      return attr.startsWith(ins)
    })
    if (index > -1) {
      let ins = instructs[index]
      let key = attr.split(instructs[index])[1]
      let val = analysisVal(reactive, attrs[attr])
      // console.log(key, val)
      switch (ins) {
        case ':':
          primordial[key] = val
          break
        case 'v-if':
          if (true) {
            // !val
            primordial['_isNotExhibition'] = true
          }
          break
        case 'v-has:':
          if (val !== null || val !== undefined || val !== '') {
            primordial[key] = val
          }
          break
        default:
          break
      }
      // 指令解析 @todo
    } else {
      // 原生属性
      primordial[attr] = attrs[attr]
    }
  }
  // console.log(primordial)
  return primordial
}

function analysisVal(reactive, valStr) {
  // 解析字符串变量
  let data = reactive
  let keys = valStr.split('.')
  for (let itemKey of keys) {
    if (data[itemKey]) {
      data = data[itemKey]
    } else {
      data = ''
    }
  }
  return data
}
