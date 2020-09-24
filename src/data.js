export default [
  {
    key: '',
    sign: '',
    // 列表属性配置
    tree_attrs: [
      {
        key: 'string',
        val: '',
      },
      {
        key: 'editable',
        val: false,
      },
      {
        key: 'edit',
        val: '0',
      },
      {
        key: 'create',
        val: '0',
      },
      {
        key: 'delete',
        val: '0',
      },
      {
        key: 'default_order',
        val: [
          {
            key: 'id',
            name: 'ID',
            order: 'asc',
          },
          {
            key: 'name',
            name: '名称',
            order: 'desc',
          },
        ],
      },
    ],
    tree_fields: '客户、工厂',
    fields_attrs: {
      name: [
        {
          key: 'readonly',
          val: '1',
        },
      ],
    },
  },
]
