import tools from "../../utils/tools";

const ruleTemp = `
<record model="ir.rule" id="{{id}}">
    <field name="name">{{name}}</field>
    <field name="model_id" ref="{{model_id}}"/>
    <field name="global" eval="{{global}}"/>
    <field name="groups" eval="{{groups}}"/>
    <field name="domain_force">{{domain_force}}</field>
    <field name="perm_read" eval="{{perm_read}}" />
    <field name="perm_write" eval="{{perm_write}}" />
    <field name="perm_create" eval="{{perm_create}}" />
    <field name="perm_unlink" eval="{{perm_unlink}}" />
</record>
`;

const ruleInputs = function (result = {}) {
	let list = [
		{
			type: "text",
			label: "记录说明",
			value: "",
			result: "",
			dataType: "name",

			multiple: false,
			listData: [],
			placeholder: "记录说明"
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
			label: "关联分组",
			value: [],
			result: [],
			dataType: "groups",

			multiple: true,
			listData: result.groups,
			placeholder: "关联分组"
		},
		{
			type: "text",
			label: "过滤条件",
			value: "",
			result: "",
			dataType: "domain",

			multiple: false,
			listData: [],
			placeholder: "过滤条件"
		},
		{
			type: "checks",
			label: "记录权限",
			value: [],
			result: [],
			dataType: "rule",

			multiple: false,
			listData: [],
			placeholder: "记录权限"
		},
	];
	return list;
};

const convertId = function (options) {
	let id = "";
	let ids = ["r", "w", "c", "u", "not"];
	let i = 0,
		length = options.rule.length;
	for (; i < length; i++) {
		if (options.rule[i]) {
			id += ids[i];
		}
	}
	id = id || ids[4];
	return "rule_" + options.model._whole + "_" + id;
};

const convertName = function (options) {
	let name = "";
	let names = ["读", "写", "创", "删", "无权"];
	let i = 0,
		length = options.rule.length;
	for (; i < length; i++) {
		if (options.rule[i]) {
			name += names[i];
		}
	}
	name = name || names[4];
	return options.name ? options.name : (options.model._whole + name);
};

const normalizeOpt = function (options) {
	// model, groups, domain, rule[power], | global, id, name
	console.log('rule:', options);
	options.model = tools.convertModel(options.model);
	return {
		id: options.id || convertId(options),
		name: options.name || convertName(options),
		model_id: options.model._whole,
		global: options.global ? "True" : "False",
		groups: tools.makeRel(options.groups),
		domain_force: options.domain,
		perm_read: options.rule[0],
		perm_write: options.rule[1],
		perm_create: options.rule[2],
		perm_unlink: options.rule[3]
	};
};

export default () => {
	return {
		name: "rule",
		tpl(options) {
			return tools.renderTpl(ruleTemp, options, normalizeOpt);
		},
		normalizeOpt,
		inputs: ruleInputs,
		template: ruleTemp,
	};
};
