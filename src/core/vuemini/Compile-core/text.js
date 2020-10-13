export function analysisVal(reactive, valStr, key, val) {
  // 解析字符串变量 简单写法
  // a.b.c.d
  // alias.a
  let data = reactive
  console.log('valStr,  ', valStr, key, val, '\t\r\n\t')
  let keys = valStr.split('.')
  for (let itemKey of keys) {
    if (itemKey === key) {
      data = val
    } else if (data[itemKey]) {
      data = data[itemKey]
    } else {
      data = ''
    }
  }
  return data
}
