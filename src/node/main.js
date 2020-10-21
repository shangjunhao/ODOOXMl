const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const updateViewCodeHttp = require('./index')

const app = new Koa()
app.use(bodyParser())

app.use(async (ctx, next) => {
  // console.log(ctx)
  if (ctx.method === 'POST') {
    // console.log(ctx.request.body)
    const { temp, data } = ctx.request.body
    updateViewCodeHttp(temp, data, (res, err) => {
      ctx.body = res
    })
  } else {
    ctx.body = 'hello koa'
  }
})

app.listen(3001, () => {
  console.log('server is running')
})

// 测试：
// const temp = `
// <odoo>
//   <data>
//     <!-- tree -->
//     <record :id="tree.id" model="ir.ui.view">
//       <field name="name">{{ tree.name }}</field>
//       <field name="model">{{ model._modelName }}</field>
//       <field name="arch" type="xml">
//         <tree
//           :string="tree.name"
//           :create="tree.create"
//           :edit="tree.edit"
//           :delete="tree.del"
//           :default_order="tree.order"
//           v-has:editable="form"
//         >
//           <field v-for="item in tree.fields"></field>
//         </tree>
//       </field>
//     </record>
//   </data>
// </odoo>
// `

// const data = {
//   key: 'model_product_template',
//   name: '产品',
//   module: 'ss_sample',
//   sign: 'h',

//   tree: {
//     del: '1',
//     edit: '1',
//     create: '1',
//     order: 'id asc',
//     trees: '客户、供应商、客户货号'.split('、'),
//     // id name _fields 计算
//   },

//   search: {
//     groups: '客户'.split('、'),
//     fields: '供应商'.split('、'),
//     filters: [
//       {
//         name: '客户货号',
//         domain: '',
//       },
//       '状态',
//     ],
//     // _groups _fields _filters
//   },

//   action: {
//     domain: '[]',
//     context: '{}',
//     view_mode: 'tree',
//     // view_ids 计算
//   },

//   menu: {
//     parent: '', // 计算
//     sequence: '', // 计算
//     // groups 生成
//   },

//   category: {
//     // id
//     name: '',
//     description: '',
//     groups: [
//       {
//         id: 'lock',
//         name: '只读',
//         base: [],
//       },
//       {
//         id: 'edit',
//         name: '编辑',
//         base: [],
//       },
//       {
//         id: 'admin',
//         name: '管理',
//         base: [],
//       },
//     ],
//   },

//   fieldsAttrs: {
//     other: {},
//     fieldsRequire: 'ID'.split('、'),
//     fieldsReadonly: 'ID'.split('、'),
//     fieldsInvisible: 'ID'.split('、'),
//     tree_fields: '客户、工厂、客户货号',
//   },

//   // http
//   model: {
//     id: 7843,
//     name: 'model_account_abstract_payment',
//     model: 'ir.model',
//     module: 'account',
//     complete_name: 'account.model_account_abstract_payment',
//     display_name: '测试模型',
//   },
//   modelFields: [
//     {
//       id: 10909,
//       name: 'name',
//       field_description: '客户',
//       model_id: [526, '\u51fa\u8fd0\u8981\u6c42\u660e\u7ec6'],
//       ttype: 'datetime',
//       state: 'base',
//       index: false,
//       store: false,
//       readonly: true,
//       relation: false,
//     },
//   ],
// }

// const name = 'delivery_proforma_invoice'

// ;(async () => {
//   await updateViewCodeHttp(temp, data, name)
// })()
