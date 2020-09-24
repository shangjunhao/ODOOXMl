<template>
  <div class="analysis">
    <div class="head">
      <div class="head-menus">
        <!-- 上传 -->
        <input
          ref="file"
          type="file"
          accept=".jpg,.jpeg,.png"
          style="display: none;"
          @change="fileChange"
          multiple
        />
        <Button
          @click="openChange"
          v-show="!disabled"
          type="primary"
          style="margin: 10px 10px 0 0;"
          >选择图片</Button
        >
        <Button
          @click="inData"
          v-show="!disabled"
          type="primary"
          style="margin: 10px 10px 0 0;"
          >清空</Button
        >
        <Button
          @click="disabled = false"
          v-show="disabled"
          type="primary"
          style="margin: 10px 10px 0 0px;"
          >编辑</Button
        >
        <Button
          @click="disabled = true"
          v-show="!disabled"
          type="primary"
          style="margin: 10px 10px 0 0px;"
          >取消</Button
        >
        <Button
          @click="saveDtl"
          v-show="!disabled"
          type="primary"
          style="margin: 10px 30px 0 0px;"
          >保存</Button
        >
        <!--<Button @click="$refs['discount'].changeShow()" type="primary" style="margin: 10px 30px 0 30px; float: left;">查看折扣历史</Button>-->
        <!--<E-button class="picture-list-btn"-->
        <!--v-show="true"-->
        <!--:isStyle=false-->
        <!--:menuList="[]"-->
        <!--:btnList="btnList"-->
        <!--:style="{top:'0px'}"-->
        <!--:hasPowerList="[...btnList]"-->
        <!--&gt;</E-button>-->
      </div>
    </div>
    <div class="content">
      <div class="main">
        <div class="view">
          <Input
            class="view-msg"
            v-model="postResults.product_explain"
            type="textarea"
            :rows="8"
            placeholder="产品说明"
            disabled="disabled"
          />
          <div class="view-main">
            <div class="view-main-img">
              <V-image :url="images[index]" :top="'100%'"></V-image>
            </div>
          </div>
          <div class="view-list">
            <div
              class="view-item"
              v-for="(item, ind) in images"
              :key="ind"
              @click="index = ind"
              :class="{ active: index === ind }"
            >
              <V-image :url="item" :top="'100%'"></V-image>
            </div>
          </div>
        </div>
        <div class="picture-info">
          <Form
            ref="formInline"
            :model="formInline"
            :rules="ruleInline"
            :label-width="80"
            class="info-from"
          >
            <FormItem prop="relevance" label="关联：">
              <span v-if="disabled">{{
                postResults.relevance ? "相关" : "不相关"
              }}</span>
              <i-switch
                v-else
                v-model="formInline.relevance"
                size="large"
                :disabled="disabled"
              >
                <span slot="open">On</span>
                <span slot="close">Off</span>
              </i-switch>
            </FormItem>

            <Row>
              <Col span="11">
                <FormItem prop="sku" label="SKU：">
                  <span v-if="disabled">{{ postResults.sku }}</span>
                  <Input
                    v-else
                    v-model="formInline.sku"
                    type="text"
                    placeholder=""
                    :disabled="disabled"
                    style="width: 166px;"
                  ></Input>
                </FormItem>
              </Col>
            </Row>

            <Row v-if="disabled">
              <Col span="11">
                <FormItem prop="brand" label="Brand：">
                  <span>{{ postResults["brand"] }}</span>
                </FormItem>
              </Col>
              <Col span="2"></Col>
              <Col span="11">
                <FormItem prop="collection" label="Collection：">
                  <span>{{ postResults.collection }}</span>
                </FormItem>
              </Col>
            </Row>

            <Row v-if="disabled">
              <Col span="24">
                <FormItem prop="website" label="网址：">
                  <a :href="postResults.website" target="_blank">{{
                    postResults.website
                  }}</a>
                  <!--<span  v-if="disabled">{{postResults.website}}</span>-->
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span="11">
                <FormItem prop="statistical_data" label="时间：">
                  <span v-if="disabled">{{
                    postResults.statistical_data
                  }}</span>
                  <DatePicker
                    v-else
                    v-model="formInline.statistical_data"
                    type="date"
                    format="yyyy-MM-dd"
                    placeholder=""
                    :disabled="disabled"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="2"></Col>
              <Col span="11" v-if="disabled">
                <FormItem prop="" label="完善人：">
                  <span>{{ postResults["write_uid"] }}</span>
                </FormItem>
              </Col>
              <Col span="2"></Col>
            </Row>

            <Row v-if="disabled">
              <Col span="11">
                <FormItem prop="" label="来源：">
                  <span>{{ postResults["source"] }}</span>
                  <!--<Select v-else v-model="formInline.source" placeholder="" disabled>
                                        <Option v-for="(item, ind) in source" :key="ind" :value="item.id">{{item.name}}</Option>
                                    </Select>-->
                </FormItem>
              </Col>
              <Col span="2"></Col>
              <Col span="11">
                <FormItem prop="" label="FOB：">
                  <span>{{ postResults["FOB_price"] }}</span>
                  <!--<Input v-model="formInline.FOB_price" placeholder="" disabled/>-->
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span="11">
                <FormItem prop="_customer" label="客户：">
                  <span v-if="disabled">{{ postResults._customer }}</span>
                  <Select
                    v-else
                    v-model="formInline._customer"
                    placeholder=""
                    filterable
                    clearable
                    :disabled="disabled"
                  >
                    <Option
                      v-for="(item, ind) in customer"
                      :key="ind"
                      :value="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
              <Col span="2"></Col>
              <Col span="11">
                <FormItem prop="_supplier" label="工厂：">
                  <span v-if="disabled">{{ postResults._supplier }}</span>
                  <!--
                                    方法一 远程搜索
                                    remote
                                    filterable
                                    :loading="loading"
                                    :remote-method="supplierData"
                                    -->
                  <Select
                    v-else
                    filterable
                    clearable
                    v-model="formInline._supplier"
                    placeholder=""
                    :disabled="disabled"
                  >
                    <Option
                      v-for="(item, ind) in supplier"
                      :key="ind"
                      :value="item.id"
                      >{{ item.name + "（" + item.full_name + "）" }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span="11">
                <FormItem prop="_category" label="大类：">
                  <span v-if="disabled">{{ postResults._category }}</span>
                  <Select
                    @on-change="getCategoryMeasure"
                    v-else
                    v-model="formInline._category"
                    placeholder=""
                    filterable
                    clearable
                    :disabled="disabled"
                  >
                    <Option
                      v-for="(item, ind) in category"
                      :key="ind"
                      :value="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
              <Col span="2"></Col>
              <Col span="11">
                <FormItem prop="series" label="系列：">
                  <span v-if="disabled">{{ postResults.series }}</span>
                  <Select
                    v-else
                    v-model="formInline.series"
                    placeholder=""
                    filterable
                    clearable
                    :disabled="disabled"
                  >
                    <Option
                      v-for="(item, ind) in series"
                      :key="ind"
                      :value="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col :span="disabled ? 11 : 6">
                <FormItem prop="sale_price" label="售价：">
                  <span v-if="disabled">{{
                    postResults.sale_price + " " + postResults.sale_currency
                  }}</span>
                  <InputNumber
                    v-else
                    v-model="formInline.sale_price"
                    :disabled="disabled"
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span="5" v-if="!disabled">
                <FormItem prop="sale_currency" label="币种：">
                  <Select
                    v-model="formInline.sale_currency"
                    placeholder=""
                    :disabled="disabled"
                  >
                    <Option
                      v-for="(item, ind) in currency"
                      :key="ind"
                      :value="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
              <Col :span="disabled ? 11 : 6">
                <FormItem prop="purchase_price" label="购价：">
                  <span v-if="disabled">{{
                    postResults.purchase_price +
                      " " +
                      postResults.purchase_currency
                  }}</span>
                  <InputNumber
                    v-else
                    v-model="formInline.purchase_price"
                    :disabled="disabled"
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span="5" v-if="!disabled">
                <FormItem prop="purchase_currency" label="币种：">
                  <Select
                    v-model="formInline.purchase_currency"
                    placeholder=""
                    :disabled="disabled"
                  >
                    <Option
                      v-for="(item, ind) in currency"
                      :key="ind"
                      :value="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </FormItem>
              </Col>
            </Row>

            <Divider>产品材质</Divider>

            <FormItem prop="_material_main" label="主材质：">
              <div class="_material_main" v-if="disabled">
                <Tag
                  v-for="(item, ind) in postResults._material_main"
                  :key="ind"
                  :color="tabClolr(ind)"
                  >{{ item.name | materialEnd }}</Tag
                >
              </div>
              <div class="_material_main" v-else>
                <Tag
                  v-for="(item, ind) in material"
                  :key="ind"
                  checkable
                  :checked="isChecked(item, 'main')"
                  :color="tabClolr(ind)"
                  @on-change="
                    (checked, name) => {
                      materialTab(checked, item, 'main');
                    }
                  "
                  >{{ item.name | materialEnd }}</Tag
                >
                <Select
                  v-model="formInline._material_main"
                  placeholder="主材质"
                  multiple
                  filterable
                  clearable
                  :max-tag-count="5"
                  :disabled="disabled"
                >
                  <Option
                    v-for="(item, ind) in material_not"
                    :key="ind"
                    :value="item.id"
                    >{{ item.name | materialEnd }}</Option
                  >
                </Select>
              </div>
            </FormItem>

            <FormItem prop="_material_parts" label="配件材质：">
              <div class="_material_main" v-if="disabled">
                <Tag
                  v-for="(item, ind) in postResults._material_parts"
                  :key="ind"
                  :color="tabClolr(ind)"
                  >{{ item.name | materialEnd }}</Tag
                >
              </div>
              <div class="_material_main" v-else>
                <Tag
                  v-for="(item, ind) in material_tab"
                  :key="ind"
                  checkable
                  :checked="isChecked(item, 'parts')"
                  :color="tabClolr(ind)"
                  @on-change="
                    (checked, name) => {
                      materialTab(checked, item, 'parts');
                    }
                  "
                  >{{ item.name | materialEnd }}</Tag
                >
                <Select
                  v-model="formInline._material_parts"
                  placeholder="配件材质"
                  multiple
                  filterable
                  clearable
                  :max-tag-count="5"
                  :disabled="disabled"
                >
                  <Option
                    v-for="(item, ind) in material_tab_not"
                    :key="ind"
                    :value="item.id"
                    >{{ item.name | materialEnd }}</Option
                  >
                </Select>
              </div>
            </FormItem>

            <Divider>产品尺寸</Divider>

            <Row>
              <Col span="5">
                <FormItem prop="long" label="长：">
                  <span v-if="disabled">{{ postResults["long"] }}</span>
                  <Input
                    v-else
                    v-model="formInline.long"
                    type="number"
                    placeholder=""
                    :disabled="disabled"
                  />
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem prop="wide" label="宽：">
                  <span v-if="disabled">{{ postResults["wide"] }}</span>
                  <Input
                    v-else
                    v-model="formInline.wide"
                    type="number"
                    placeholder=""
                    :disabled="disabled"
                  />
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem prop="tall" label="高：">
                  <span v-if="disabled">{{ postResults["tall"] }}</span>
                  <Input
                    v-else
                    v-model="formInline.tall"
                    type="number"
                    placeholder=""
                    :disabled="disabled"
                  />
                </FormItem>
              </Col>
              <Col span="9" v-if="disabled">
                <FormItem prop="" label="尺寸：">
                  <span>{{ postResults["measure"] }}</span>
                </FormItem>
              </Col>
            </Row>

            <FormItem prop="vertical" label="备选尺寸：" v-if="!disabled">
              <RadioGroup v-model="vertical" vertical @on-change="setMeasure">
                <Radio
                  v-for="item in categoryMeasure"
                  @on-change="setMeasure(item)"
                  :key="item.id"
                  :label="JSON.stringify(item)"
                  :value="item.measure"
                >
                  {{ item.measure }}
                </Radio>
              </RadioGroup>
            </FormItem>

            <!--<FormItem prop="measure" label="产品尺寸：">
                            <span  v-if="disabled">{{postResults.measure}}</span>
                            <Input v-else v-model="formInline.measure" type="textarea" :rows="2" placeholder="" :disabled="disabled" />
                        </FormItem>-->
            <!--<FormItem prop="measure" label="产品说明：">
                            <span  v-if="disabled">{{postResults.product_explain}}</span>
                            <Input v-else v-model="formInline.product_explain" type="textarea" :rows="2" placeholder="" :disabled="disabled" />
                        </FormItem>-->
          </Form>
        </div>
        <div class="discount-line" style="width: 100%;">
          <E-table
            :list="analysis_line"
            :showPage="showPage"
            :initColumns="initColumns"
            :setHeight="230"
          ></E-table>
        </div>
        <div class="discount-line" style="width: 100%;">
          <E-table
            :list="analysis_label_line"
            :showPage="showPage"
            :initColumns="initColumns_label"
            :setHeight="230"
          ></E-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import analysis from './analysis_line';
export default {
  name: "index",
  // components: {
  // 	'S-Discount': analysis,
  // },
  filters: {
    materialEnd: function(value) {
      return value.split("/").pop();
    }
  },
  data() {
    return {
      images: [],
      index: 0,
      url:
        "https://singsongpict.oss-cn-hangzhou.aliyuncs.com/image/crawler/doiydesign/1f4ba3e639228739dae39709296d5459_8.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800",

      // from
      disabled: true, // 开启编辑
      loading: false, // 工厂搜索加载
      vertical: "",
      material_main_ids: [],
      material_parts_ids: [],
      formInline: {
        // source: '云图库',
        // FOB_price: '',
        // measure: '',

        _customer: "",
        _supplier: "",

        sale_price: 0,
        sale_currency: "",
        purchase_price: 0,
        purchase_currency: "",

        _material_main: "",
        _material_parts: "",

        long: 0,
        wide: 0,
        tall: 0,

        sku: "",
        series: null,
        _category: null,
        relevance: true,
        // product_explain: '',
        statistical_data: ""
      },
      ruleInline: {}, // 数据验证
      postResults: {}, // 数据请求
      editResults: {}, // 编辑上传

      // data
      source: [],
      series: [],
      currency: [],
      category: [],
      customer: [],
      supplier: [],
      material: [],
      material_not: [],
      material_tab: [],
      material_tab_not: [],
      categoryMeasure: [],

      // other
      id: null,

      // line
      showPage: true,
      analysis_line: [],
      analysis_label_line: [],
      initColumns: [
        {
          key: "enter_data",
          title: "日期",
          uiType: "text"
        },
        {
          key: "theme",
          title: "折扣主题",
          uiType: "text"
        },
        {
          key: "price",
          title: "折扣价格",
          uiType: "text"
        },
        {
          key: "explain",
          title: "折扣说明",
          uiType: "texts"
        }
      ],
      initColumns_label: [
        {
          key: "enter_data",
          title: "日期",
          uiType: "text"
        },
        {
          key: "label",
          title: "一级标签",
          uiType: "text"
        },
        {
          key: "label_two",
          title: "二级标签",
          uiType: "text"
        }
      ]
    };
  },
  methods: {
    init() {
      this.inData();
      const id = Zero.GetQueryString("id");
      if (id) {
        this.id = id;
        // this.getDtl();
        this.baseDtlData();
        this.supplierDataAll();
      } else {
        this.$Message.error('未找到ID');
      }
    },
    inData() {
      this.formInline = {
        // source: '云图库',
        // FOB_price: '',
        // measure: '',

        _customer: "",
        _supplier: "",

        sale_price: 0,
        sale_currency: "",
        purchase_price: 0,
        purchase_currency: "",

        _material_main: "",
        _material_parts: "",

        long: 0,
        wide: 0,
        tall: 0,

        sku: "",
        series: "",
        _category: "",
        relevance: true,
        // product_explain: '',
        statistical_data: ""
      };
    },
    getDtl() {
      let config = {
        sku: {
          type: "Char",
          data: [],
          form: true
        },
        name: {
          type: "Char",
          data: [],
          form: false
        },
        brand: {
          type: "Char",
          data: [],
          form: false
        },
        website: {
          type: "Char",
          data: [],
          form: false
        },
        collection: {
          type: "Char",
          data: [],
          form: false
        },
        measure: {
          type: "Char",
          data: [],
          form: false
        },
        FOB_price: {
          type: "Char",
          data: [],
          form: false
        },
        display_name: {
          type: "Char",
          data: [],
          form: false
        },
        product_explain: {
          type: "Char",
          data: [],
          form: false
        },

        source: {
          type: "Many2one",
          data: [],
          form: false
        },
        series: {
          type: "Many2one",
          data: [],
          form: true
        },
        _category: {
          type: "Many2one",
          data: [],
          form: true
        },
        _customer: {
          type: "Many2one",
          data: [],
          form: true
        },
        _supplier: {
          type: "Many2one",
          data: [],
          form: true
        },
        sale_currency: {
          type: "Many2one",
          data: [],
          form: true
        },
        purchase_currency: {
          type: "Many2one",
          data: [],
          form: true
        },
        create_uid: {
          type: "Many2one",
          data: [],
          form: false
        },
        write_uid: {
          type: "Many2one",
          data: [],
          form: false
        },

        long: {
          type: "Float",
          data: [],
          form: true
        },
        wide: {
          type: "Float",
          data: [],
          form: true
        },
        tall: {
          type: "Float",
          data: [],
          form: true
        },
        sale_price: {
          type: "Float",
          data: [],
          form: true
        },
        purchase_price: {
          type: "Float",
          data: [],
          form: true
        },

        relevance: {
          type: "Boolean",
          data: [],
          form: true
        },
        statistical_data: {
          type: "Date",
          data: [],
          form: true
        },

        main_img: {
          type: "Char",
          data: [],
          form: false
        },
        assist_img: {
          type: "Char",
          data: [],
          form: false
        },
        _material_main: {
          type: "Json",
          data: [],
          form: true
        },
        _material_parts: {
          type: "Json",
          data: [],
          form: true
        }
      };
      const fields = Object.keys(config);
      this.getDtlData(this.id, fields).then(([res]) => {
        // 整理oDoo数据
        let result = this.$odoo.resultHandle(res, config);
        this.formInline = JSON.parse(JSON.stringify(result.formData));
        this.postResults = JSON.parse(JSON.stringify(result.postResults));
        console.log('result', this.formInline['_material_main'], this.formInline['_material_parts']);

        // 获取大类默认尺寸信息
        this.getCategoryMeasure(this.formInline._category);

        // 拷贝材质选项到 材质标签数组
        // this.material_main_ids = [...result.formData._material_main];
        // this.material_parts_ids = [...result.formData._material_parts];

        // 拆分上下两个ID组
        let main = [...result.formData._material_main];
        let parts = [...result.formData._material_parts];
        this.splitIds(main, "_material_main", "material_main_ids", "material", "material_not");
        this.splitIds(parts, "_material_parts", "material_parts_ids", "material_tab", "material_tab_not");

        // 拆分辅助图
        let assist_img = this.postResults.assist_img;
        if (assist_img && assist_img.split) {
          let images = assist_img.split(",");
          this.images = images;
        } else {
          this.images = [];
        }

        // 获取折扣数据 标签数据
        const sku = res["sku"];
        const _customer = res["_customer"];
        if (sku && _customer) {
          this.getDiscountLineData(_customer[0], sku).then(res => {
            this.analysis_line = res.records || [];
          });
          this.getLabelLineData(_customer[0], sku).then(res => {
            this.analysis_label_line = res.records || [];
          });
        }

        // 读取记忆数据
        this.readForm();
      });
    },
    saveDtl() {
      this.disabled = true;
      this.storageForm();
      this.saveDtlData(this.id, this.formInline).then(res => {
        res && this.getDtl();
      });
    },

    /**
     * 图片上传
     * */
    openChange() {
      let input = this.$refs["file"];
      input.value = "";
      input.click();
    },
    fileChange($event) {
      let tager = $event.target || $event.srcElement;
      // let batch = new Date().format('yyyyMMddhhmmss');
      let files = Array.from(tager.files);
      if (!files) return;
      if (files.length > 20) {
        this.$Message.warning("单次不得上传超过20张图片！！！");
        return;
      }
      this.uploadImg(files);
    },
    uploadImg(files) {
      const url = "/ss_picture/assist/upload_assist";
      // let file = files.pop();
      let formData = new FormData();
      // formData.append('file', file);
      for (let i = 0, len = files.length; i < len; i++) {
        formData.append("file" + i, files[i]);
      }
      formData.append("analysis_id", this.id);
      this.$http.fileUpLoad(url, formData).then(res => {
        console.log("res, ", res);
        this.index = 0;
        this.getDtl();
      });
    },
    deleteImg(index) {
      this.images.splice(index, 1);
      let formInline = {
        assist_img: this.images.length ? this.images.join(",") : ""
      };
      this.saveDtlData(this.id, formInline).then(res => {
        res && this.getDtl();
      });
    },

    /**
     * 辅助
     *
     * 因为材质拆上下两层所产生的函数
     * splitIds     拆分id
     * tabColor     判断颜色
     * isChecked    判断选中状态
     * materialTab  选中与取消存取id
     * mergeMaterial    合并最终结果
     *
     * 材质处理说明：
     *  1、获取 常用主材质、不常用主材质、常用辅材质、不常用辅材质
     *  2、获取 主材质JSON、辅材质JSON
     *  3、将JSON数据转换为ID数组
     *  4、通过ID数组、转换成对象的常用和不常用材质数据、将ID划分到不同的区域
     *  5、与用户相关的交互操作、选中、取消、默认选中等等
     *  6、将常用和不常用的材质进行合并和去重复处理
     *  7、根据合并后的ID数组将其对应的数据找到
     *  8、将合并后的JSON数据上传
     * */
    tabClolr(ind) {
      // 判断标签颜色
      let i = ind % 4;
      let color = "primary";
      /*switch (i) {
                    case 0:
                    	color = 'primary';
                    	break;
                    case 1:
                    	color = 'success';
                    	break;
                    case 2:
                    	color = 'error';
                    	break;
                    case 3:
                    	color = 'warning';
                    	break;
                    default:
                    	break;
	            }*/
      return color;
    },
    splitIds(ids, key, keyTwo, data, dataTwo) {
      // 分割数据到常用和不常用的数据集中
      // ids 全部ID |
      // key 常用ID数据key | keyTwo 不常用ID数据key
      // data 常用标签数据key | dataTwo 不常用标签数据key
      let main = [];
      let main_not = [];
      let material = this.$odoo.Util.jsonToObj(this[data]);
      let material_not = this.$odoo.Util.jsonToObj(this[dataTwo]);
      for (let i=0,len=ids.length;i<len;i++) {
        let id = ids[i];
        if (material[id]) {
          main.push(id);
        } else if (material_not[id]) {
          main_not.push(id);
        } else {

        }
      }
      this[keyTwo] = main;
      this.formInline[key] = main_not;
      // ids.map(id => {
      //   if (material[id]) {
      //     let ids = [].concat([id], this.formInline[key]);
      //     this.$set(this.formInline, key, ids);
      //     // this.formInline[key].push(id);
      //   } else if (material_not[id]) {
      //     let ids = [].concat([id], this[keyTwo]);
      //     this.$set(this, keyTwo, ids);
      //     // this[keyTwo].push(id);
      //   } else {
      //
      //   }
      // });
    },
    isChecked(item, type) {
      // 判断是否选中
      if (type === "main") {
        if (this.material_main_ids.indexOf(item.id) > -1) return true;
        if (this.formInline._material_main.indexOf(item.id) > -1) return true;
        return false;
      } else {
        if (this.material_parts_ids.indexOf(item.id) > -1) return true;
        if (this.formInline._material_parts.indexOf(item.id) > -1) return true;
        return false;
      }
    },
    mergeMaterial() {
      // 合并标签并转为JSON
      let mainO = [],
        partsO = [],
        materials = [];
      let main_tab = this.material_main_ids;
      let parts_tab = this.material_parts_ids;
      let main_ids = this.formInline._material_main;
      let parts_ids = this.formInline._material_parts;
      let main = Array.from(new Set([...main_ids, ...main_tab]));
      let parts = Array.from(new Set([...parts_ids, ...parts_tab]));
      materials = Array.from(new Set([...this.material, ...this.material_not]));
      for (let i = 0, len = materials.length; i < len; i++) {
        let item = materials[i];
        if (main.indexOf(item.id) > -1) {
          mainO.push(item);
        }
        if (parts.indexOf(item.id) > -1) {
          partsO.push(item);
        }
      }
      // 没有标签、则为空
      console.log(this.material, this.material_not);
      console.log(main, parts, main_tab, parts_tab, main_ids, parts_ids, mainO, partsO, materials);
      this.formInline._material_main = mainO.length
        ? JSON.stringify(mainO)
        : null;
      this.formInline._material_parts = partsO.length
        ? JSON.stringify(partsO)
        : null;
    },
    readForm() {
      const keys = ["_category", "series"];
      keys.map(key => {
        let val = Number(localStorage.getItem(key));
        let data = this.formInline[key];
        this.formInline[key] = val || data || null;
        // console.log(val, data);
        // if (!data && val) {
        //   this.formInline[key] = Number(val);
        // }
      });
    },
    storageForm() {
      const keys = ["_category", "series"];
      keys.map(key => {
        let val = this.formInline[key];
        localStorage.setItem(key, val);
      });
    },

    /** 事件 */
    materialTab(checked, item, type) {
      // 标签的选中与取消
      let ids =
        type === "main" ? this.material_main_ids : this.material_parts_ids;
      let box =
        type === "main"
          ? this.formInline._material_main
          : this.formInline._material_parts;
      if (checked) {
        ids.push(item.id);
      } else {
        let ind = ids.indexOf(item.id);
        let index = box.indexOf(item.id);
        if (index > -1) {
          box.splice(index, 1);
        } else if (ind > -1) {
          ids.splice(ind, 1);
        }
      }
      // console.log('materialTab', box);
    },
    setMeasure(item) {
      item = JSON.parse(item);
      this.$set(this.formInline, "long", item.long);
      this.$set(this.formInline, "wide", item.wide);
      this.$set(this.formInline, "tall", item.tall);
    },

    /** 数据请求 */
    getDtlData(id, fields) {
      // 详情页
      const url = "dataset/call_kw/ss.customer.analysis/read";
      let params = {
        args: [[Number(id)], fields],
        kwargs: {},
        method: "read",
        model: "ss.customer.analysis"
      };
      return this.$http.odoo(url, params);
    },
    /*getLineData(id) {
            	// 折扣价格明细行
            	const url = 'dataset/call_kw/ss.discount.line/read';
				let params = {
                	args: [
                		[Number(id)],
                        ["theme", "price", "explain", "label", "enter_data"],
                    ],
                    kwargs: {},
                    method: "read",
                    model: 'ss.discount.line',
                };
                return this.$http.odoo(url, params);
            },*/
    getDiscountLineData(_customer, sku) {
      // 折扣价格明细行
      const model = "ss.discount.line";
      // const fields = ["theme", "price", "explain", "enter_data"];
      const fields = this.initColumns.map(item => {
        return item.key;
      });
      const domain = [["_customer", "=", _customer], ["sku", "=", sku]];
      return this.$odoo.searchRead(model, fields, 0, 8000, domain);
    },
    getLabelLineData(_customer, sku) {
      // 折扣价格明细行
      const model = "ss.label.line";
      // const fields = ["label", "enter_data"];
      const fields = this.initColumns_label.map(item => {
        return item.key;
      });
      const domain = [["_customer", "=", _customer], ["sku", "=", sku]];
      return this.$odoo.searchRead(model, fields, 0, 8000, domain);
    },
    saveDtlData(id, formData) {
      // 编辑
      this.mergeMaterial(); // 合并材质项
      let deleteNull = this.$odoo.Util.deleteNull;
      let formInline = formData;
      console.log(formData);
      // let formInline = deleteNull(formData);
      const url = "dataset/call_kw/ss.customer.analysis/write";
      let params = {
        args: [[Number(id)], formInline],
        kwargs: {},
        method: "write",
        model: "ss.customer.analysis"
      };
      return this.$http.odoo(url, params);
    },
    baseDtlData() {
      // 基础数据
      const list = [
        {
          key: "source",
          model: "ss.analysis.source",
          domain: []
        },
        {
          key: "series",
          model: "ss.analysis.series",
          domain: []
        },
        {
          key: "currency",
          model: "ss.analysis.currency",
          domain: []
        },
        {
          key: "category",
          model: "ss.sample.res.category",
          domain: []
        },
        {
          key: "customer",
          model: "res.partner",
          domain: ["&", ["customer", "=", true], ["is_company", "=", true]]
        },
        // {
        // 	key: 'supplier',
        // 	model: 'res.partner',
        //     domain: ["&", ["supplier", "=", true], ["is_company", "=", true]],
        // },
        {
          key: "material",
          model: "ss.sample.res.materia",
          domain: [["is_main", "=", true]]
        },
        {
          key: "material_tab",
          model: "ss.sample.res.materia",
          domain: [["is_assist", "=", true]]
        },
        {
          key: "material_not",
          model: "ss.sample.res.materia",
          domain: [["is_main", "=", false]]
        },
        {
          key: "material_tab_not",
          model: "ss.sample.res.materia",
          domain: [["is_assist", "=", false]]
        }
      ];
      this.$odoo.nameSearchList(list, post => {
        // console.log('post', post);
        post.map(item => {
          this[item.key] = item.data;
        });
        this.getDtl();
      });
    },
    /*supplierData(name) {
            	// 废弃
            	// console.log(name);
            	const model = 'res.partner';
            	const domain = [
                    "|",
                    ["name", "ilike", name],
                    ["full_name", "ilike", name],
                    ["supplier", "=", true],
                    ["is_company", "=", true],
                ];

            	// 方法一 model, domain, name
            	if (name !== '') {
            		this.loading = true;
            		this.customer = [];
                    this.$odoo.nameSearch(model, domain).then(res => {
                    	// console.log(res);
                    	this.loading = false;
                    	let Util = this.$odoo.Util;
                    	this.supplier = Util.arrayToJSON(res);
                    	// console.log('this.supplier', this.supplier);
                    });
                } else {
            		// 初始化
                    this.supplier = [];
                }
            },*/
    supplierDataAll() {
      // 方法二 model, fields, offset=0, limit, domain, sort
      const model = "res.partner";
      const fields = ["id", "name", "full_name"];
      const domain = [
        ["supplier", "=", true],
        ["is_company", "=", true],
        ["is_sample_stage", "=", true]
      ];
      this.$odoo.searchRead(model, fields, 0, 8000, domain, "").then(res => {
        this.supplier = res.records;
        // console.log('supplierDataAll', res);
      });
    },
    getCategoryMeasure(id) {
      const model = "ss.category.measure.rel";
      const fields = ["id", "long", "wide", "tall", "measure", "measure_id"];
      const domain = [["measure_id", "=", id]];
      this.$odoo.searchRead(model, fields, 0, 8000, domain, "").then(res => {
        this.categoryMeasure = res.records;
        // console.log('getCategoryMeasure', res);
      });
    },

    /** 快捷键 */
    handleKeyDown(e) {
      let key = e.keyCode || e.which || e.charCode;
      let ctrlKey = e.ctrlKey || e.metaKey;
      if (e.altKey && !ctrlKey) {
        if (key === 68) {
          // 编辑
          this.disabled = false;
        } else if (key === 83) {
          // 保存
          this.saveDtl();
        } else if (key === 88) {
          // 相关
          let relevance = this.formInline.relevance;
          this.formInline.relevance = !relevance;
        }
        e.preventDefault();
      }
    },
    handleKeyUp(e) {
      e.preventDefault();
    },
  },
  mounted() {
    this.init();
  },
  created() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  },
  destroyed() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }
};
</script>

<style lang="scss">
.analysis {
  textarea {
    color: #000 !important;
  }
  .ivu-form-item {
    margin-bottom: 12px !important;
  }
}
</style>

<style lang="scss" scoped>
.analysis {
  .head {
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 50px;
    position: fixed;
    .head-menus {
      position: relative;
      width: 100%;
      height: 50px;
      z-index: 1;
      text-align: right;
      background: #ffffff;
      box-shadow: 0 2px 3px 2px rgba(0, 0, 0, 0.1);
    }
  }
  .content {
    .main {
      display: flex;
      flex-wrap: wrap;
      margin: 70px auto 20px;
      /*max-width: 1440px;*/
      max-width: 1280px;
      min-width: 1024px;
      min-height: 500px;
      width: calc(100% - 40px);
      .view {
        width: 35%;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        border: 1px solid #e8e8e8;
        .view-msg {
          width: 100%;
          margin-bottom: 10px;
        }
        .view-main {
          position: relative;
          width: 100%;
          padding-top: 100%;
          border: 1px solid #e8e8e8;
          .view-main-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
        .view-list {
          width: 100%;
          padding: 10px;
          display: flex;
          min-height: 100px;
          flex-wrap: wrap;
          .view-item {
            width: 60px;
            height: 60px;
            cursor: pointer;
            margin-right: 8px;
            margin-bottom: 10px;
            border: 1px solid #e8e8e8;
            box-sizing: border-box;
            &.active,
            &:hover {
              border-color: #00b3ee;
            }
          }
        }
      }
      .picture-info {
        flex: 1;
        text-align: left;
        padding: 20px 10px;
        border: 1px solid #e8e8e8;
        border-left: none;
      }
      .discount-line {
        margin-top: 20px;
      }
    }
  }
}
</style>
