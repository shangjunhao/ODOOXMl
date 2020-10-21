export default {
  key: 'model_delivery_proforma_invoice_line',
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
      '批次号、议付单据、客户、客户货号、英文描述、外销合同、客户订单号、客户系列、客户材质、客户单位、出库数量、销售单价、金额、出库箱数、出库体积CBM、出库毛重KG、出库净重KG、HTS#、集装箱号、铅封号',
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
