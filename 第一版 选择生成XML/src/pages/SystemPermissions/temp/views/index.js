import csv from "../csv/index";
import role from "../role/index";
import rule from "../rule/index";
import menu from "../menu/index";
import tree from "../tree/index";
import form from "../form/index";
import search from "../search/index";
import action from "../action/index";
import fields from "../fields/index";
import tools from "../../utils/tools";

const treeCreat = tree();
const formCreat = form();
const searchCreat = search();
const actionCreat = action();
const csvCreate = csv();
const roleCreate = role();
const ruleCreate = rule();
const menuCreat = menu();

// TODO 记录规则生成
// TODO From模块生成
// TODO 生成模型并记录对应视图
// TODO 关于生成的顺序、字段


let viewsInputs = function (result = {}) {
	// views 视图模版
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
			type: "select",
			label: "父级菜单",
			value: "",
			result: {},
			dataType: "parent",

			multiple: false,
			listData: result.menus,
			placeholder: "父级菜单"
		},
		{
			type: "tableViews",
			label: "过滤条件",
			value: [],
			result: [],
			dataType: "views",

			multiple: false,
			listData: [],
			placeholder: "视图表格"
		},
	];
	return list;
};

// 管理员、编辑、只读
let createPower = (options, opt) => {
	// 分组
	let roleOpt = {
		id: opt.id,
		name: opt.name,
		model: options.model,
		inherits: opt.inherits || [],
		category: opt.category,
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

// 创建应用集
let createCategory = (options) => {
	let main_name = `module_category_${options.model._model}`;
	let main_category = `
<record id="${main_name}" model="ir.module.category">
    <field name="name">${options.model._name}权限组</field>
    <field name="description">${options.model._name}模块权限设置</field>
</record>`;
	return {
		id: main_name,
		str: main_category
	}
};

export default () => {
	return {
		name: "views",
		tpl(options) {

			let view = options.views;

			// 列表
			let treeOpt = {
				sign: options.sign,
				model: options.model,
				fields: view.tree
			};
			let treeStr = treeCreat.tpl(treeOpt);
			let treeName = treeCreat.normalizeOpt(treeOpt)['id'];

			// 列表
			let formOpt = {
				sign: options.sign,
				model: options.model,
				fields: view.tree
			};
			let formStr = formCreat.tpl(formOpt);
			// let formName = formCreat.normalizeOpt(formOpt)['id'];

			// 搜索
			let searchOpt = {
				sign: options.sign,
				model: options.model,
				fields: view.search,
				filter: view.filter,
				fieldsGroup: view.groups
			};
			let searchStr = searchCreat.tpl(searchOpt);
			let searchName = searchCreat.normalizeOpt(searchOpt)['id'];

			// 动作
			let actionOpt = {
				sign: options.sign,
				model: options.model,
				view_id: treeName,
				view_mode: ['tree'],
				search_view_id: searchName
			};
			let actionStr = actionCreat.tpl(actionOpt);
			let actionObj = actionCreat.normalizeOpt(actionOpt);

			// 导出字段
			let fieldsStr = fields().tpl({
				model: options.model,
				fields: view.exports,
			});

			// 权限 废弃
			// let menu = createPower(options, {
			// 	id: 'menu',
			// 	name: '菜单',
			// 	csv: [1, 0, 0, 0],
			// });

			// 权限 在菜单上挂只读权限、其他权限继承只读 2020.06.16
			let category = createCategory(options);
			let lock = createPower(options, {
				id: 'lock',
				name: `辅助组-${options.model._name}-只读`,
				csv: [1, 0, 0, 0],
				inherits: [],
				category: category.id
			});
			let edit = createPower(options, {
				id: 'edit',
				name: `辅助组-${options.model._name}-编辑`,
				csv: [1, 1, 1, 0],
				inherits: [
					{name: lock.roleObj.id},
				],
				category: category.id
			});
			let admin = createPower(options, {
				id: 'admin',
				name: `辅助组-${options.model._name}-管理员`,
				csv: [1, 1, 1, 1],
				inherits: [
					{name: lock.roleObj.id},
				],
				category: category.id
			});
			// 记录规则
			let ruleOpt = {
				...options,
				name: `记录规则-${options.model._name}-编辑-待定`,
				model: options.model,
				groups: [{
					name: edit.roleObj.id
				}],
				domain: '[]',
				rule: [1, 1, 1, 0]
			};
			let ruleEditStr = ruleCreate.tpl(ruleOpt);

			// 菜单
			let time = (new Date()).getTime();
			let menuOpt = {
				sequence: time,
				model: options.model,
				parent: options.parent,
				action: actionObj.id,
				groups: [
					{name: lock.roleObj.id,},
					// {name: edit.roleObj.id,},
					// {name: lock.roleObj.id,},
					// {name: admin.roleObj.id,},
				]
			};
			let menuStr = menuCreat.tpl(menuOpt);


			return [
				'<!-- tree -->',
				treeStr,
				'<!-- form -->',
				formStr,
				'<!-- search -->',
				searchStr,
				'<!-- action -->',
				actionStr,
				'<!-- menu -->',
				menuStr,
				'\n\r\n',
				'<!-- category -->',
				category.str,
				'\n',
				'<!-- groups -->',
				lock.roleAdminStr,
				edit.roleAdminStr,
				admin.roleAdminStr,
				'\n',
				'<!-- rules -->',
				ruleEditStr,
				'\n\r\n',
				lock.csvAdminStr,
				edit.csvAdminStr,
				admin.csvAdminStr,
				'\n\r\n',
				fieldsStr,
			].join('\n');
		},
		inputs: viewsInputs,
	};
};
