import tools from "../../utils/tools";

let fieldsInputs = function(result = {}) {
	// views 视图模版
	let list = [{
		type: "transfer",
		label: "主要字段",
		value: [],
		result: [],
		dataType: "fields",

		multiple: true,
		listData: result.models,
		placeholder: "主要字段"
	}, ];
	return list;
};

export default () => {
	return {
		name: "fields",
		tpl(options) {
			console.log(options)
			tools.convertModel(options.model);
			let fields = options.fields.map(item => {
				return {
					"name": item.name,
					"label": item.string,
				};
			});
			let name = options.model._model + '_export_fields';
			return name + ': ' + JSON.stringify(fields);
		},
		inputs: fieldsInputs,
	};
};