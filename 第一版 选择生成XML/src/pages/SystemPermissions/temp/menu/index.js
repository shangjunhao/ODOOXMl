import tools from "../../utils/tools";

const menuTemp = `<menuitem id="{{id}}" name="{{name}}"  {{action}} {{parent}} groups="{{groups}}" sequence="{{sequence}}" />`;

const menuInput = function (result = {}) {
	let list = [
		{
			type: "text",
			label: "菜单位置",
			value: "",
			result: "",
			dataType: "sequence",

			multiple: false,
			listData: [],
			placeholder: "菜单位置"
		},
		{
			type: "select",
			label: "所属分组",
			value: [],
			result: [],
			dataType: "groups",

			multiple: true,
			listData: result.groups,
			placeholder: "所属分组"
		},
		{
			type: "select",
			label: "父级菜单",
			value: "",
			result: {},
			dataType: "parent",

			multiple: false,
			listData: result.menus,
			placeholder: "父级菜单"
		},

		/*{
			type: "text",
			label: "菜单名称",
			value: "",
			result: "",
			dataType: "name",

			multiple: false,
			listData: [],
			placeholder: "菜单名称"
		},
				{
			type: "select",
			label: "主要模型",
			value: "",
			result: {},
			dataType: "model",

			multiple: false,
			listData: result.models,
			placeholder: "主要模型"
		},
		*/
	];
	return list;
};


const convertParent = function (options) {
	if (options.parent) {
		let parent = options.parent.name;
		return `parent="${parent}"`;
	}
	return "";
};

const convertAction = function (options) {
	if (options.parent) {
		let action = options.action;
		return `action="${action}"`;
	}
	return "";
};

const convertGroups = function (options) {
	return options.groups.map(item => {
		return item.name;
	}).join(',');
};

const normalizeOpt = function (options) {
	// sequence, model, parent, groups
	tools.convertModel(options.model);
	return {
		id: tools.convertId(options, 'menu'),
		name: tools.convertName(options, 'menu'),
		parent: convertParent(options),
		groups: convertGroups(options),
		action: convertAction(options),
		sequence: options.sequence,
	};
};

export default () => {
	return {
		name: "menu",
		tpl(options) {
			return tools.renderTpl(menuTemp, options, normalizeOpt);
		},
		normalizeOpt,
		inputs: menuInput,
	};
};