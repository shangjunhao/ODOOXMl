export default {
  key: 'model_delivery_proforma_invoice',
  sign: 'test',
  name: '产品',
  module: 'ss_purchase',

  children: null,
  // children: [],

  tree: {
    del: '1',
    edit: '1',
    create: '1',
    order: 'id asc',
    attrs: {
      // editable: 'top',
    },
    trees:
      '状态、批次号、客户、发票号、外销合同编号、客户订单号、销售金额、发票日期、交单日期、发票抬头、发票类型',
  },

  search: {
    groups: '客户、供应商、客户货号',
    fields: '供应商',
    filters: [
      {
        name: '客户货号',
        domain: '[]',
        string: '大于0',
        sign: '_1',
      },
      {
        name: '客户货号',
        domain: '[]',
        string: '小于0',
        sign: '_0',
      },
      '核价状态',
      '最后更新时间',
    ],
  },

  action: {
    domain: '[]',
    context: '{}',
    view_mode: 'tree',
  },

  menu: {
    parent: 'ss_purchase.purchase_order_menu_package',
    sequence: '1',
  },

  business: [
    {
      domain: '[]',
      params: [],
      explain: '提交',
      methods: 'action_state_submit',
    },
    {
      domain: '[]',
      params: [],
      explain: '撤销提交',
      methods: 'action_state_draft',
    },
  ],

  category: {
    name: '产品',
    description: '产品描述',
    groups: [
      {
        id: 'lock',
        name: '只读',
        base: [],
      },
      {
        id: 'edit',
        name: '编辑',
        base: [],
      },
      {
        id: 'admin',
        name: '管理',
        base: [],
      },
    ],
  },
}
