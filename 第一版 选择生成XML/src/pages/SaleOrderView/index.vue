<template>
    <div class="saleOrderView">
        <!--<Button type="primary" @click="modal1 = true">打开：{{ this.type ? '收集货号' : '重新匹配'}}</Button>-->
        <Modal v-model="modal1" @on-cancel="cancel" :title="'打开：' + (this.type ? '收集货号' : '重新匹配')" fullscreen
               style="width: 800px;">
            <!-- fullscreen -->
            <div class="sale-header">
                <Button type="primary" @click="unique" style="margin-right: 20px;">去重</Button>
                <Button type="primary" @click="merge" style="margin-right: 20px;">合并结果</Button>
                <Button type="primary" @click="initType">{{ this.type ? '重新匹配' : '收集货号'}}</Button>
            </div>
            <Divider/>
            <div class="sale-search">
                <div class="sale-search-nums">
                    <Button type="default">勾选：{{selectList.length}}</Button>
                    <Button type="default" style="margin-left: 20px;">总数：{{dataList.length}}</Button>
                </div>
                <div class="sale-search-input">
                    <Input v-model="searchVal" style="margin: 0 auto; max-width: 600px;">
                        <Select v-model="searchType" slot="prepend" style="width: 80px">
                            <Option value="custom">客户货号</Option>
                            <Option value="company">公司号根</Option>
                        </Select>
                        <Button slot="append" @click="query" icon="ios-search"></Button>
                    </Input>
                </div>
                <div class="sale-search-range">

                    <Checkbox v-model="single">本报价单</Checkbox>
                </div>
            </div>
            <Divider/>
            <div class="sale-table">
                <E-table
                        :list="dataList"
                        :showPage="showPage"
                        :setHeight="setHeight"
                        :initColumns="initColumns"
                        :rowClassName="rowClassName"
                        :selectionChange="selectionChange"
                ></E-table>
            </div>
            <div slot="footer">
                <Button type="error" size="large" :loading="loading" @click="importCheck">导入</Button>
                <Button type="error" size="large" :loading="loading" @click="cancel">取消</Button>
            </div>
        </Modal>
        <!-- 检测到重复 是否继续导入 -->
        <Modal v-model="modal2" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>导入确认</span>
            </p>
            <div style="text-align:center;">
                <p>检测到公司货号</p>
                <div>{{repeatSku.join('\n')}}</div>
                <p>重复！是否继续导入?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" :loading="modal_loading" @click="importType(2, true)">导入覆盖</Button>
                <Button type="error" size="large" :loading="modal_loading" @click="importType(3, true)">重复不导入</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
	/**
	 * 需要
	 *  导入订单明细的字段
	 *  样品库与弹出框的字段对照
	 *  订单明细与弹窗的字段对照
	 * */
	export default {
		name: "saleOrderView",
		data() {
			return {
				id: null,
				type: null, // 是否为搜索货号
				custom: null, // 客户id
				// 表单
				modal1: true, // 弹窗状态
				single: false, // 数据范围
				searchVal: '', // 查询内容
				searchType: 'company', // 查询字段
				loading: false,
				// 表格
				setHeight: 500,
				showPage: true,
				dataList: [], // 表数据
				baseList: [], // 初始数据-原表单数据-SKU
				selectList: [], // 勾选数据
				initColumns: this.creatColumns(), // 表列
				// 检测重复后、是否导入
				modal2: false,
				repeatIds: [], //
				repeatSku: [],
				productIds: [],
				orderLineIds: [],
				modal_loading: false,
                // 提示
                collectInfo: `
                    搜索范围：
                        1、样品库（公司搜索按公司号根模糊匹配、客户搜索按客户货号搜索、当前客户、有效）
                        2、报价明细（）
                `,
			}
		},
		methods: {
			init() {
				this.initType();
				// 所有数据查询是累加到数据池
				// 手机货号和重新匹配的查询模式、查询范围不同
				// 需要新增公司货号号根来·
				// 第一次修正 04.13
				// 公司货号搜索时要添加客户、ok
				// 去重复 不删除选项、默认勾选优先级高的 ? 已勾选项要不要重置 ok 重置
				// 货号查询会重置勾选项 do 需说明 ok 重置
				// 带创建的数据去重复时不能被删除 ok
				// 总数和勾选数量的统计 勾选放前面 ok
				// 价格字段要增加币种、没有数据的不显示
				// 第二次修正 04.28 领导
				// 1、收集货号、不加载原来明细的数据 ok
				// 2、去重复的时候只检查公司货号和报价工厂 ok
				// 3、查询结果按公司货号和权重排序 ok
				// 4、导入时候验证是否有重复 ok
                // 第三次修正 05.27 领导
                // 1、查询的时候公司货号按号根查询
                // 2、搜素数据校验的时候也按公司货号号根校验
                // 3、数据导入时按号根比对、失效货号号根与待导入数据号根相同的货号全部删除
			},
			initData() {
				// 拉取本表单数据 并存储
				// 根据本表单失效数据、查询所有有效货号、自动激活 本报价单 勾选项
				// let type = this.type = Zero.GetQueryString('type') || 'collect'; // collect reset
				let id = this.id = Number(Zero.GetQueryString('id'));
				if (!id && id !== 0) return this.$Message.error('未找到单据ID');
				this.getOrder(id, null, null, res => {
					this.baseList = res.map(item => {
						return item.company_code;
					});
				});
				this.getOrderMain().then(([res]) => {
					(res.state !== 'draft') && this.cancel();
					this.custom = res.partner_id[1];
					if (this.type) {
						// 收集货号-取当前单据有效
						// this.getOrder(id);
					} else {
						// 重新拉取-取失效-全局搜索失效相关
						this.single = true;
						this.getInvalid(id, (res, invalids) => {
							this.getAll(null, invalids, null);
						});
					}
				});
			},
			initType() {
				// type: true/collect false/reset
				this.dataList = [];
				this.single = false;
				this.type = !this.type;
				this.selectList = [];
				this.initData();
			},
			/** 事件 **/
			unique() {
				// 去重复
				//      -规则：客户货号、公司货号、报价工厂、采购价格、销售价格、规格相同
				//      -去重：
				//          来源优先级：订单、报价、询盘、样品
				//          样品状态：完成、复样、待复样
				//          来源日期：保留最近
				//          勾选优先级较高的
				let uniqueObj = {};
				let uniqueList = [];
				let i = 0, len = this.dataList.length;
				for (; i < len; i++) {
					let item = this.dataList[i];
					let hash = item.hash;
					if (uniqueObj[hash]) {
						// 优先级判断
						(uniqueList[uniqueObj[hash][0]]['index'] < item['index']) ?
							uniqueObj[hash].unshift(i) : uniqueObj[hash].push(i);
					} else {
						uniqueObj[hash] = [i];
					}
					// 初始化勾选项
					item._checked = false;
					uniqueList.push(item);
				}
				// uniqueObj
				this.selectList = [];
				Object.values(uniqueObj).map(arr => {
					// uniqueList.push(arr[0]);
					// 由删除重复项改为勾选优先级高的
					if (!uniqueList[arr[0]]['_disabled']) {
						this.selectList.push(uniqueList[arr[0]]);
						this.$set(uniqueList[arr[0]], '_checked', true);
					}
				});
				this.dataList = uniqueList;
			},
			merge() {
				// 合并数据
				this.dataList = this.selectList;
				// this.unique();
				this.dataList.forEach(item => {
					item._checked = true; // 默认选中
				});
			},
			check(val, type, data) {
				// 批量搜索-未找到-创建
				// debugger
				if (!Array.isArray(val) || !val.length) return;
				let i = 0, len = val.length, key, name, not = [], keys = [];
				if (type === 'custom') {
					key = 'custom_code';
					name = '以下客户货号未找到:';
					keys = ['custom_code', 'customer_pro_no'];
				} else if (type === 'company') {
					key = 'company_code';
					name = '以下公司货号未找到:';
					keys = ['company_code', 'name'];
					keys = ['pro_no_root', 'pro_no_root'];
				}
				let result = data.map(item => {
					return item[keys[0]] || item[keys[1]];
				});
				for (; i < len; i++) {
					if (result.indexOf(val[i]) === -1) {
						not.push(val[i]);
						// 创建新的数据
						let line = {};
						line[key] = val[i];
						line = this.creatNull(line);
						this.dataList.push(line);
					}
				}
				not.length && this.$Message.warning(name + not.join(','));
			},
			query() {
				// 查询数据
				let company, custom;
				// 判断是否批量查询-全部转换为批量
				let type = this.searchType;
				let val = this.searchVal.replace(/\s+/g, ",").split(',');
				if (!Array.isArray(val) || !val.length || val[0] === "") {
					return this.$Message.warning('请输入搜索内容!');
				}
				// 判断查询范围、查询字段、组合条件、发起请求
				if (type === 'custom') {
					custom = val;
				} else if (type === 'company') {
					company = val;
				}
				if (!this.single) {
					// 全局搜索
					this.getAll(null, company, custom, data => {
						this.check(val, type, data);
					});
				} else {
					// 本表单搜索
					this.getOrder(this.id, company, custom, data => {
						this.dataList = this.dataList.concat(data);
						this.check(val, type, data);
					});
				}
				// 去重复
				// this.unique();
				// 取得查询结果、计算遗漏
				// this.check(val, this.searchType);
			},
			importData(product, orderLine, isCover, loading) {
				// 导入数据-导入订单明细 是否覆盖 isCover
				if (!product.length && !orderLine.length) {
					return this.$Message.warning('未检测到导入数据!请先勾选!');
				}
				this.modal_loading = loading;
				const url = 'ss_sale_order/import';
				let params = {
					orderId: this.id,
					cover_flag: isCover,
					sampleIdList: product,
					saleOrderLineIdList: orderLine,
				};
				this.$http.odoo(url, params).then(res => {
					// this.$Message.info('导入成功！');
					this.modal_loading = false;
					this.modal2 = false;
					console.log(res);
					// this.cancel();
					this.$Message.info({
						content: `
                            本次提交共导入\n
                            样品数据: ${product.length}条\n
                            报价数据: ${orderLine.length}条\n
                            导入成功: ${res['success_count']} 条\n
                            导入失败: ${res['failure_count']} 条\n
                        `,
                        duration: 0,
                        closable: true,
					});
				});
			},
			importType(type, loading) {
				// 导入类型 1 正常 2 覆盖 3 部分
				switch (type) {
					case 1:
						this.importData(this.productIds, this.orderLineIds, false, false);
						break;
					case 2:
						let productIds = [].concat(this.repeatIds.productIds, this.productIds);
						let orderLineIds = [].concat(this.repeatIds.orderLineIds, this.orderLineIds);
						this.importData(productIds, orderLineIds, true, loading);
						break;
					case 3:
						this.importData(this.productIds, this.orderLineIds, false, loading);
						break;
					default:
						break;
				}
			},
			importCheck() {
				// 导入前校验
				// -是否含有创建项（创建项不可选）
				// -是否有客户和公司货号重复 (4.28改 只公司)
				// -分割为样品、订单明细两个
				let repeatSku = [];
				let repeatIds = [];
				this.repeatIds = {
					productIds: [],
					orderLineIds: [],
				};
				this.repeatSku = [];
				this.productIds = [];
				this.orderLineIds = [];
				let i = 0, data = this.selectList, len = data.length;
				for (; i < len; i++) {
					let item = data[i];
					let hash = item.hash;
					let source = item.source;
					let sku = item.company_code;
					let sources = ['报价单', '报价单送出', '销售订单', '已锁定'];
					console.log('判断是否含有重复货号', item, hash, sku);
					// 判断是否含有重复货号
					let isHas = repeatSku.indexOf(sku);
					if (isHas > -1) {
						return this.$Message.error('数据中有重复货号、请先去重复后再导入！');
					} else {
						repeatSku.push(sku);
					}
					// 判断是否和原表单数据重复
					let isTrue = this.baseList.indexOf(item.company_code);
					if (isTrue > -1) {
						if (source === '样品库') {
							this.repeatIds.productIds.push(item.id);
						} else if (sources.indexOf(source) > -1) {
							this.repeatIds.orderLineIds.push(item.id);
						} else {
							this.$Message.warning('不存在的状态值!');
						}
						repeatIds.push(item.id);
						// this.repeatIds.push(item.id);
						this.repeatSku.push(item.company_code);
					} else if (source === '样品库') {
						this.productIds.push(item.id);
					} else if (sources.indexOf(source) > -1) {
						this.orderLineIds.push(item.id);
					} else {
						this.$Message.warning('不存在的状态值!');
					}
				}
				if (repeatIds.length) {
					this.modal2 = true;
				} else {
					this.importType(1);
				}
			},
			cancel() {
				// this.modal1 = false;
				console.log('关闭');
				window.parent.postMessage({}, '*');
			},
			selectionChange() {
				// 获取当前选中数据
				// console.log(arguments);
				this.selectList = arguments[0];
			},
			/** 请求 **/
			getAll(id, company, custom, callback) {
				// 全局搜索
				let domain = this.productDomains(company, custom);
				let domain_line = this.orderLineDomains(id, company, custom);
				return Promise.all([
					this.getProduct(domain),
					this.getOrderLine(domain_line),
				]).then(([res, result]) => {
					let data = [].concat(res, result);
					this.dataList = this.dataList.concat(data);
					// this.baseList = res.map(item => {
					// 	return item.id;
					// });
					callback && callback(data);
				});
			},
			getOrder(id, company, custom, callback) {
				// 本报价单内
				let domain = this.orderLineDomains(id, company, custom);
				this.getOrderLine(domain).then(res => {
					// this.dataList = this.dataList.concat(res);
					// this.baseList = res.map(item => {
					// 	return item.id;
					// });
					callback && callback(res);
				});
			},
			getInvalid(id, callback) {
				// 获取失效
				const domain = [
					'&',
					['order_id', '=', id],
					['state', '!=', 'cancel'],
					['sample_status', '=', 'invalid'],
				];
				this.getOrderLine(domain).then(res => {
					// 失效货号
					let invalids = res.map((item) => {
						console.log('invalids', item);
						return item['pro_no_root'];
					});
					callback && callback(res, invalids);
				});
			},
			getProduct(domains) {
				const model = "product.template";
				const fields = [
					"id", "name", "create_date", "customer_pro_no", "kanban_img", "description_sale",
					"in_pac_rate", "out_pac_rate", "out_box_l", "out_box_w", "out_box_h", "supplier_id",
					"standard_price", "currency_id", "pro_no_root"// 样品状态、港口、导入字段
				];
				return new Promise((resolve, reject) => {
					this.$odoo.searchRead(model, fields, 0, 8000, domains, "").then(res => {
						// 添加其他字段 、 生成对照字段
						let result = [];
						if (res.length) {
							result = res.records.map((val, ind) => {
								let item = this.creatProduct(val);
								return Object.assign({}, val, item);
							});
						}
						resolve && resolve(result);
					});
				});
			},
			getOrderMain() {
				const model = "sale.order";
				const fields = [
					"id", "partner_id", "state"
				];
				return this.$odoo.read(model, this.id, fields);
			},
			getOrderLine(domains) {
				const model = "sale.order.line";
				const fields = [
					"id", "name", "state", "sample_status", "custom_code", "company_code",
					"date_order", "validity_date", "confirmation_date", "product_image_url",
					"in_pac_rate", "out_pac_rate", "out_box_l", "out_box_w", "out_box_h",
					"description_sale", "supplier_id", "supplier_cost", "price_unit",
					"export_port", "currency_id", "create_date", "pro_no_root"// 贸易术语、创建时需要赋值的字段
				];
				return new Promise((resolve, reject) => {
					this.$odoo.searchRead(model, fields, 0, 8000, domains, "").then(res => {
						// 添加其他字段 、 生成对照字段
						let result = [];
						if (res.length) {
							result = res.records.map((val, ind) => {
								let item = this.creatLine(val);
								return Object.assign({}, val, item);
							});
						}
						resolve && resolve(result);
					});
				});
			},
			/** 辅助 **/
			// 动作
			remove(index) {
				// TODO 需优化
				// 删除并判断是否勾选 一并删除
				let line = []; // 数据
				let list = []; // 勾选
				let len = this.selectList.length - 1;
				let length = this.dataList.length - 1;
				if (len === -1) {
					// 无选项
					this.dataList.splice(index, 1);
					return;
				} else if (len === length) {
					this.dataList.splice(index, 1);
					this.dataList.forEach(item => {
						item._checked = true;
						list.push(item);
					});
					this.selectList = list;
				} else {
					this.dataList.forEach((item, ind) => {
						if (ind === index) return;
						if (this.isRepeat(item)) {
							item._checked = true;
							list.push(item);
							line.push(item);
						} else {
							line.push(item);
						}
					});
					this.dataList = line;
					this.selectList = list;
				}
			},
			isRepeat(item) {
				let i = 0, len = this.selectList.length;
				for (; i < len; i++) {
					let val = this.selectList[i];
					if (item.hash === val.hash &&
						item.id === val.id) {
						return true;
					}
				}
			},
			// 字段
			creatNull(val) {
				return {
					// 来源-不导入
					source: '无',
					// 样品状态-不导入
					sample_status: '待创建',
					// 源日期-不导入
					creat_data: '',
					// 客户货号
					custom_code: val['custom_code'] || val['customer_pro_no'],
					// 公司货号
					company_code: val['company_code'] || val['name'],
					// 图片
					product_image_url: '#',
					// 英文描述
					description_sale: '',
					// 规格-不导入
					specs: '',
					// 报价工厂
					supplier_id: '',
					// 采购价格
					supplier_cost: '',
					// 销售价格
					price_unit: '',
					// 贸易术语
					export_port: '',

					// 不可选中
					_disabled: true,
					// 检测是否重复
					hash: this.computeHash(val, true),
					index: this.computeIndex(val),
				};
			},
			creatLine(val) {
				return {
					// 来源-不导入
					source: this.computeState(val),
					// 样品状态-不导入
					sample_status: this.computeSampleState(val['sample_status']),
					// 源日期-不导入
					create_date: this.computeData(val),
					// 客户货号
					custom_code: val['custom_code'] || '',
					// 公司货号
					company_code: val['company_code'] || '',
					// 图片
					product_image_url: val['product_image_url'] || '#',
					// 英文描述
					description_sale: val['description_sale'] || '',
					// 规格-不导入
					specs: this.computeSpecs(val),
					// 报价工厂
					supplier_id: val['supplier_id'][1] || '',
					// 采购价格
					supplier_cost: (val['supplier_cost'] + val['currency_id'][1]) || '',
					// 销售价格
					price_unit: (val['price_unit'] + val['currency_id'][1]) || '',
					// 贸易术语
					export_port: this.computePort(val),
                    // 号根
                    pro_no_root: val.pro_no_root,

					// 检测是否重复
					hash: this.computeHash(val, true),
					index: this.computeIndex(val),
				};
			},
			creatProduct(val) {
				return {
					// 来源-不导入
					source: '样品库',
					// 样品状态-不导入
					sample_status: this.computeProductState(val),
					// 源日期-不导入
					create_date: this.computeData(val),
					// 客户货号
					custom_code: val['customer_pro_no'] || '',
					// 公司货号
					company_code: val['name'] || '',
					// 图片
					product_image_url: val['kanban_img'] || '#',
					// 英文描述
					description_sale: val['description_sale'] || '',
					// 规格-不导入
					specs: this.computeSpecs(val),
					// 报价工厂
					supplier_id: val['supplier_id'][1] || '',
					// 采购价格
					supplier_cost: (val['standard_price'] + val['currency_id'][1]) || '',
					// 销售价格
					price_unit: '',
					// 贸易术语
					export_port: '',
                    // 号根
                    pro_no_root: val.pro_no_root,

					// 检测是否重复
					hash: this.computeHash(val),
					index: this.computeIndex(val),
				};
			},
			creatColumns() {
				return [
					{
						type: 'index',
						width: 60,
						// indexMethod(row) {
						// 	console.log('r', row);
						// 	return row.hash + '' + row.index;
						// },
						// tooltip: true,
						// ellipsis: true,
						// sortable: true,
						// sortType: 'asc',
					},
					{
						key: "source",
						title: "来源",
						uiType: "text",
						filters: [
							{
								label: '样品库',
								value: '样品库'
							},
							{
								label: '报价单',
								value: '草拟'
							},
							{
								label: '报价单送出',
								value: '报价'
							},
							{
								label: '销售订单',
								value: '订单'
							},
							{
								label: '已锁定',
								value: '锁定'
							},
						],
						filterMultiple: true, // 多选
						filterMethod(value, row) {
							switch (value) {
								case '样品':
									return row.source === '样品库';
								case '草拟':
									return row.source === '报价单';
								case '报价':
									return row.source === '报价单送出';
								case '订单':
									return row.source === '销售订单';
								case '锁定':
									return row.source === '已锁定';
							}
						},
					},
					{
						key: "sample_status",
						title: "样品状态",
						uiType: "text"
					},
					{
						key: "create_date",
						title: "源日期",
						uiType: "text",
						sortable: true,
					},
					{
						key: "custom_code",
						title: "客户货号",
						uiType: "text"
					},
					{
						key: "company_code",
						title: "公司货号",
						uiType: "text",
						sortable: true,
						sortType: 'asc',
					},
					{
						key: "product_image_url",
						title: "图片",
						uiType: "img"
					},
					{
						key: "description_sale",
						title: "英文描述",
						uiType: "texts"
					},
					{
						key: "specs",
						title: "规格",
						uiType: "texts"
					},
					{
						key: "supplier_id",
						title: "报价工厂",
						uiType: "text"
					},
					{
						key: "supplier_cost",
						title: "采购价格",
						uiType: "text"
					},
					{
						key: "price_unit",
						title: "销售价格",
						uiType: "text"
					},
					{
						key: "export_port",
						title: "贸易术语",
						uiType: "text"
					},
					{
						title: 'Action',
						key: 'action',
						width: 150,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								// h('Button', {
								//     props: {
								//         type: 'primary',
								//         size: 'small'
								//     },
								//     style: {
								//         marginRight: '5px'
								//     },
								//     on: {
								//         click: () => {
								//             this.show(params.index)
								//         }
								//     }
								// }, 'View'),
								h('Button', {
									props: {
										type: 'error',
										size: 'small',
										icon: 'md-trash'
									},
									on: {
										click: () => {
											this.remove(params.index)
										}
									}
								}, 'Delete')
							]);
						}
					},
					/*{
						key: 'hash',
						title: '哈希',
						uiType: 'text',
						sortable: true,
						sortType: 'asc',
					},
					{
						key: 'index',
						title: '权重',
						uiType: 'text',
						sortable: true,
						sortType: 'asc',
					}*/
				];
			},
			rowClassName(row, index) {
				// 表样式
				if (row.source === '无') return 'orderLineCreat';
				return '';
			},
			// compute
			computePort(val) {
				// 贸易术语：出口港 + 贸易术语
				return '暂无';
			},
			computeData(val) {
				// 源日期：根据单据状态 取不同的日期
				let time = '';
				switch (val.state) {
					case 'draft':
						time = val['date_order'];
						break;
					case 'sent':
						time = val['validity_date'];
						break;
					case 'sale':
						time = val['confirmation_date'];
						break;
					case 'done':
						time = val['confirmation_date'];
						break;
					default:
						time = val['create_date'];
						break;
				}
				return time ? new Date(time).format('yyyy/MM/dd') : '';
			},
			computeSampleState(val) {
				// 样品状态
				let obj = {
					finish: '完成',
					dup_sample: '复样中',
					wait_dup_sample: '待复样',
				};
				return obj[val] || '';
			},
			computeProductState(val) {
				// TODO 样品状态
				return '暂无';
			},
			computeSpecs(val) {
				// 规格：内外装率 + 外包装
				return `
                    装率（内/外） ${val['in_pac_rate']}/${val['out_pac_rate']} \n\r
                    包装（外） ${val['out_box_l']}X${val['out_box_w']}X${val['out_box_h']}
                `;
			},
			computeState(val) {
				// 来源：订单明细当前状态
				const states = {
					draft: '报价单',
					sent: '报价单送出',
					sale: '销售订单',
					done: '已锁定',
				};
				return states[val.state] || '未知状态';
			},
			computeHash(val, isOrder) {
				// hash：去重复判断依据
				// 改：去掉销售价格比对 price_unit、standard_price
				// 改：只比对公司货号和工厂
				// const field = ['company_code', 'supplier_id', 'supplier_cost', 'specs'];
				// const fields = ['customer_pro_no', 'name', 'supplier_id', 'standard_price', 'specs'];
				const field = ['company_code', 'supplier_id'];
				const fields = ['name', 'supplier_id'];
				let i = 0, str = '', hash = '', length = fields.length;
				for (; i < length; i++) {
					str += isOrder ? val[field[i]] : val[fields[i]] + '';
				}
				hash = this.getHashCode(str);
				return Number(hash);
				// console.log('str hash:', str, hash);
			},
			computeIndex(val) {
				// index：优先级排序规则
				const states = ['done', 'sale', 'sent', 'draft', undefined];
				let state_num = 9 - states.indexOf(val.state);
				let create_date = this.computeData(val);
				let time_num = new Date(create_date).getTime() || 0;
				return Number(state_num + '' + time_num);
			},
			// domain
			productDomains(company, custom) {
				let domain = [
					["state", "!=", "file_store"],
					["delete_flag", "=", false],
					["customer_id", '=', this.custom],
				];
				let term1 = this.getTerm(custom);
				let term2 = this.getTerm(company);
				// company && domain.push(['name', term2.term, term2.val]);
				company && domain.push(['pro_no_root', term2.term, term2.val]);
				custom && domain.push(['customer_pro_no', term1.term, term1.val]);
				return domain;
			},
			orderLineDomains(id, company, custom) {
				// 报价单搜索
				let domain = [
					['state', '!=', 'cancel'],
					['sample_status', '!=', 'invalid'],
					['order_id.partner_id', '=', this.custom],
				];
				let term1 = this.getTerm(custom);
				let term2 = this.getTerm(company);
				id && domain.push(['order_id', '=', id]);
				custom && domain.push(['custom_code', term1.term, term1.val]);
				// company && domain.push(['company_code', term2.term, term2.val]);
				company && domain.push(['pro_no_root', term2.term, term2.val]);
				return domain;
			},
			// other
			getTerm(val) {
				if (!val) return {
					val: '',
					term: 'ilike',
				};
				if (val.length === 1) {
					return {
						val: val[0],
						term: 'ilike',
					};
				} else {
					return {
						val: val,
						term: 'in',
					};
				}
			},
			getHashCode(str, caseSensitive) {
				if (!caseSensitive) {
					str = str.toLowerCase();
				}
				let hash = 1315423911, i, ch;
				for (i = str.length - 1; i >= 0; i--) {
					ch = str.charCodeAt(i);
					hash ^= ((hash << 5) + ch + (hash >> 2));
				}
				return (hash & 0x7FFFFFFF);
			},
		},
		mounted() {
			this.init();
		}
	}
</script>

<style>
    .ivu-table .orderLineCreat td {
        background-color: #ff6600 !important;
        color: #fff !important;
    }
</style>
<style scoped lang="scss">

    .sale-search {
        font-size: 0;
        display: flex;
        text-align: right;

        .sale-search-input {
            /*width: 500px;*/
            flex: 1;
            min-width: 300px;
            display: inline-block;
        }

        .sale-search-range {
            width: 150px;
            height: 32px;
            line-height: 32px;
            text-align: left;
            margin-left: 100px;
            display: inline-block;
            vertical-align: top;
        }

        .sale-search-nums {
            width: 200px;
            display: inline-block;
        }
    }
</style>