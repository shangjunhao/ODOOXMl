import tools from "../../utils/tools";

const treeTemp = `
<record id="{{id}}" model="ir.ui.view">
    <field name="name">{{name}}</field>
    <field name="model">{{model}}</field>
    <field name="arch" type="xml">
        <tree string="{{string}}" default_order="id asc, name desc" editable="bottom" create="1" edit="1" delete="1">
        	{{fields}}
        </tree>
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
		id: tools.convertId(options, 'tree'),
		name: tools.convertName(options, 'tree'),
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