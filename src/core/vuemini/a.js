const ast = {
  odoo: {
    $: {},
    _: '',
    data: {
      $: {},
      _: '',
      tree: {
        $: {
          data: {
            del: '1',
            edit: '1',
            create: '1',
            order: 'id asc',
            trees: ['客户', '供应商', '客户货号'],
          },
        },
        _: '',
        li: [
          { $: { key: '客户' }, _: '客户' },
          { $: { key: '供应商' }, _: '供应商' },
          { $: { key: '客户货号' }, _: '客户货号' },
        ],
      },
    },
  },
}

var xml2js = require('xml2js')
let builder = new xml2js.Builder()
let xml = builder.buildObject(ast)
console.log(xml)
