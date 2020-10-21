// 获取基础数据并处理 menus groups models fields
import odoo from './odoo-http-utils'

function init(callback) {
  Promise.all([getMenus(), getGroups(), getModels(), getFields()]).then(
    (result) => {
      let res = {}
      res.menus = result[0].records
      res.groups = result[1].records
      res.models = result[2].records
      res.fields = result[3].records

      callback && callback(res)
    }
  )
}

export default init

export function getMenus() {
  const model = 'ir.model.data'
  const fields = [
    'id',
    'name',
    'model',
    'module',
    'complete_name',
    'display_name',
  ]
  const domain = [['model', '=', 'ir.ui.menu']]
  return odoo.searchRead(model, fields, 0, 10000, domain)
}

export function getModels(name, module = 'ss_') {
  // model_product_template
  // const model = "ir.model";
  // const fields = ["id", "name", "model", "modules"];
  // return odoo.searchRead(model, fields);
  const model = 'ir.model.data'
  const fields = [
    'id',
    'name',
    'model',
    'module',
    'complete_name',
    'display_name',
  ]
  const domain = [
    '&',
    ['model', '=', 'ir.model'],
    ['name', '=', name],
    ['module', 'like', module],
  ]
  return odoo.searchRead(model, fields, 0, 10000, domain)
}

export function getGroups() {
  const model = 'ir.model.data'
  const fields = [
    'id',
    'name',
    'model',
    'module',
    'complete_name',
    'display_name',
  ]
  const domain = [['model', '=', 'res.groups']]
  return odoo.searchRead(model, fields, 0, 10000, domain)
}

export function getFields(name = 'product.removal') {
  const model = 'ir.model.fields'
  const fields = [
    'name',
    'field_description',
    'model_id',
    'ttype',
    'state',
    'index',
    'store',
    'readonly',
    'relation',
    'selection',
  ]
  const domain = [['model_id', '=', name]]
  return odoo.searchRead(model, fields, 0, 10000, domain)
  // const model = "ir.model.data";
  // const fields = ["id", "name", "model", "module", "complete_name", "display_name"];
  // const domain = ["&", ["model", "=", 'ir.model.fields'], ["name", "ilike", name]];
  // return odoo.searchRead(model, fields, 0, 10000, domain);
}

export function getViews(name = 'product_removal') {
  const model = 'ir.model.data'
  const fields = [
    'id',
    'name',
    'model',
    'module',
    'complete_name',
    'display_name',
  ]
  const domain = ['&', ['model', '=', 'ir.ui.view'], ['name', 'ilike', name]]
  return odoo.searchRead(model, fields, 0, 10000, domain)
}
