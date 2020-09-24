import csv from "../temp/csv/index";
import role from "../temp/role/index";
import rule from "../temp/rule/index";
import menu from "../temp/menu/index";
import tree from "../temp/tree/index";
import power from "../temp/power/index";
import search from "../temp/search/index";
import action from "../temp/action/index";
import fields from "../temp/fields/index";
import tableViews from "../temp/views/index";
import basePower from "../temp/basePower/index";

export default {
	exportTypes: [{
		key: "tableViews",
		label: "视图体系",
		rules: [{
			trim() {
			}
		}], // 内置规则
		render: tableViews(),
	}, {
		key: "power",
		label: "权限体系",
		rules: [{
			trim() {
			}
		}], // 内置规则
		render: basePower(),
	}, {
		key: "role",
		label: "角色分组",
		rules: [{
			trim() {
			}
		}], // 内置规则 ok
		render: role(),
	}, {
		key: "rule",
		label: "记录规则",
		rules: [{
			trim() {
			}
		}], // 内置规则 ok
		render: rule(),
	}, {
		key: "csv",
		label: "模型权限",
		rules: [{
			trim() {
			}
		}], // 内置规则 ok
		render: csv(),
	}, {
		key: "tree",
		label: "列表视图",
		rules: [{
			trim() {
			}
		}], // 内置规则 ok
		render: tree(),
	}, {
		key: "search",
		label: "搜索视图",
		rules: [{
			trim() {
			}
		}], // 内置规则 ok
		render: search(),
	}, {
		key: "action",
		label: "动作视图",
		rules: [{
			trim() {
			}
		}], // 内置规则
		render: action(),
	}, {
		key: "menu",
		label: "菜单视图",
		rules: [{
			trim() {
			}
		}], // 内置规则 action
		render: menu(),
	},{
		key: "fields",
		label: "导出字段",
		rules: [{
			trim() {
			}
		}], // 内置规则 action
		render: fields(),
	},],
};