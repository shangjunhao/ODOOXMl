export function getMOdelDetail(key) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({
        id: 7843,
        name: 'model_account_abstract_payment',
        model: 'ir.model',
        module: 'account',
        complete_name: 'account.model_account_abstract_payment',
        display_name: '测试模型',
      })
    }, 500)
  })
}

export function getModelFields(key) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res([
        {
          id: 10909,
          name: 'name',
          field_description: '客户',
          model_id: [526, '\u51fa\u8fd0\u8981\u6c42\u660e\u7ec6'],
          ttype: 'datetime',
          state: 'base',
          index: false,
          store: false,
          readonly: true,
          relation: false,
        },
      ])
    }, 900)
  })
}
