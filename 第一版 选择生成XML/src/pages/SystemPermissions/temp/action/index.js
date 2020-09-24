import tools from "../../utils/tools";

const actionTemp = `
<record id="{{id}}" model="ir.actions.act_window">
    <field name="name">{{name}}</field>
    <field name="res_model">{{res_model}}</field>
    <field name="view_mode">{{view_mode}}</field>
    <field name="search_view_id" ref="{{search_view_id}}"/>
    <field name="context">{}</field>
    <field name="domain">[]</field>
    <field name="view_ids" eval="[(5, 0, 0),
           (0, 0, {'view_mode': 'tree', 'view_id': ref('{{view_id}}')})
    ]"/>
</record>
`;

const actionInput = function (result = {}) {
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
			label: "视图类型",
			value: [],
			result: [],
			dataType: "view_mode",

			multiple: true,
			listData: ['tree', 'form', 'kanban'],
			placeholder: "视图类型"
		},
	];
	return list;
};

const normalizeOpt = function (options) {
	// model views
	tools.convertModel(options.model);
	return {
		id: tools.convertId(options, 'action'),
		name: tools.convertName(options, 'action'),
		res_model: options.model._modelName,
		view_mode: options['view_mode'].join(',') || 'tree,form',
		view_id: options.view_id || (options.model._model + '_tree'),
		search_view_id: options.search_view_id || (options.model._model + '_search'),
		domain: tools.convertDomain(options),
	};
};

export default () => {
	return {
		name: "action",
		tpl(options) {
			return tools.renderTpl(actionTemp, options, normalizeOpt);
		},
		normalizeOpt,
		inputs: actionInput,
	};
};