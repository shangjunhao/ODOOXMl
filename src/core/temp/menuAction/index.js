export function useActionView(props) {
  // 动作视图

  let action = reactive(props.action)

  action.name = props.name ? props.name : convertName(props, 'action')

  // view_ids
  let tree_id = convertId(props, 'tree')
  let form_id = convertId(props, 'form')
  if (action.view_ids) {
    //
  } else if (props.form) {
    action.view_ids = `[(5, 0, 0),
      (0, 0, {'view_mode': 'tree', 'view_id': ref('${tree_id}')}),
      (0, 0, {'view_mode': 'form', 'view_id': ref('${form_id}')}),
]`
  } else {
    action.view_ids = `[(5, 0, 0),
      (0, 0, {'view_mode': 'tree', 'view_id': ref('${tree_id}')}),
]`
  }

  return { action }
}
