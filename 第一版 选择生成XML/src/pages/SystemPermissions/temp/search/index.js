import tools from "../../utils/tools";

const searchTemp = `
<record id="{{id}}" model="ir.ui.view">
    <field name="name">{{name}}</field>
    <field name="model">{{model}}</field>
    <field name="arch" type="xml">
    	<search string="{{string}}">
    		{{fields}}
    		{{filter}}
    		<separator/>
    		{{fieldsGroup}}
    	</search>
    </field>
</record>
`;
//<separator/>
//<filter name="my" string="我的" domain="[('write_uid', '=', uid)]"/>

const searchInput = function (result = {}) {
	let list = [
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
			label: "查询字段",
			value: [],
			result: [],
			dataType: "fields",

			multiple: true,
			listData: result.models,
			placeholder: "查询字段"
		},
		{
			type: "transfer",
			label: "筛选字段",
			value: [],
			result: [],
			dataType: "filter",

			multiple: true,
			listData: result.models,
			placeholder: "筛选字段"
		},
		{
			type: "transfer",
			label: "分组字段",
			value: [],
			result: [],
			dataType: "fieldsGroup",

			multiple: true,
			listData: result.models,
			placeholder: "分组字段"
		},
		// {
		// 	type: "filter",
		// 	label: "筛选条件",
		// 	value: [],
		// 	result: [],
		// 	dataType: "fieldsFilter",
		//
		// 	multiple: true,
		// 	listData: result.models,
		// 	placeholder: "筛选条件"
		// },
	];
	return list;
};

const normalizeOpt = function (options) {
	// model filter
	tools.convertModel(options.model);
	return {
		id: tools.convertId(options, 'search'),
		name: tools.convertName(options, 'search'),
		model: options.model._modelName,
		string: options.model._name,
		fields: tools.makeFields(options),
		filter: tools.makeFilter(options),
		fieldsGroup: tools.makeFieldGroup(options),
	};
};

export default () => {
	return {
		name: "search",
		tpl(options) {
			return tools.renderTpl(searchTemp, options, normalizeOpt);
		},
		normalizeOpt,
		inputs: searchInput,
		template: searchTemp
	};
};