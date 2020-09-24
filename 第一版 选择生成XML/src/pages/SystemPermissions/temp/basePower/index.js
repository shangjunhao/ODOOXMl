import csv from "../csv/index";
import role from "../role/index";
import rule from "../rule/index";
import menu from "../menu/index";

const csvCreate = csv();
const roleCreate = role();
const ruleCreate = rule();
const menuCreat = menu();

let powerInputs = function (result = {}) {
	// power 基础权限体系
	let list = [
		// 分组
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
			label: "引用模型",
			value: "",
			result: "",
			dataType: "models",

			multiple: true,
			listData: result.models,
			placeholder: ""
		},
		/*{
			type: "select",
			label: "关联模型",
			value: [],
			result: [],
			dataType: "children",

			multiple: true,
			listData: result.models,
			placeholder: ""
		},*/
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
	];
	return list;
};

// 管理员
let createPower = (options, opt) => {
	// 分组
	let roleOpt = {
		id: opt.id,
		name: opt.name,
		model: options.model,
		inherits: opt.inherits || [],
	};
	let roleAdminStr = roleCreate.tpl(roleOpt);
	let roleObj = roleCreate.normalizeOpt(roleOpt);

	// 表权限
	let csvOpt = {
		model: [options.model, ...options.models],
		group: {
			name: roleObj.id,
		},
		csv: opt.csv
	};
	let csvAdminStr = csvCreate.tpl(csvOpt);


	return {
		roleObj,
		csvAdminStr,
		roleAdminStr
	};
};

export default () => {
	return {
		name: "basePower",
		tpl(options) {
			let lock = createPower(options, {
				id: 'lock',
				name: '只读',
				csv: [1, 0, 0, 0],
			});
			let edit = createPower(options, {
				id: 'edit',
				name: '编辑',
				csv: [1, 1, 1, 0],
				inherits: [{name: lock.roleObj.id}]
			});
			let admin = createPower(options, {
				id: 'admin',
				name: '管理员',
				csv: [1, 1, 1, 1],
				inherits: [{name: edit.roleObj.id}]
			});


			// 菜单
			let menuOpt = {
				sequence: 8001,
				model: options.model,
				parent: options.parent,
				groups: [
					{name: admin.roleObj.id,},
					{name: edit.roleObj.id,},
					{name: lock.roleObj.id,},
				]
			};
			let menuStr = menuCreat.tpl(menuOpt);
			return [
				lock.roleAdminStr,
				edit.roleAdminStr,
				admin.roleAdminStr,
				'\n\r\n',
				lock.csvAdminStr,
				edit.csvAdminStr,
				admin.csvAdminStr,
				'\n\r\n',
				menuStr
			].join('\n\n');
		},
		inputs: powerInputs,
	};
};

