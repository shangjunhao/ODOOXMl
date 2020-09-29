export function useSearchView(props) {
  // 搜索视图
  // id name model fields filters groups
  let search = reactive(props.search)
  const { groups, fields, filters } = search

  search.id = convertId(props, 'search')

  search.name = convertName(props, 'search')

  search.groups = []

  search.fields = []

  search.filters = []

  return { search }
}
