const field = {
  field: {
    $: {
      name: 'name',
      require: '0',
      readonly: '0',
      invisible: '0',
      widget: '',
    },
  },
}
const tree = {}

var xml2js = require('xml2js')

var obj = { root: { $: { id: 'my id' }, _: 'my inner text' } }

// 生成
var builder = new xml2js.Builder()
var xml = builder.buildObject(field)
console.log(xml)

// 解析
let temp = `
<!-- tree -->
<record id="{{id}}" model="ir.ui.view">
    <field name="name">{{name}}</field>
    <field name="model">{{model}}</field>
    <field name="arch" type="xml">
        <tree string="{{name}}" default_order="name desc" create="1" edit="1" delete="1">
            {{fields}}
        </tree>
    </field>
</record>
`
var fs = require('fs')

var parser = new xml2js.Parser({ explicitArray: false })
parser.parseString(temp, function (err, result) {
  console.log(err)
  console.log(result)
  fs.writeFile(__dirname + '/data.json', JSON.stringify(result), (err) => {
    if (err) throw err
    console.log('文件已保存')
  })
})

// xml文件模版 => json文件 (等同与ast树)
// 遍历json文件 => 生成渲染函数
// vuejs 计算各个属性 生成一整套数据 每个模块导出 数据集、渲染后的xml文本
// 在loaderjs文件中完成所有的视图并导出到指定的目录
