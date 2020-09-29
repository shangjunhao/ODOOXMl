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
<record id="delivery_order_search" model="ir.ui.view">
    <field name="name">出运要求搜索</field>
    <field name="model">delivery.order</field>
    <field name="arch" type="xml">
        <search string="出运要求">
            <!-- 集装箱号 -->
            <field name="container_num"/>
            <!-- 船务经办 -->
            <field name="vessl_operator"/>
            <separator/>
            <filter name="date_ATD" string="实际船期" date="ATD"/>
            <separator/>
            <filter name="pack_status_draft" string="包装状态-草拟" domain="[('pack_status', '=', 'draft')]"/>
            <filter name="pack_status_submit" string="包装状态-提交" domain="[('pack_status', '=', 'submit')]"/>
            <filter name="pack_status_confirm" string="包装状态-确认" domain="[('pack_status', '=', 'confirm')]"/>
            <separator/>
            <filter name="undelivered_all_cnt_1" string="待出数量 > 0" domain="[('undelivered_all_cnt', '>', 0)]"/>
            <filter name="undelivered_all_cnt_0" string="待出数量 = 0" domain="[('undelivered_all_cnt', '=', 0)]"/>
            <separator/>
            <group expand="1" string="分组">
                <filter name="group_customer_id" string="客户" context="{'group_by':'customer_id'}"/>
                <filter name="group_loading_port" string="出运港" context="{'group_by':'loading_port'}"/>
            </group>
        </search>
    </field>
</record>
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
