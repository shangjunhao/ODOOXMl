import tools from "../../utils/tools";

const roleTemp = `
<record id="{{id}}" model="res.groups">
    <field name="name">{{name}}</field>
    <field name="category_id" ref="{{category_id}}"/>
    <field name="implied_ids" eval="{{group_inherits}}"/>
</record>`;

const roleInputs = function (result = {}) {
	let list = [
		{
			type: "text",
			label: "分组ID",
			value: "",
			result: "",
			dataType: "id",

			multiple: false,
			listData: [],
			placeholder: ""
		},
		{
			type: "text",
			label: "分组名称",
			value: "",
			result: "",
			dataType: "name",

			multiple: false,
			listData: [],
			placeholder: ""
		},
		{
			type: "select",
			label: "主要模型",
			value: "",
			result: "",
			dataType: "model",

			multiple: false,
			listData: result.models,
			placeholder: "主要模型"
		},
		{
			type: "select",
			label: "继承分组",
			value: [],
			result: [],
			dataType: "inherits",

			multiple: true,
			listData: result.groups,
			placeholder: ""
		},
	];
	return list;
};

const normalizeOpt = function (options) {
	// id, name, model, inherits | category
	options.model = tools.convertModel(options.model);
	return {
		id: tools.convertId(options, 'role'),
		name: options.name,
		category_id: options.category || options.model._category,
		group_inherits: tools.makeRel(options.inherits),
	};
};

export default () => {
	return {
		name: "role",
		tpl(options) {
			return tools.renderTpl(roleTemp, options, normalizeOpt);
		},
		normalizeOpt,
		inputs: roleInputs,
		template: roleTemp
	};
};