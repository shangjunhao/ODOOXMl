<template>
  {{ viewCodeTree }}
</template>

<script>
import { reactive } from 'vue'
import usePageViews from './components/page'
// 测试数据
const model_test = {
  id: 7843,
  name: 'model_account_abstract_payment',
  model: 'ir.model',
  module: 'account',
  complete_name: 'account.model_account_abstract_payment',
  display_name: '模型',
}
const field_test = [
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
]
const config_test = {
  key: '',
  sign: '',
  // 列表属性配置
  tree_attrs: [
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
    tree_require: '',
    tree_readonly: '客户',
    tree_invisible: '',
  },
  tree_require: '',
  tree_readonly: '客户',
  tree_invisible: '',
}
const props = {
  // 主配置
  key: '',
  sign: '',
  // 请求数据 计算
  model: {},
  fields: [],
  // 列表属性配置
  tree_attrs: {
    editable: false,
    default_edit: '0',
    default_create: '0',
    default_delete: '0',
    order: [
      ['id', 'asc'],
      ['name', 'desc'],
    ],
  },
  tree_fields: '客户、工厂',
  tree_require: '',
  tree_readonly: '客户',
  tree_invisible: '',
}

export default {
  name: 'PageViews',
  props: {},
  setup() {
    const data = reactive(config_test)
    // 页面
    const { viewCodeTree } = usePageViews(data)

    return { viewCodeTree }
  },
}

// Vue3.0 使用体验
/**
 * 1、劫持和结构不断进行, 有点迷糊 .value属性很恶心
 */
</script>
