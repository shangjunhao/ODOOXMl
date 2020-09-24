import tools from "../../utils/tools";

const csvTemp = `{{id}},{{name}},{{model}},{{group}},{{perm_read}},{{perm_write}},{{perm_create}},{{perm_unlink}}`;

const csvInputs = function (result = {}) {
	let list = [
		{
			type: "select",
			label: "主要模型",
			value: [],
			result: [],
			dataType: "model",

			multiple: true,
			listData: result.models,
			placeholder: "主要模型"
		},
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
			type: "checks",
			label: "记录权限",
			value: [],
			result: [],
			dataType: "csv",

			multiple: false,
			listData: [],
			placeholder: "记录权限"
		},
	];
	return list;
};

const normalizeOpt = function (options) {
	// model, group, csv[power]
	tools.convertModel(options.model);
	return {
		id: tools.convertId(options, 'csv'),
		name: tools.convertName(options, 'csv'),
		model: options.model._fullName,
		group: options.group.name,
		perm_read: options.csv[0],
		perm_write: options.csv[1],
		perm_create: options.csv[2],
		perm_unlink: options.csv[3],
	};
};

export default () => {
	return {
		name: "csv",
		tpl(options) {
			if (Array.isArray(options.model)) {
				if (options.model.length === 1) {
					options.model = options.model[0];
					return tools.renderTpl(csvTemp, options, normalizeOpt);
				} else {
					let models = [...options.model], codes = [];
					codes = models.map((item) => {
						options.model = item;
						return tools.renderTpl(csvTemp, options, normalizeOpt);
					});
					return codes.join('\n');
				}
			} else if (typeof options.model === 'string') {
				return tools.renderTpl(csvTemp, options, normalizeOpt);
			} else {
				return tools.renderTpl(csvTemp, options, normalizeOpt);
			}
			// return tools.renderTpl(csvTemp, options, normalizeOpt);
		},
		normalizeOpt,
		inputs: csvInputs,
	};
};