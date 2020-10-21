export default {
  key: 'model_product_template',
  sign: 'test',
  name: '产品',
  module: 'ss_sample',

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
    trees: '客户、供应商、客户货号、最后更新时间、计价',
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

  // 后面处理
  // fieldsAttrs: {
  //   other: {},
  //   fieldsRequire: 'ID'.split('、'),
  //   fieldsReadonly: 'ID'.split('、'),
  //   fieldsInvisible: 'ID'.split('、'),
  //   tree_fields: '客户、工厂、客户货号',
  // },
  // http
  // model: {
  //   id: 7843,
  //   name: 'model_account_abstract_payment',
  //   model: 'ir.model',
  //   module: 'account',
  //   complete_name: 'account.model_account_abstract_payment',
  //   display_name: '测试模型',
  // },
  // modelFields: [
  //   {
  //     id: 10909,
  //     name: 'name',
  //     field_description: '客户',
  //     model_id: [526, '\u51fa\u8fd0\u8981\u6c42\u660e\u7ec6'],
  //     ttype: 'datetime',
  //     state: 'base',
  //     index: false,
  //     store: false,
  //     readonly: true,
  //     relation: false,
  //   },
  // ],
}
