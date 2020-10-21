export default `
<odoo>
<data>
  <!-- tree -->
  <record :id="tree.id" model="ir.ui.view">
    <field name="name">{{ tree.name }}</field>
    <field name="model">{{ model._modelName }}</field>
    <field name="arch" type="xml">
      <tree
        :string="tree.name"
        :create="tree.create"
        :edit="tree.edit"
        :delete="tree.del"
        :default_order="tree.order"
        v-attrs="tree.attrs"
      >
        <field v-for="item in tree.fields" :name="item._key" v-attrs="item.attrs"></field>
      </tree>
    </field>
  </record>

  <!-- search -->
  <record :id="search.id" model="ir.ui.view">
    <field name="name">{{ search.name }}</field>
    <field name="model">{{ model._modelName }}</field>
    <field name="arch" type="xml">
      <search :string="search.name">
        <field v-for="item in search.fields" :name="item._key" v-attrs="item.attrs"></field>
        <separator/>
        <filter v-for="item in search.filters" :name="item._key" v-attrs="item.attrs"></filter>
        <group expand="1" string="分组">
          <filter v-for="item in search.groups" v-attrs="item.attrs"></filter>
        </group>
      </search>
    </field>
  </record>
  
  <!-- action -->
  <record :id="action.id" model="ir.actions.act_window">
    <field name="name">{{ action.name }}</field>
    <field name="domain">{{ action.domain }}</field>
    <field name="context">{{ action.context }}</field>
    <field name="res_model">{{ model._modelName }}</field>
    <field name="view_mode">{{ action.view_mode }}</field>
    <field
      name="view_ids"
      :eval="action.view_ids"
    ></field>
    <field name="search_view_id" :ref="search.id"></field>
  </record>

  <!-- category -->
  <record v-if="children" :id="model._whole" model="ir.module.category">
    <field name="name">{{ category.name }}</field>
    <field name="description">{{ category.description }}</field>
  </record>

  <!-- groups group.name -->
  <record v-if="children" v-for="group in category.groups" :id="group.id" model="res.groups">
    <field name="name">{{ group.name }}</field>
    <field name="category_id" :ref="model._whole"></field>
    <field name="implied_ids" :eval="group.eval"></field>
  </record>

  <!-- menu -->
  <record :id="menu.id" model="ir.actions.act_window">
    <field name="name">{{ menu.name }}</field>
    <field name="action">{{ action.id }}</field>
    <field name="parent">{{ menu.parent }}</field>
    <field name="groups">{{ menu.groups }}</field>
    <field name="sequence">{{ menu.sequence }}</field>
  </record>

  <!-- menu action -->
  <record v-for="server in business" :id="server.id" model="ir.actions.server">
    <field name="name">{{ server.explain }}</field>
    <field name="domain">{{ server.domain }}</field>
    <field name="model_id" :ref="model._fullName" />
    <field name="binding_model_id" :ref="model._fullName" />
    <field name="state">code</field>
    <field name="code">{{ server.code }}</field>
  </record>

  <!-- end -->
</data>
</odoo>
`
