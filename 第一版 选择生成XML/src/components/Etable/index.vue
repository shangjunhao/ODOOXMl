<template>
    <section class="table-wrapper">
        <Table
                border
                stripe
                :data="data"
                :height="height"
                :loading="loading"
                :columns="columns"
                :highlight-row="highlight"
                class="table-content"
                :row-class-name="rowClassName"
                @on-sort-change="tableSortChange"
                @on-current-change="highlightFun"
                @on-selection-change="selectionChangeFun"
        ></Table>
        <Page
                v-show="!showPage"
                size="small"
                ref="pageJump"
                placement="top"
                class="table-page"
                show-total
                show-sizer
                show-elevator
                :total="total"
                :page-size="rows"
                :page-size-opts="pageSizeOpts"
                @on-change="pageJump"
                @on-page-size-change="pageSizeChange"
        />
        <!--查看大图-->
        <Modal :closable="false" v-model="bigImgState" class-name="big-image-modal">
            <img :src="bigImgUrl" title="点击空白区域关闭" style="max-width: 60%;"/>
        </Modal>
        <!--查看大图-鼠标划过-->
        <div class="container-item">
            <div id="pic" :style="bigImgStyle">
                <img id='pic1' :src="bigImgUrl" title="" />
            </div>
        </div>
    </section>
</template>

<script>
	/**
	 * 表格模块-数据展示
	 * 一、数据类型
	 *  单行文本 多行文本 下拉选项 整数 小数 图片 日期 附件 附件下载 文件上传
	 * 二、结构类型
	 *  正常列表
	 *  左侧固定
	 *  主从列表
	 *
	 * 三、功能类型
	 *  分页
	 *  数据展示
	 *  数据编辑
	 *  数据删除
	 *  功能按钮
	 *  数据勾选
	 *  当前页搜索 pass
	 *  当前页排序 pass
	 *
	 * 四、输入数据
	 *  数据 (可) list []
	 *  数据请求（可）getData Fun
	 *  列配置（必）initColumns []
	 *  表高度（可 默认 500）setHeight Num
	 *  是否显示分页（可 默认 显示）showPage Bol
	 *  初始化排序方式（可 默认 不排序） initSorts []
	 *  是否开启单击选中行（可 默认 关） currentChange(Obj) Fun
	 *  是否开启多选并传入函数 (可 默认 无) selectionChange(Arr) Fun
	 *  设置过滤条件------(可 默认 无)  setFilters Obj //{filters: Arr, groupOp: Str}
	 *
	 *  请求数据的回调函数 (可 默认 无) callback
	 * 五、输出数据、方法
	 *  获取表数据 data []
	 *  初始化页码 pageJump(1) Fun
	 *  清除选中项 clearCurrentRow Fun
	 *  点击排序事件
	 * 六、说明、备注
	 *  11.28号: 除数据请求外添加直接导入数据的方法
	 *  12.11号: 目前数据传入方式 1、传入数据list 2、传入请求函数 getData 3、直接修改数据 this.$refs.组件名.data （1、2选其一 3可公用）
	 *
	 * 七、使用说明书
	 *  :list=Arr (导入型数据不添加分页)
	 *  :setHeight=Num 例：1200
	 *  :getData=Fun 例：$post['函数名']
	 *  :initColumns=Arr 例 [{key(返回数据键),title(表头说明),uiType(内容类型)}] || {type: 'index', width: 60} type可选项: [index(下标), selection(多选), ]
	 *    uiType可选项: [btn, img, date, text, texts, textEdit, selectEdit, numberEdit, decimalEdit]
	 *    注：img 同时传入地址 url
	 *    注：btn 同时传入按钮列表 btnList [ {name, type, event/Fun}, ]
	 *    注：selectEdit 同时传入 下拉ID的键名:id 下拉数据:list
	 * 八、组件扩展思路
	 *  是否添加按钮样式
	 *  是否封装常用按钮操作
	 *  是否预留数据请求后的回调？
	 *  是否考虑将分页条数也变为可配置项？
	 * */
	export default {
		name: "e-table",
		//导入数据 请求地址 是否展示分页 初始化排序方式 表格列配置! 设置过滤条件 单行选中效果触发 多行数据勾选状态
		props: [
			"list",
			"getData",
			"showPage",
			"initSorts",
			"initColumns",
			"setHeight",
			"setFilters",
			"currentChange",
			"selectionChange",
			"callback",
			"rowClassName", // 行样式 fun return str
		],
		data() {
			return {
				//表格状态、参数
				data: [], //表数据
				total: 1, //数据总量
				columns: [], //列配置
				loading: false,
				highlight: false, //单行选中
				editState: false, //编辑状态
				pageSizeOpts: [20, 30, 40, 50], //分页大小选项
				//表格数据请求参数
				page: 1, //页码
				rows: 30, //条数
				sorts: [], //排序
				filters: [], //过滤
				groupOp: "", //过滤方式
				sumFields: [], //未知条件
				//辅助数据
				bigImgUrl: "",
                bigImgShow: "",
				bigImgState: false,
                bigImgStyle: {},

			};
		},
		mounted() {
			this.tableInit();
			this.getTableData();
		},
		watch: {
			list() {
				this.data = this.list;
			},
			setFilters() {
				this.filters = this.setFilters.filters;
				this.groupOp = this.setFilters.groupOp;
				this.pageJump(1);
			}
		},
		computed: {
			height() {
				return this.setHeight ? this.setHeight : 500;
			}
		},
		methods: {
			/**表格 初始化 数据请求**/
			tableInit() {
				//排序
				this.sorts = this.initSorts || [];
				//过滤

				//单选
				this.highlight = this.currentChange ? true : false;
				//配置
				this.columnsInit();
			},
			columnsInit() {
				this.columns = this.initColumns.map(item => {
					item.align = "center";
					switch (item.uiType) {
						case "img":
							console.log(item);
							item.render = (h, params) => {
								return this.tableImg(h, params, item.url);
							};
							break;
						case "btn":
							item.render = (h, params) => {
								return this.tableBtns(h, params, item.btnList);
							};
							break;
						case "date":
							item.render = this.tableDateEdit;
							break;
						case "texts":
							item.align = "left";
							item.ellipsis = true;
							item.render = this.tableTextarea;
							break;
						case "textEdit":
							item.render = this.tableTextEdit;
							break;
						case "selectEdit":
							//传入 下拉ID的键名 和 下拉数据
							item.render = (h, params) => {
								return this.tableSelectEdit(h, params, item.id, item.list);
							};
							break;
						case "numberEdit":
							item.render = (h, params) => {
								return this.tableDecimalEdit(h, params, true);
							};
							break;
						case "decimalEdit":
							item.render = this.tableDecimalEdit;
							break;
						default:
							break;
					}
					return item;
				});
				//添加多选
				this.selectionChange &&
				this.columns.unshift({
					width: 52,
					align: "center",
					type: "selection"
				});
			},
			getTableData() {
				if (this.list) return;
				this.loading = true;
				this.getData({
					page: this.page,
					rows: this.rows,
					sorts: this.sorts,
					groupOp: this.groupOp,
					filters: this.filters,
					sumFields: this.sumFields
				})
					.then(res => {
						// console.log(res);
						this.loading = false;
						this.data = res.data;
						this.total = res.count;
						this.callback && this.callback();
					})
					.catch(error => {
						// console.log(error);
						this.loading = false;
					});
			},
			/**表格分页 初始化 跳页 页面条数改变**/
			pageInit() {
				this.$refs["pageJump"].currentPage = 1;
			},
			pageJump(page) {
				this.page = page;
				this.getTableData();
				if (page === 1) this.pageInit();
			},
			pageSizeChange(pageSize) {
				this.rows = pageSize;
				this.getTableData();
			},
			/**表格排序 设置默认排序 响应排序变化 column **/
			tableSortChange({key, order}) {
				if (order !== "normal") {
					this.sorts = [
						{
							field: key,
							order: order
						}
					];
				} else {
					this.sorts = [];
				}
				this.pageJump(1);
			},
			/**表格单选 **/
			highlightFun(currentRow, oldCurrentRow) {
				this.currentChange && this.currentChange(currentRow, oldCurrentRow);
			},
			/**表格多选 **/
			selectionChangeFun(selection) {
				this.selectionChange && this.selectionChange(selection);
			},
			/**表格展示 render函数 **/
			// TODO
			tableImg(h, params, link = "http://intranet.singsong.cn/Singsong/") {
				let error_src = "https://gift.singsong.cn/web/binary/company_logo";
				const key = params.column.key;
				const value = params.row[key];
				let imgUrl = (value !== '#') ? value : error_src;
				// console.log(params, value, imgUrl);
				return h("img", {
					attrs: {
						alt: "无图片",
						src: imgUrl,
						onerror: "this.style.display='none'",
						style:
							"height: 64px; position: relative; top: 2px; border-radius: 2px; border: none;",
					},
					on: {
						click: () => {
							// this.bigImgUrl = imgUrl;
							// this.bigImgState = true;
						},
						mouseenter: () => {
							this.bigImgUrl = imgUrl;
						},
                        mouseleave: () => {
							this.bigImgUrl = '';
						},
						mousemove: (e) => {
							let $img = document.querySelector('#pic1');
							let $div = document.querySelector('#pic');
							let wH = document.documentElement.clientHeight;
							let wW = document.documentElement.clientWidth;
							let imgW = $img.clientWidth;
							let imgH = $img.clientHeight;
							let cssArr = {"top": "", "left": "", "bottom": "", "right": ""};

							if (e.clientX + imgW > wW) {
								if (wW - e.clientX < imgW) {
									cssArr.left = (e.clientX - imgW - 10) + "px";
								} else {
									cssArr.right = 0;
								}
							} else {
								cssArr.left = (e.clientX + 10) + "px";
							}
							if (e.clientY + imgH > wH) {
								cssArr.bottom = 0;
							} else {
								cssArr.top = (e.clientY + 10) + "px";
							}
							cssArr.display = 'block';
							this.bigImgStyle = cssArr;
						},
					}
				});
			},
			tableBtns(h, params, btnList) {
				const buttons = btnList.map(item => {
					return h(
						"Button",
						{
							props: {
								type: item.type,
								size: "small"
							},
							style: {
								marginRight: "5px"
							},
							on: {
								click: () => {
									item.event(params.row, params.index);
								}
							}
						},
						item.name
					);
				});
				return h("div", buttons);
			},
			tableTextarea(h, params) {
				const key = params.column.key;
				const value = params.row[key];
				return h(
					"Tooltip",
					{
						props: {
							content: value,
							"max-width": 220,
							placement: "bottom-start"
						},
						style: {
							cursor: "pointer",
							"text-indent": "3px"
						}
					},
					[
						h(
							"div",
							{
								style: {
									width: "68px",
									height: "100%"
								}
							},
							value
						),
						h(
							"span",
							{
								slot: "content",
								style: {whiteSpace: "normal", wordBreak: "break-all"}
							},
							value
						)
					]
				);
			},
			//编辑
			tableDateEdit(h, params) {
				const key = params.column.key;
				const value = params.row[key];
				return h("div", {}, [
					value,
					h("DatePicker", {
						attrs: {
							class: "table-date"
						},
						style: {
							width: "22px",
							display: "inline-block"
						},
						props: {
							type: "date",
							value: value,
							size: "small",
							clearable: false
						},
						on: {
							"on-change": date => {
								//效验权限 TODO
								this.$set(this.data[params.index], key, date);
							}
						}
					})
				]);
			},
			tableTextEdit(h, params) {
				const key = params.column.key;
				const value = params.row[key];
				return h("div", {}, [
					h(
						"span",
						{
							style: {
								display: this.editState ? "none" : "inline-block"
							}
						},
						value
					),
					h("Input", {
						style: {
							display: this.editState ? "inline-block" : "none"
						},
						props: {
							value: value
						},
						on: {
							"on-change": event => {
								const ind = params.index;
								const key = params.column.key;
								this.$set(this.data[ind], key, event.target.value);
							}
						}
					})
				]);
			},
			tableSelectEdit(h, params, id, list) {
				let Options = [];
				const key = params.column.key;
				const value = params.row[key]; //下拉展示文字
				const keyValue = params.row[id]; //下拉ID
				for (let k in list) {
					Options.push(
						h(
							"Option",
							{
								props: {
									value: k
								}
							},
							list[k]
						)
					);
				}
				return h(
					"div",
					{},
					[
						h(
							"span",
							{
								style: {
									display: this.editState ? "none" : "inline-block"
								}
							},
							value
						),
						h(
							"Select",
							{
								style: {
									display: this.editState ? "inline-block" : "none"
								},
								props: {
									value: keyValue
								},
								on: {
									"on-change": val => {
										const ind = params.index;
										this.$set(this.data[ind], id, val);
										this.$set(this.data[ind], key, list[val]);
									}
								}
							},
							Options
						)
					],
					value
				);
			},
			tableDecimalEdit(h, params, type) {
				//type 为 true 整数
				const key = params.column.key;
				const value = params.row[key];
				return h(
					"div",
					{},
					[
						h(
							"span",
							{
								style: {
									display: this.editState ? "none" : "inline-block"
								}
							},
							value
						),
						h("InputNumber", {
							style: {
								display: this.editState ? "inline-block" : "none"
							},
							props: {
								step: type ? 1 : 0.1,
								value: value
							},
							on: {
								"on-change": val => {
									const ind = params.index;
									const key = params.column.key;
									this.$set(this.data[ind], key, val);
								}
							}
						})
					],
					value
				);
			},
			// tableTextareaEdit(h, params) {},
			//功能
			// tableFillDown(h, params) {}
			/** */
		}
	};
</script>

<style>
    .table-content {
        overflow: inherit !important;
    }

    .big-image-modal .ivu-modal-footer {
        display: none !important;
    }

    .table-date input {
        padding-right: 13px !important;
    }

    .table-page {
        padding: 15px 0 0;
        text-align: right;
    }


    /*.container-item {float: left;}*/
    .container-item h1 {
        padding-bottom: 10px;
        color: darkmagenta;
        font-weight: bolder;
    }

    .container-item img {
        cursor: pointer;
    }

    #pic {
        position: fixed;
        display: none;
        z-index: 99999999;
    }

    #pic1 {
        width: 600px;
        height: auto;
        border-radius: 5px;
        -webkit-box-shadow: 5px 5px 5px 5px hsla(0, 0%, 5%, 1.00);
        box-shadow: 5px 5px 5px 0px hsla(0, 0%, 5%, 0.3);
    }

</style>
