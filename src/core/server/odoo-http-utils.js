import http from './http'
// odoo处理 纯函数
const Util = {
  /**
   * 数据格式转换
   * [[ID, Name], ...] => [{id: ID, name: Name}, ...]
   * */
  arrayToJSON(arr) {
    if (!arr.length || !Array.isArray(arr)) {
      return []
    }

    let newArr = []
    newArr = arr.map((item) => {
      return {
        id: item[0],
        name: item[1],
      }
    })
    return newArr
  },
  /**
   * 数据格式转换
   * [{id: ID, name: Name}, ...] => { id: name, ...}
   * */
  jsonToObj(json) {
    // todo 测试

    let data = {}
    json.map((item) => {
      data[item.id] = item.name
    })
    return data
  },

  /**
   * 表单数据处理——为空字段删除
   *
   * */
  deleteNull(formInline) {
    Object.keys(formInline).map((key) => {
      let item = formInline[key]
      if (item === null) {
        delete formInline[key]
      }
    })
    return formInline
  },
}
export default {
  Util,
  /**
   * oDoo 详情解析 数据处理
   * config { key: { type: '', }}
   *
   *
   * config 字段类型、数据、是否表单字段
   * */
  resultHandle(res, config) {
    // debugger
    let formData = {}
    let postResults = {}
    let keys = Object.keys(config)

    if (!res) return { res, formData, postResults }
    if (Array.isArray(res) && res.length === 1) {
      ;[res] = res
    }

    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let val = res[key]
      let type = config[key]['type']
      let data = config[key]['data']
      let form = config[key]['form']
      if (form) {
        formData[key] = this.formInline(val, type, data)
        console.log(key, val, type, formData[key])
      }
      postResults[key] = this.postResults(val, type, data)
    }
    return { res, formData, postResults }
  },
  formInline(val, type, data) {
    // 增加返回值为 false 的处理
    // 提交时如果值为 null 则放弃上传
    // Many2one | select | boolean | json | char text time timeData
    let result = null
    switch (type) {
      case 'Many2one':
        // 输出ID
        result = val ? val[0] : null
        break
      // TODO Selection 待定
      case 'Selection':
      case 'Boolean':
      case 'Float':
        result = val
        break
      case 'Json':
        let json = val ? JSON.parse(val) : []
        result = json.map((item) => {
          return item.id
        })
        break
      default:
        result = val ? val : null
        break
    }
    return result
  },
  postResults(val, type, data) {
    let result = null
    switch (type) {
      case 'Many2one':
        // 输出内容
        result = val ? val[1] : '未定义'
        break
      case 'Selection':
        // 输出值
        result = data[val]
        break
      case 'Boolean':
      case 'Float':
        result = val
        break
      case 'Json':
        result = val ? JSON.parse(val) : []
        break
      default:
        result = val ? val : ''
        break
    }
    return result
  },

  /**
   * oDoo 初始化接口
   * */
  load(action_id, model, callback, context = {}) {
    let result = {}
    const url = 'action/load'
    let params = {
      action_id,
      additional_context: context,
    }
    http.odoo(url, params).then((res) => {
      result.load = res
      this.load_views(model, res.views).then((rel) => {
        result.fields = rel.fields
        result.fields_views = rel.fields_views
        callback && callback(result)
      })
    })
  },
  /**
   * oDoo 视图初始化接口
   * */
  load_views(model, views) {
    const url = 'dataset/call_kw/' + model + '/load_views'
    let params = {
      args: [],
      kwargs: {
        views,
      },
      method: 'load_views',
      model,
    }
    return http.odoo(url, params)
  },
  /**
   * oDoo 菜单初始化加载
   * */
  load_menus() {
    const url = 'dataset/call_kw/ir.ui.menu/load_menus'
    let params = {
      args: [false],
      model: 'ir.ui.menu',
      method: 'load_menus',
      kwargs: {},
    }
    return http.odoo(url, params)
  },
  /**
   * oDoo 列表数据查询接口
   * */
  searchRead(model, fields, offset = 0, limit = 8000, domain = [], sort = '') {
    const url = 'dataset/search_read'
    let params = {
      model, // 模型 ss.customer.analysis
      fields, // 字段 []
      offset, // 开始 0
      limit, // 结束 100
      domain, // 过滤条件 [['name', '=', 'Name']]
      sort, // 排序 'batch_no desc,sort_num asc'
    }
    return http.odoo(url, params)
  },
  /**
   * oDoo 详情数据查询接口
   * */
  read(model, id, fields) {
    const url = 'dataset/call_kw/' + model + '/read'
    let params = {
      args: [[Number(id)], fields],
      kwargs: {},
      method: 'read',
      model,
    }
    return http.odoo(url, params)
  },
  /**
   * oDoo 编辑数据查询接口
   * */
  write(model, id, fields) {
    const url = 'dataset/call_kw/' + model + '/write'
    let params = {
      args: [[Number(id)], fields],
      kwargs: {},
      method: 'write',
      model,
    }
    return http.odoo(url, params)
  },
  // 删除数据
  /**
   * oDoo 基础数据查询接口
   * */
  nameSearch(model, domain, name) {
    const url = 'dataset/call_kw/' + model + '/name_search'
    let params = {
      args: [],
      model: model, // 模型
      method: 'name_search',
      kwargs: {
        name: name, // 可选 字符串
        args: domain, // 过滤 ["&", ["customer", "=", true], ["is_company", "=", true]]
        operator: 'ilike',
        limit: name ? 10 : 8000,
      },
    }
    return http.odoo(url, params)
  },
  /**
   * oDoo 基础数据查询接口 组合版
   * */
  nameSearchList(list, callback) {
    let post = []
    let requests = []
    // 合并请求
    requests = list.map((item) => {
      let request = this.nameSearch(item.model, item.domain, item.name)
      item['request'] = request
      post.push(item)
      return request
    })
    // 发送请求 整理数据
    Promise.all(requests).then((res) => {
      requests = res.map((item, ind) => {
        let val = list[ind]
        val['data'] = Util.arrayToJSON(item)
        return val
      })
      callback(requests)
    })
  },
}
