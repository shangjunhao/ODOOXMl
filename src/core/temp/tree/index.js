export function useTreeView(props) {
  // 列表视图
  // id, name, model, create, edit, del, order, fields
  // let tree = reactive(props.tree)
  const { tree } = props

  tree.id = convertId(props, 'tree')

  tree.name = convertName(props, 'tree')

  tree.fields = []

  return { tree }
}
