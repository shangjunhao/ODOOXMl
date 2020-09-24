import tools from "../../utils/tools";

const treeTemp = `
<record id="{{id}}" model="ir.ui.view">
    <field name="name">{{name}}</field>
    <field name="model">{{model}}</field>
    <field name="arch" type="xml">
        <from string="{{string}}" create="1" edit="1" delete="1">
        	<header>
        		<!-- TODO 业务按钮 -->
        		<button name="do_submit_order" string="提交" type="object" attrs="{'invisible': [('states', '!=', 'draft')]}"/>
        		<field name="state" widget="statusbar" statusbar_visible="draft,submit,cancel" readonly="1" />
			</header>
			<sheet>
				<!-- TODO 智能按钮 -->
				<div class="oe_button_box" name="button_box">
                    <button
                            attrs="{'invisible': [('count_delivery','&lt;',1)]}"
                            class="oe_stat_button" name="open_count_delivery" type="object" icon="fa-truck" help="待寄样品">
                        <field string="待寄样品" name="count_delivery" widget="statinfo"/>
                    </button>
                </div>
                <!-- TODO 表单头部 -->
                <div class="oe_title">
                    <h1><field name="name"/></h1>
                </div>
                <!-- TODO 表单字段 -->
                <group>
                	<group>
                		{{fields}}
					</group>
				</group>
				<notebook>
				<!-- TODO 表单明细 -->
					<page string="单据信息">
						<group>
	                        <group>
	                            <field name="create_uid" string="创建人"/>
	                            <field name="write_uid" string="修改人"/>
	                        </group>
	                        <group>
	                            <field name="create_date" string="创建时间"/>
	                            <field name="write_date" string="修改时间"/>
	                        </group>
	                    </group>
					</page>
				</notebook>
			</sheet>
        </from>
    </field>
</record>
`;

const treeInput = function (result = {}) {
	let list = [
		// TODO 编辑、创建、导入等按钮
		/*{
			type: "select",
			label: "主要模型",
			value: "",
			result: {},
			dataType: "model",

			multiple: false,
			listData: result.models,
			placeholder: "主要模型"
		},*/
		{
			type: "text",
			label: "视图标记",
			value: "",
			result: "",
			dataType: "sign",

			multiple: false,
			listData: [],
			placeholder: "视图标记"
		},
		{
			type: "transfer",
			label: "主要字段",
			value: [],
			result: [],
			dataType: "fields",

			multiple: true,
			listData: result.models,
			placeholder: "主要字段"
		},
	];
	return list;
};

const normalizeOpt = function (options) {
	// model transfer
	tools.convertModel(options.model);
	return {
		id: tools.convertId(options, 'form'),
		name: tools.convertName(options, 'form'),
		model: options.model._modelName,
		string: options.model._name,
		fields: tools.makeFields(options),
	};
};

export default () => {
	return {
		name: "tree",
		tpl(options) {
			return tools.renderTpl(treeTemp, options, normalizeOpt);
		},
		normalizeOpt,
		inputs: treeInput,
		template: treeTemp
	};
};