<template>
    <div class="SystemPermissions">
        <header class="header">
            <div class="header-item">
                所在模型:
                <span class="label"></span>
                <Select
                        filterable
                        v-model="exportModel"
                        style="width:130px"
                        @on-change="setMainModel"
                >
                    <Option v-for="(item, ind) in result.models" :value="ind" :key="ind">
                        {{ item.display_name + item['complete_name'] }}
                    </Option>
                </Select>
            </div>
            <div class="header-item">
                导出目标:
                <span class="label"></span>
                <Select
                        v-model="exportType"
                        style="width:130px"
                        @on-change="createForm"
                >
                    <Option v-for="(item, ind) in types" :value="ind" :key="item.key">{{
                        item.label
                        }}
                    </Option>
                </Select>
            </div>
            <div class="header-item">
                <Button type="primary" @click="createView">添加</Button>
            </div>
            <div class="header-item">
                <Button type="primary" @click="">清空</Button>
            </div>
            <div class="header-item">
                <Button type="primary" @click="copyLatestCode">复制最新</Button>
            </div>
            <!--<div class="header-item">
                <Button type="primary" @click="">保存</Button>
            </div>
            <div class="header-item">
                <Button type="primary" @click="">导入</Button>
            </div>
            <div class="header-item">
                <Button type="primary" @click="">导出</Button>
            </div>
            <div class="header-item">
                <Button type="primary" @click="createView">生成模版视图</Button>
            </div>
            <div class="header-item">
                <Button type="primary" @click="">生成关联权限</Button>
            </div>-->
        </header>
        <section class="content">
            <section class="toolbar">
                <div class="toolbar-list">
                    <Form-power
                            v-for="(item, ind) in formInline"
                            :ref="'formInput-' + ind"
                            :key="ind"
                            :ind="ind"
                            :item="item"
                            :result="result"
                            :modelInfo="modelInfo"
                            :modelFields="modelFields"
                    ></Form-power>
                </div>
                <div class="toolbar-footer" style="display: none;"></div>
            </section>
            <section class="views">
                <div class="view code" v-highlight>
                    <pre><code v-text="views.join('\n')"></code></pre>
                </div>
                <!--<Collapse v-model="Panel" accordion>
                    <Panel name="1">
                        参数列表
                        <div slot="content">
                            <div class="view param">
                                <div v-for="(item,key) in dataList" :key="key">
                                {{item}}
                                <Divider/>
                                </div>
                            </div>
                        </div>
                    </Panel>
                    <Panel name="2">
                        字段列表
                        <div slot="content">
                            <div class="view field">
                                <div v-for="(item,key) in paramList" :key="key">
                                {{item}}
                                <Divider/>
                                </div>
                            </div>
                        </div>
                    </Panel>
                    <Panel name="3">
                        代码视图
                        <div slot="content">
                            <div class="view code" v-highlight>
                                <pre><code v-text="views.join('\n')"></code></pre>
                            </div>
                        </div>
                    </Panel>
                </Collapse>-->
            </section>
        </section>
        <footer class="footer">
            <!--<Input ref="views" v-model="views" style="display: none;" placeholder="复制用"/>-->
        </footer>
    </div>
</template>

<script>
	// 后期把模型提取出来
	// 完善权限体系 默认自动生成三套权限
	// 完善视图体系 自动生成列表、搜索、动作、菜单视图
	// 完善条件体系 根据模型和字段等生成对应的过滤条件

    // 按钮、动作、智能按钮、导出字段等完善
    // 权限中的自定义模式
    // 各个视图的多视图
	import tools from "./utils/tools";
	import init, {getFields} from "./data/base";

	import types from "./core/index";
	import formInput from "./fromInput";

	export default {
		name: "SystemPermissions",
		components: {
			"Form-power": formInput
		},
		data() {
			return {
				Panel: "3",
				// 导出类型
				types: types.exportTypes,
				exportType: "",
				exportRule: "",

				// 所在模型
				modelInfo: {},
				exportModel: "",
                modelFields: [],

				// 基础数据
				result: {},

				// 代码
				code: '',
				views: [],

				// 表单
				formInline: []
			};
		},
		methods: {
			init() {
				// 数据准备
				init(result => {
					let model = Number(localStorage.getItem('exportModel'));
					this.result = result;
					this.exportModel = model || 0;
				    this.setMainModel(this.exportModel);
				});

			},
			createForm(ind) {
				// 生成表单视图
				// 生成表单前判断是否需要主模型和主模型是否有值，然后传入 inputs 计算函数
				let form = this.types[ind];
				if (!this.exportModel) return this.$Message.warning("请先选择主模型");
				this.formInline = form.render.inputs(this.result, this.modelInfo);
				localStorage.setItem('exportModel', this.exportModel);
			},
			createView() {
				// 获取数据 - 判断是否使用内置 - 生成对应字符串
				let options = {};
				let type = this.types[this.exportType];
				let rule = type.rules[this.exportRule];
				this.formInline.map((val, ind) => {
					// 获取表单数据
					let key = "formInput-" + ind;
					let item = this.$refs[key][0].getData();
					options[item.dataType] = item.result;
				});
				// 主模型
                if (!options.model && this.modelInfo) {
                	options.model = this.modelInfo;
                }
				// 渲染数据
				let code = type.render.tpl(options);
				// 数据备份
				this.code = code;
				// 数据展示
				this.views.unshift('最新⬆️');
				this.views.unshift(code);
				this.views = Array.from(new Set(this.views));
				return;
				// todo
				if (this.exportRule && rule) {
					// 内置规则
					options = rule.trim(options);
					this.views = type.render.tpl(options);
				} else {
					// 自定义规则
					this.views = type.render.tpl(options);
				}
			},
			setMainModel(ind) {
				// 计算模型
				console.log(arguments);
				let model = this.result.models[ind];
				this.modelInfo = tools.convertModel(model);
				this.getBaseFields();
			},
			copyLatestCode() {
				// 复制最新代码
                this.copyText(this.code, () => {
                	this.$Message.info('复制成功!');
                });
			},
            /** Post **/
            getBaseFields() {
				// 获取模型相关——字段
				if (!this.modelInfo) return;
				getFields(this.modelInfo._modelName).then(res => {
					this.modelFields = res.records.map((item, ind) => {
						item.key = ind;
						return item;
					});
				});
            },
            /** Methods */
			copyText(text, callback) { // text: 要复制的内容， callback: 回调
				let tag = document.createElement('input');
				tag.setAttribute('id', 'cp_hgz_input');
				tag.value = text;
				document.getElementsByTagName('body')[0].appendChild(tag);
				document.getElementById('cp_hgz_input').select();
				document.execCommand('copy');
				document.getElementById('cp_hgz_input').remove();
				if (callback) {
					callback(text)
				}
			},
		},
		mounted() {
			this.init();
		}
	};
</script>

<style scoped lang="scss">
    $bg-color: #ffffff;
    $font-color: #000000;
    $border-color: #363636;

    .SystemPermissions {
        display: flex;
        flex-flow: column;
        color: $font-color;
        background-color: $bg-color;

        .header {
            display: flex;
            height: 50px;
            padding: 0 15px;
            align-items: center;
            border-bottom: 1px solid $border-color;

            .header-item {
                margin-right: 10px;
            }
        }

        .content {
            flex: 1;
            display: flex;

            .toolbar {
                display: flex;
                flex-flow: column;
                /*width: 520px;*/
                min-width: 520px;
                max-width: 66%;
                padding: 15px 0 0;
                border-right: 1px solid $border-color;

                .toolbar-footer {
                    display: flex;
                    height: 50px;
                    align-items: center;
                    justify-content: center;
                    border-top: 1px solid $border-color;

                    button {
                        margin: 0 5px;
                        cursor: pointer;
                    }
                }
            }

            .views {
                flex: 1;
                padding: 16px;
                overflow: scroll;
                text-align: left;

                .view {
                    max-height: 1200px;
                    overflow-y: scroll;
                }
            }
        }
    }
</style>
<style lang="scss">
    .toolbar-list {
        flex: 1;
        overflow-y: auto;

        .toolbar-item {
            display: flex;
            margin-bottom: 10px;
            padding: 0 15px 6px;
            align-items: center;
            justify-content: center;

            .label {
                width: 100px;
                font-size: 16px;
                text-align: left;
                padding-right: 10px;
            }

            .form-box {
                flex: 1;
                text-align: left;

                &.div {
                    width: 100%;
                }
            }
        }
    }
</style>
