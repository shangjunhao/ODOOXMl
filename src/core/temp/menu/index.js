export function useMenuView(props) {
  // 菜单视图
  let menu = reactive(props.menu)

  menu.id = convertId(props, 'menu')

  menu.name = props.name ? props.name : convertName(props, 'menu')

  menu.parent = props.module + '_menu' // 模块对应的菜单

  menu.groups = menu.groups || `group_${props.model._model}_lock` // 默认是只读分组、如果没有权限设置、则应为空  @todo

  return { menu }
}
