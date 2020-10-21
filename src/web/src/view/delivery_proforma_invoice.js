export default {
  key: 'model_delivery_proforma_invoice',
  sign: '',
  module: 'ss_purchase',
  children: false,

  tree: {
    del: '1',
    edit: '1',
    create: '1',
    order: 'id asc',
    attrs: {
      editable: 'top',
    },
    trees:
      '状态、批次号、客户、发票号、外销合同编号、客户订单号、销售金额、发票日期、交单日期、发票抬头、发票类型',
  },

  search: {
    groups: '客户、批次号、发票抬头、发票类型、状态',
    fields: '客户订单号、客户、批次号、发票抬头、发票号、外销合同编号',
    filters: ['交单日期', '发票日期'],
  },

  action: {
    domain: '[]',
    context: '{}',
    view_mode: 'tree',
  },

  menu: {
    // groups: '',
    parent: 'ss_web_page.web_main_menu_03',
    sequence: '1',
  },

  business: [
    // {
    //   domain: '[]',
    //   params: [],
    //   explain: '提交',
    //   methods: 'action_state_submit',
    // },
  ],

  category: {
    groups: [],
    description: '子权限: 议付单据明细、',
    baseGroups: [
      {
        id: 'lock',
        name: '只读',
        base: [],
      },
      {
        id: 'edit_no',
        name: '编辑-无菜单',
        base: [],
      },
      {
        id: 'edit',
        name: '编辑',
        base: ['lock'],
      },
      {
        id: 'admin',
        name: '管理',
        base: ['lock'],
      },
    ],
  },

  form: {
    id: '',
    name: '',

    del: '',
    edit: '',
    create: '',

    btns: [
      {
        fn: '',
        name: '',
        attrs: '',
      },
    ],

    opens: [
      {
        fn: '',
        name: '',
        attrs: '',

        icon: '',
        help: '',

        field: '',
      },
    ],

    state: {
      name: '',
      states: '',
    },

    pages: '',

    fields: '',
  },
}
