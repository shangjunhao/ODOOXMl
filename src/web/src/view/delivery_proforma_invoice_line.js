const pages = `
<group>
    <group col="2">
        <field name="negotiate_invoice_cnt"/>
        <field name="negotiate_pkg_list_cnt"/>
        <field name="clearance_invoice_cnt"/>
        <field name="clearance_pkg_list_cnt"/>
    </group>
    <group col="2">
        <field name="invoice_title"/>
        <field name="invoice_package_qty"/>
        <field name="invoice_vol_cbm"/>
        <field name="invoice_amount"/>
    </group>
</group>
`

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
      '批次号、议付单据、客户、客户货号、英文描述、外销合同、客户订单号、客户系列、客户材质、客户单位、出库数量、销售单价、金额、出库箱数、出库体积CBM、出库毛重KG、出库净重KG、HTS#、集装箱号、铅封号',
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
    groups: '',
    parent: 'ss_web_page.web_main_menu_03',
    sequence: '1',
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
