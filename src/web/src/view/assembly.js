const form = `
<record :id="form.id" model="ir.ui.view">
  <field name="name">{{ form.name }}</field>
  <field name="model">{{ model._modelName }}</field>
  <field name="arch" type="xml">
      <form 
        :string="form.name"
        :create="form.create"
        :edit="form.edit"
        :delete="form.del"
      >
          <header>
            <button 
              v-for="btn in form.btns"
              type="object"
              :name="btn.fn" 
              :string="btn.name" 
              :attrs="btn.attrs"
            />

            <field 
              readonly="1"
              widget="statusbar"
              :name="form.state.name"
              :statusbar_visible="form.state.states"
            />

          </header>
          <sheet>
              <div class="oe_button_box" name="button_box">
                  <button
                    v-for="btn in form.opens"
                    type="object"
                    :name="open.fn"
                    :icon="open.icon"
                    :help="open.help"
                    :attrs="open.attrs" 
                    :string="open.name"
                    class="oe_stat_button"
                  >
                    <field :name="open.field"/>
                  </button>
              </div>
              <div class="oe_title">
                  <h1>
                      <field name="name" readonly="1"/>
                  </h1>
              </div>
              {{ form.fields }}
              <notebook>
                  {{ form.pages }}
                  <page string="单据信息">
                      <group>
                          <group>
                              <field name="create_uid" string="创建人"/>
                              <field name="write_uid" string="修改人"/>
                          </group>
                          <group>
                              <field name="create_date" string="创建时间"/>
                              <field name="write_date" string="修改时间"/>
                          </group>
                      </group>
                  </page>
              </notebook>
          </sheet>
      </form>
  </field>
</record>
`

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
  <record v-for="group in category.groups" :id="group.id" model="res.groups">
    <field name="name">{{ group.name }}</field>
    <field name="category_id" :ref="model._whole"></field>
    <field name="implied_ids" :eval="group.eval"></field>
  </record>

  <!-- menu -->
  <menuitem 
    :id="menu.id" 
    :name="menu.name" 
    :action="action.id"
    :parent="menu.parent" 
    :groups="menu.groups" 
    :sequence="menu.sequence"/>

  <!-- menu action -->
  <record v-for="server in business" :id="server.id" model="ir.actions.server">
    <field name="name">{{ server.explain }}</field>
    <field name="domain">{{ server.domain }}</field>
    <field name="model_id" :ref="model._fullName" />
    <field name="binding_model_id" :ref="model._fullName" />
    <field name="state">code</field>
    <field name="code">{{ server.code }}</field>
  </record>

  <!-- form -->
  ${}

  <!-- end -->
</data>
</odoo>
`
