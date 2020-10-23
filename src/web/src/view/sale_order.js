export default {
  sign: '',
  key: 'sale.order',
  module: 'ss_purchase',
  children: false,

  tree: {
    del: '0',
    edit: '1',
    create: '1',
    order: 'id asc',
    attrs: {
      // editable: 'top',
    },
    trees:
      '状态、销售员、客户、报价单号、客户订单号、总货号数、美金采购货号.、美金毛利率%.、人民币采购货号.、人民币毛利率%.、单据日期、报价日期、订单日期、最早交期、最迟交期、贸易条款、总金额、​、状态、销售员、客户、报价单号、客户订单号、总货号数、美金采购货号.、美金毛利率%.、人民币采购货号.、人民币毛利率%.、单据日期、报价日期、订单日期、最早交期、最迟交期、贸易条款、总金额',
  },

  search: {
    groups: '状态、销售员、客户分组',
    fields: '客户订单号、客户、销售员、报价单号',
    filters: [
      {
        name: '状态',
        selection: [
          {
            key: 'draft',
            name: '报价单',
          },
          {
            key: 'sent',
            name: '报价单送出',
          },
          {
            key: 'sale',
            name: '销售订单',
          },
          {
            key: 'done',
            name: '已锁定',
          },
          {
            key: 'cancel',
            name: '已取消',
          },
        ],
      },
      '报价日期',
      '订单日期',
      '承诺日期',
      {
        name: '创建人',
        sign: 'my',
        string: '我的报价单',
        domain: "[('create_uid','=',uid)]",
      },
      {
        name: '创建人',
        sign: 'team',
        string: '团队报价单',
        domain:
          "['|', ('create_uid.customer_group_category_ids', '=', False), ('create_uid.customer_group_category_ids','in',uid.partner_id.customer_group_category_ids.ids)]",
      },
    ],
  },

  action: {
    domain: "[('state','in',['draft', 'sent'])]",
    context: '{}',
    view_mode: 'tree,form',
  },

  menu: {
    // groups: '',
    parent: 'ss_web_page.web_main_menu_03',
    sequence: '2',
  },

  business: [
    {
      domain: '[]',
      params: [],
      explain: '提交',
      methods: 'action_state_submit',
    },
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

    pages: pages,

    fields: '',
  },
}
