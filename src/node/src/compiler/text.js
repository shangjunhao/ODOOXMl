function analysisVal(reactive, valStr, ctx = {}) {
  // 解析字符串变量 简单写法
  // a.b.c.d
  // alias.a
  let data = JSON.parse(JSON.stringify(reactive))
  let keys = valStr.replace(/\s/g, '').split('.')
  for (let itemKey of keys) {
    if (ctx[itemKey]) {
      data = ctx[itemKey]
    } else if (data[itemKey]) {
      data = data[itemKey]
    } else {
      data = ''
    }
  }
  // if (data === 'wu') {
  //   console.log(key)
  //   console.log(val)
  //   console.log(keys)
  //   console.log(data)
  //   console.log('___________________')
  // }
  return data || ''
}

module.exports = {
  analysisVal,
}
