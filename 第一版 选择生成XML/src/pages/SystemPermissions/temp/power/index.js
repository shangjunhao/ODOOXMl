import csv from "../csv/index";
import role from "../role/index";
import rule from "../rule/index";
// import tools from "../../utils/tools";

let powerInputs = function (result = {}) {
	// power 权限体系
	let list = [
		// 分组
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
			label: "继承分组",
			value: [],
			result: [],
			dataType: "inherits",

			multiple: true,
			listData: result.groups,
			placeholder: ""
		},
		// 记录规则
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
		// csv
		{
			type: "select",
			label: "关联分组",
			value: "",
			result: {},
			dataType: "group",

			multiple: false,
			listData: result.groups,
			placeholder: "关联分组"
		},
		{
			type: "select",
			label: "引用模型",
			value: "",
			result: "",
			dataType: "models",

			multiple: true,
			listData: result.models,
			placeholder: ""
		},
		{
			type: "checks",
			label: "模型权限",
			value: [],
			result: [],
			dataType: "modelsCsv",

			multiple: false,
			listData: [],
			placeholder: ""
		},
		{
			type: "select",
			label: "关联模型",
			value: [],
			result: [],
			dataType: "children",

			multiple: true,
			listData: result.models,
			placeholder: ""
		},
		{
			type: "checks",
			label: "模型权限",
			value: [],
			result: [],
			dataType: "childrenCsv",

			multiple: false,
			listData: [],
			placeholder: ""
		},
	];
	return list;
};

export default () => {
	return {
		name: "rule",
		tpl(options) {
			let csvStr = [];
			let roleStr = [];
			let ruleStr = [];
			const csvObj = csv();
			const roleObj = role();
			const ruleObj = rule();

			let group_id = 'group_' + options.model._model + "_" + options.id;

			// TODO 数据校验
			// TODO 权限校验(上下级关系)

			// 分组
			roleStr.push(roleObj.tpl(options));
			// 记录规则
			ruleStr.push(ruleObj.tpl(options));
			// 主模型 csv
			csvStr.push(csvObj.tpl(options));
			// 子模型 csv
			let i = 0, length = options.children.length;
			for (; i < length; i++) {
				let children = options.children[i];
				csvStr.push(csvObj.tpl({
					csv: options['childrenCsv'],
					model: children,
					group: group_id,
				}));
			}
			// 引用模型 csv
			let j = 0, lengthJ = options.models.length;
			for (; j < lengthJ; j++) {
				let children = options.models[j];
				csvStr.push(csvObj.tpl({
					csv: options['modelsCsv'],
					model: children,
					group: group_id,
				}));
			}
			// TODO 数据导出

			return [roleStr.join('\n'), ruleStr.join('\n'), csvStr.join('\n')].join('\n');
		},
		inputs: powerInputs,
	};
};