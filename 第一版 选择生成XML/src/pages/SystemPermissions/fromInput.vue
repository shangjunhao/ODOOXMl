<template>
    <div class="toolbar-item">

        <template v-if="item.type === 'text'">
            <span class="label">{{ item.label }}:</span>
            <div class="form-box">
                <Input v-model="item.value" :placeholder="item.placeholder"/>
            </div>
        </template>

        <template v-else-if="item.type === 'select'">
            <span class="label">{{ item.label }}:</span>
            <div class="form-box">
                <Select
                        v-model="item.value"
                        filterable
                        clearable
                        :multiple="item.multiple"
                        :max-tag-count="0"
                >
                    <OptionGroup label="Main">
                        <Option
                                v-for="(model, index) in item['listData']"
                                :value="index"
                                :key="index"
                        >{{ model.display_name ? (model.display_name + model['complete_name']) : model }}
                        </Option>
                    </OptionGroup>
                </Select>
            </div>
        </template>

        <template v-else-if="item.type === 'checks'">
            <span class="label">{{ item.label }}:</span>
            <Checkbox
                    style="margin-right: 12px;"
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    @click.prevent.native="handleCheckAll"
            ></Checkbox>
            <div class="form-box">
                <CheckboxGroup v-model="item.value" @on-change="checkAllGroupChange">
                    <Checkbox label="perm_read">读取</Checkbox>
                    <Checkbox label="perm_write">修改</Checkbox>
                    <Checkbox label="perm_create">创建</Checkbox>
                    <Checkbox label="perm_unlink">删除</Checkbox>
                </CheckboxGroup>
            </div>
        </template>

        <template v-else-if="item.type === 'view_id'">
            <span class="label">{{ item.label }}:</span>
            <div class="form-box">
                <RadioGroup v-model="item.value">
                    <Radio v-for="(view, index) in item['listData']" :key="index" :label="view.name"></Radio>
                </RadioGroup>
            </div>
        </template>

        <template v-else-if="item.type === 'domain'">
            // 待定
            <span class="label">{{ item.label }}:</span>
            <div class="form-box">
                <Select
                        v-model="field"
                        filterable
                        clearable
                        :multiple="false"
                        :max-tag-count="0"
                >
                    <OptionGroup label="Main">
                        <Option
                                v-for="(model, index) in modelFields"
                                :value="index"
                                :key="index"
                        >{{ model.display_name + model['complete_name'] }}
                        </Option>
                    </OptionGroup>
                </Select>
            </div>
        </template>

        <template v-else-if="item.type === 'transfer'">
            <!-- 字段 穿梭框 -->
            <div class="form-box">
                <span class="label">{{ item.label }}:</span>
                <div style="height: 10px;"></div>
                <Transfer
                        :data="modelFields"
                        :target-keys="fieldsKeys"
                        :render-format="fieldRender"
                        filterable
                        :filter-method="filterMethod"
                        @on-change="fieldsChange"></Transfer>
            </div>
        </template>

        <template v-else-if="item.type === 'filter'">
            // 待定
            <div class="form-box">
                <span class="label">{{ item.label }}:</span>
                <div style="height: 10px;"></div>
                <Input v-model="domainName" :placeholder="'自定义字段name'"/>
                <div style="height: 10px;"></div>
                <Input v-model="domainString" :placeholder="'自定义字段string'"/>
                <div style="height: 10px;"></div>
                <Select
                        ref="fieldInput"
                        v-model="domainField"
                        filterable
                        clearable
                        :multiple="false"
                        :max-tag-count="0"
                >
                    <OptionGroup label="Select Field">
                        <Option
                                v-for="(model, index) in modelFields"
                                :value="index"
                                :key="index"
                        >{{ model['field_description'] + model.name }}
                        </Option>
                    </OptionGroup>
                </Select>
                <Select
                        ref="termInput"
                        v-model="domainTerm"
                        filterable
                        clearable
                        :multiple="false"
                        :max-tag-count="0"
                >
                    <OptionGroup label="Select Field">
                        <Option
                                v-for="(model, index) in domainTerm"
                                :value="index"
                                :key="index"
                        >{{ model.label }}
                        </Option>
                    </OptionGroup>
                </Select>
                <Input v-model="domainVal" :placeholder="'自定义字段val'"/>
                <div style="height: 10px;"></div>
                <Button type="primary" @click="">添加</Button>
                <div style="height: 10px;"></div>
                <Tag type="dot" closable color="primary" v-for="(item,ind) in fieldResult" :key="ind"
                     @on-close="">{{item.string + ' ' + item.name}}
                </Tag>
            </div>
        </template>

        <template v-else-if="item.type === 'tableViews'">
            <!-- 字段 表格 -->
            <E-table
                    :list="dataList"
                    :showPage="false"
                    :setHeight="500"
                    :initColumns="initColumns"
            ></E-table>
        </template>


    </div>
</template>

<script>
	/**
	 * 角色权限表单
	 * {
	 *     type: '', // text select checks domain field
	 *     label: '',
	 *     value: null, // 表单
	 *     result: null, // 结果
	 *     dataType: str, // 表单类型
	 *     default: null,
	 *     multiple: false,
	 *     listData: [{}],
	 *     placeholder: '',
	 * }
	 * */
	import tools from "./utils/tools";
	import init, {getFields} from "./data/base";

	export default {
		name: "formInput",
		props: ["item", "ind", "modelInfo", "modelFields", "result"],
		data() {
			return {
				checkAll: true,
				indeterminate: false,

				// 字段集合 - 表单内选模型
				// model: 0, // 选中模型？
				// string: '', // 自定义名称
				// modelFields: [], // 基础数据集

				// 字段集合 -
				field: '', // 选中字段下标
				fieldsKeys: [], // keys
				fieldResult: [], // data

				// domain
				domainVal: '', // 过滤值
				domainTerm: '', // 过滤条件
				domainField: '', // 过滤字段
				domainName: '', // domain name
				domainString: '', // domain String
				domainTerm: [
					{
						term: '>',
						label: '大于',
					},
				],

				// 字段集合 - 表格内视图
				dataList: [],
				initColumns: [
					{
						width: 150,
						key: "name",
						title: "字段",
						uiType: "text"
					},
					{
                        width: 150,
						key: "field_description",
						title: "说明",
						uiType: "text"
					},
					{
						width: 100,
						title: '列表',
						key: 'tree',
						align: 'center',
						render: (h, params) => {
							return this.getTableButton(h, params, 'tree')
						}
					},
                    {
						width: 100,
						title: '只读',
						key: 'readonly',
						align: 'center',
						render: (h, params) => {
							return this.getTableButton(h, params, 'readonly', !params.row['_tree'])
						}
					},
                    {
						width: 100,
						title: '必须',
						key: 'required',
						align: 'center',
						render: (h, params) => {
							return this.getTableButton(h, params, 'required', !params.row['_tree'])
						}
					},
					{
						width: 100,
						title: '搜索',
						key: 'search',
						align: 'center',
						render: (h, params) => {
							return this.getTableButton(h, params, 'search', !params.row.store)
						}
					},
                    {
                    	width: 100,
						title: '筛选',
						key: 'filter',
						align: 'center',
						render: (h, params) => {
							return this.getTableButton(h, params, 'filter', !params.row.store)
						}
					},
					{
						width: 100,
						title: '分组',
						key: 'groups',
						align: 'center',
						render: (h, params) => {
							return this.getTableButton(h, params, 'groups', !params.row.store)
						}
					},
					{
						width: 100,
						title: '导出',
						key: 'exports',
						align: 'center',
						render: (h, params) => {
							return this.getTableButton(h, params, 'exports')
						}
					},
                    {
                    	width: 100,
						title: '不导入（待）',
						key: 'imports',
						align: 'center',
						render: (h, params) => {
							return this.getTableButton(h, params, 'imports', !params.row['_exports'])
						}
					},
				]
			};
		},
		mounted() {
			this.init();
			this.dataList = this.modelFields;
		},
		watch: {
			modelInfo(newVal, oldVal) {
				console.log(arguments);
			},
		},
		methods: {
			init() {
				this.initData();
				this.getMemoryForm();
			},
			getData() {
				// 不应该在子组件更改 props
				let item = this.item;
				let newItem = JSON.parse(JSON.stringify(item));
				// 备份数据
				localStorage.setItem(item.dataType, JSON.stringify(item.value));
				switch (item.type) {
					case "text":
						this.getTextData(newItem);
						break;
					case "select":
						this.getSelectData(newItem);
						break;
					case "checks":
						this.getChecks(newItem);
						break;
					case "transfer":
						this.getFields(newItem);
						break;
                    case "tableViews":
						this.getTableViews(newItem);
						break;
					default:
						break;
				}
				return newItem;
			},
			setData() {
				// 设置
			},
			initData() {
				// 数据初始化
				// this.getBaseFields();
			},
			getBaseFields() {
				// 获取模型相关——字段
				if (!this.modelInfo) return;
				getFields(this.modelInfo._modelName).then(res => {
					// this.fields = res.records;
					this.fields = res.records.map((item, ind) => {
						item.key = ind;
						return item;
					});
				});
			},
			getMemoryForm() {
				// 读取数据
				let type = this.item.dataType;
				let value = JSON.parse(localStorage.getItem(type));
				if (typeof value === "string") value = value.replace(/\"/g, '');
				value && this.$parent.$set(this.$parent.formInline[this.ind], 'value', value);
			},

			// text
			getTextData(newItem) {
				// text 类型表单值
				newItem.result = newItem.value;
			},
			// select
			getSelectData(newItem) {
				// select 类型表单值
				if (newItem.multiple) {
					if (Array.isArray(newItem.value)) {
						newItem.result = newItem.value.map(ind => {
							let list = newItem["listData"];
							if (list && list[ind]) {
								return list[ind];
							} else {
								console.error("超出下标" + ind);
							}
						});
					} else {
						console.error("TypeError: is not Array");
					}
				} else {
					if (newItem.value && newItem["listData"][newItem.value]) {
						newItem.result = newItem["listData"][newItem.value];
					}
				}
			},
			// checks
			getChecks(newItem) {
				// checks 类型表单值
				let powers = ["perm_read", "perm_write", "perm_create", "perm_unlink"];
				newItem.result = powers.map(val => {
					return newItem.value.indexOf(val) > -1 ? 1 : 0;
				});
			},
			handleCheckAll() {
				// 全选/取消全选
				if (this.indeterminate) {
					this.checkAll = false;
				} else {
					this.checkAll = !this.checkAll;
				}
				this.indeterminate = false;

				if (this.checkAll) {
					this.item.value = [
						"perm_read",
						"perm_write",
						"perm_create",
						"perm_unlink"
					];
				} else {
					this.item.value = [];
				}
			},
			checkAllGroupChange(data) {
				// 选中全部
				if (data.length === 4) {
					this.indeterminate = false;
					this.checkAll = true;
				} else if (data.length > 0) {
					this.indeterminate = true;
					this.checkAll = false;
				} else {
					this.indeterminate = false;
					this.checkAll = false;
				}
			},
			// fields
			getFields(newItem) {
				// fields 类型表单值
				newItem.result = this.fieldResult;
			},
			// fields - 穿梭框
			filterMethod(data, query) {
				// 搜索
				if (!query) return true;
				return (data.name.indexOf(query) > -1) ||
					(data['field_description'].indexOf(query) > -1);
			},
			fieldsChange(newTargetKeys) {
				// 变动 .reverse()
				console.log(newTargetKeys);
				this.fieldsKeys = newTargetKeys;
				let keys = [...newTargetKeys].reverse();
				this.fieldResult = keys.map(key => {
					let item = this.modelFields[key];
					return {
						...item,
						string: item['field_description'],
					};
				});
			},
			fieldRender(item) {
				// 渲染
				return item['field_description'] + ' ' + item.name;
			},
			// tableViews - 视图基础
			getTableButton(h, params, key, disabled) {
				key = this.getTableKey(key);
				let val = params.row[key];
				let text = val ? '是' : '否';
				let type = val ? 'success' : 'default';
				return h('div', [
					h('Button', {
						props: {
							type: type,
							long: 'long',
							size: 'large',
                            disabled: disabled
						},
						style: {
							marginRight: '5px'
						},
						on: {
							click: () => {
								this.$set(this.dataList[params.index], key, !val);
							}
						}
					}, text),
				]);
			},
            getTableKey(key) {
				return '_' + key;
            },
            getTableViews(newItem) {
				let keys = ['tree', 'search', 'filter', 'groups', 'exports'];
				keys.map(key => {
					newItem['result'][key] = this.getTableData(this.dataList, key);
                });
				return newItem;
            },
            getTableData(arr, key) {
				let result = [];
				let i = 0, len = arr.length;
				key = this.getTableKey(key);
				for(; i<len; i++) {
					let item = arr[i];
					if (item[key]) {
						item.string = item['field_description'];
                        result.push(item);
                    }
                }
				return result;
            },


			/*modelChange(ind) {
				if (ind !== 0 && !ind) return;
				let model = this.item['listData'][ind];
				model = tools.convertModel(model);
				getFields(model._modelName).then(res => {
					console.log(ind, res, name, model);
					this.fields =getTableViews res.records;
					// TODO fields two
                    this.fieldsKeys = [];
                    this.fieldResult = [];
                    this.fields = res.records.map((item, ind) => {
                    	item.key = ind;
                    	return item;
                    });
				});
			},
			addOneField() {
				let field = this.fields[this.field];
				this.fieldResult.push({
					name: field.name,
					string: this.string || field['field_description'],
				});
				this.string = '';
				this.$refs['fieldInput'].clearSingleSelect();
			},
			removeField(ind) {
				console.log(ind);
				this.fieldResult.splice(ind, 1);
			},*/

		}
	};
</script>

<style scoped></style>
