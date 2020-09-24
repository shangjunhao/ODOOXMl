export default {
  makeRel(inherits) {
    // 分组合并
    if (!inherits.length) {
      return [];
    }
    if (inherits.length === 1) {
      return `[(4,ref('${inherits[0]['name']}'))]`;
    }
    inherits = inherits.map(item => {
      return `ref('${item['name']}')`;
    });
    return `[(6,0, ${inherits.join(",")})]`;
  },
  makeFields({fields}, isMany2one) {
    /**
     * 添加字段
     * colspan="3"
     * nolabel="1"
     * readonly="1"
     * required="True"
     * attrs="{
     *    'invisible': [('states', '!=', 'submit')],
     *    'readonly': [('states', '!=', 'draft')]
     * }"
     * options="{
     *    'no_create_edit': 1,
     *    'currency_field': 'currency_id'
     * }"
     * domain="[('states','=','submit')]"
     * */
    if (!fields.length) return '';
    let arr = [];
    arr = fields.map(item => {
      let widget = '';
      let readonly = '';
      let required = '';
      switch (item.ttype) {
        case 'datetime':
          widget = 'widget="date"';
          break;
        case 'many2one':
          if (isMany2one) {
            widget = 'options="{no_create_edit: True}"';
          }
          break;
        case 'char':
          if (item.name.indexOf('img') > -1) {
            widget = 'widget="ssPicture"';
          }
          break;
        default:
          break;
      }
      let info = `<!-- ${item.string} -->\n\t\t`;
      readonly = item._readonly ? ' readonly="True"' : '';
      required = item._required ? ' required="True"' : '';
      return info + `<field name="${item.name}" ${widget}${readonly}${required}/>`;
    });
    return arr.join('\n\t\t');
  },
  makeFilter({filter}) {
    if (!filter.length) return '';
    let arr = [];
    arr = filter.map(item => {
      let info = '<separator/>\n\t\t';
      return info + `<filter name="${item.name}" string="${item.string}" domain="[('${item.name}', '=', uid)]"/>`;
    });
    return arr.join('\n\t\t');
  },
  makeFieldGroup({fieldsGroup}) {
    // 添加搜索分组
    if (!fieldsGroup.length) return '';
    let arr = [];
    arr = fieldsGroup.map(item => {
      return `<filter name="${item.name}" string="${item.string}" context="{'group_by':'${item.name}'}"/>`;
    });
    return `<group expand="1" string="分组">${'\n\t\t\t' + arr.join('\n\t\t\t') + '\n\t\t'}</group>`;
  },
  convertId(options, type) {
    // 计算ID
    let sign = options.sign ? ('_'+options.sign) : '';
    switch (type) {
      case 'csv':
        return `id_${options.model._model}_${options.group.name}`;
      case 'role':
        return 'group_' + options.model._model + "_" + options.id;
      case 'menu':
        return options.model._model + '_menu' + sign;
      case 'tree':
        return options.model._model + '_tree' + sign;
      case 'form':
        return options.model._model + '_form' + sign;
      case 'action':
        return options.model._model + '_action' + sign;
      case 'search':
        return options.model._model + '_search' + sign;
      default:
        break;
    }
  },
  convertName(options, type) {
    // 计算Name
    switch (type) {
      case 'csv':
        return `name_${options.model._model}_${options.group.name}`;
      case 'menu':
        return options.model._name + ''; // 菜单
      case 'tree':
        return options.model._name + '表格';
      case 'form':
        return options.model._name + '表单';
      case 'action':
        return options.model._name + ''; // 动作
      case 'search':
        return options.model._name + '搜索';
      default:
        break;
    }
  },
  convertModel(model) {
    // 模型备用字段
    // name             model_ss_customer_analysis
    // module           ss_picture
    // complete_name    ss_picture.model_ss_customer_analysis
    // display_name     客户研究模型
    model._name = model.display_name;
    // 客户研究模型
    model._whole = model.name;
    // model_ss_customer_analysis
    model._model = model.name.slice(6);
    // ss_customer_analysis
    model._fullName = model['complete_name'];
    // ss_picture.model_ss_customer_analysis
    model._modelName = model._model.split('_').join('.');
    // ss.customer.analysis
    model._category = `base.module_category_` + model.module;
    // base.module_category_ss_picture
    return model;
  },
  convertDomain({domain, domains}) {
    // text | { name: '', domains: [{field: '', term: '', val: ''}], ...}
    if (domains && Array.isArray(domains.domains)) {
      let terms = [];
      terms = domains.domains.map(item => {
        return '("' + item.field + '", "' + item.term + '", ' + item.val + ')';
      });
      return '[' + terms.join(', ') + ']';
    } else {
      return '';
    }
  },
  /**  **/
  tplReplace() {
    return /{{(.*?)}}/g;
  },
  renderTpl(temp, options, normalizeOpt) {
    let normalizeData = normalizeOpt(options);
    return temp.replace(this.tplReplace(), (node, key) => {
      return normalizeData[key];
    });
  }
};
