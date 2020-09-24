<template>
  <div class="PictureTagList">
    <V-addBase ref="addBase" :initData="initData"></V-addBase>
    <pictureTemp
      ref="TagList"
      :goods="goods"
      :buttons="buttons"
      :initSearch="initSearch"
      :isMultiple="'isMultiple'"
      @getGoodsPost="getGoodsPost"
    >
      <!-- 上传 -->
      <E-upload slot="menu"></E-upload>
      <!-- 操作 -->
      <template slot="item" slot-scope="props">
        <!--
          2020.06.22：修改标注的状态、状态查询、按钮显示控制

          props.goods.status
            0: 上传原图
            1: 完善基础数据

          props.goods.approve_status
            0: 草拟
            1: 英文提交
            2: 中文提交
            99: 作废

          props.goods.filter_status
            wait_number-待取货号;
            not_en_tag-英文未标注;
            not_cn_tag-中文未标注;
            en_wait_submit-英文档待提交;
            cn_wait_submit-中文档待提交;
            invalid-已作废;

          英文
            type: (props.goods.approve_status !== 0) ? 'success' : 'info'
            v-if: props.goods.status && props.goods.approve_status !== 99

          中文
            type: (props.goods.approve_status === 2) ? 'success' : 'info'
            v-if: props.goods.status && props.goods.approve_status !== 99


        !-->
        <Button
          size="large"
          title="勾选"
          :type="props.goodsCheck ? 'success' : 'primary'"
          @click.stop="$refs['TagList'].checkOne(props['ind'])"
          :icon="props.goodsCheck ? 'ios-checkmark-circle' : 'md-add-circle'"
          v-if="!props.goods.status && props.goods.approve_status !== 99"
          >勾选</Button
        >

        <Button
          size="large"
          title="180°"
          type="primary"
          icon="md-refresh"
          class="picture-rotate"
          @click="rotateClick(props.goods, props['ind'])"
          v-if="!props.goods.status && props.goods.approve_status !== 99"
          >180°</Button
        >

        <Button
          size="large"
          title="基础"
          type="info"
          icon="md-create"
          @click="openBasicsEdit(props.goods)"
          v-if="!props.goods.status && props.goods.approve_status !== 99"
          >基础</Button
        >

        <Button
          size="large"
          title="英文"
          icon="ios-image"
          @click="toTaggingPage(props.goods, 'en')"
          :type="(props.goods.approve_status !== 0) ? 'success' : 'info'"
          v-if="props.goods.status && props.goods.approve_status !== 99"
          >英文</Button
        >

        <Button
          size="large"
          title="中文"
          icon="ios-image"
          @click="toTaggingPage(props.goods, 'cn')"
          :type="(props.goods.approve_status === 2) ? 'success' : 'info'"
          v-if="props.goods.status && props.goods.approve_status !== 99"
          >中文</Button
        >

        <Button
          size="large"
          title="作废"
          type="warning"
          icon="md-trash"
          @click="deletePicture(props.goods)"
          v-if="[0, 1, 2].indexOf(props.goods.approve_status) > -1"
          >作废</Button
        >

        <Button
          size="large"
          title="已作废"
          type="info"
          icon="md-lock"
          disabled
          long
          v-if="props.goods.approve_status === 99"
          >已作废</Button
        >

        <Button
          size="large"
          title="已下单"
          type="error"
          icon="logo-usd"
          v-if="props.goods['flow_status']"
          >已下单</Button
        >
      </template>
    </pictureTemp>
  </div>
</template>

<script>
// import Rotate from './views/pictureRoate';
// import upload from '../../components/Eupload/index';
import pictureTemp from "../../views/VpictureTemp";
import Upload from "./views/uploadBaseImg";
import addBase from "./views/addBaseData";
export default {
  name: "PictureTagList",
  components: {
    "E-upload": Upload,
    "V-addBase": addBase,
    pictureTemp: pictureTemp
  },
  methods: {
    init() {
      this.getInitPost();
    },
    // POST
    taggingEdit(id, ind, file, base64) {
      // 修改原图
      let form = new FormData();
      form.append("id", id);
      form.append("file", file);
      let url = "ss_sample/tag_image/update_image_src";
      this.$http.fileUpLoad(url, form).then(res => {
        // let src = res.data.url;
        this.$set(this.goods[ind], "url", base64);
      });
    },
    taggingDelete(id) {
      // 作废
      let url = "ss_sample/tag_image/approve_action";
      let param = { id, approve_type: "invalid" };
      this.$http.odoo(url, param).then(res => {
        this.$refs["TagList"].getData();
      });
    },
    getInitPost() {
      // 基础数据
      this.initData = {};
      let url = "ss_sample/tag_image/init_data_base";
      this.$http.odoo(url, {}).then(res => {
        this.initData = res;
        let keys = {
          //数据表键值 ： initData 键值
          customer_id: "customer",
          series_id: "series",
          category_id: "category",
          in_designer_id: "q_in_designer",
          out_designer_id: "q_out_designer",
          create_uid: "upload_people",
          status: "tag_status"
        };
        let list = this.initSearch.quickQueryList;

        // 删除过滤字段 | 若需要自定义查询、删除该字段、
        // 并定义 quickQueryList 中的 valuesMap、与 comDomain 中的策略
        delete res['filter_status'];
        list.forEach((item, ind) => {
          let key = keys[item.key] || item.key;
          if (res[key]) {
            this.$set(list[ind], "valuesMap", res[key]);
          }
        });
      });
    },
    getGoodsPost(params) {
      // 列表数据
      this.goods = [];
      let url = "dataset/search_read";
      let post = this.comDomain(params);
      this.$http.odoo(url, post).then(res => {
        let list = this.$refs["TagList"];
        list.total = res.length;
        if (!res.length) return;
        this.goods = res.records.map(item => {
          return {
            id: item["id"],
            url: item["img_src"],
            title: item["name"],
            name: item["create_uid"][1],
            type: item["customer_id"][1],

            size: item["in_designer_id"][1],
            time: item["out_designer_id"][1],

            status: item["status"],
            operatorTag: item["operator_tag"],
            imageEnPath: item["image_en_path"],
            imageCnPath: item["image_cn_path"],
            approve_status: item["approve_status"]
          };
        });
      });
    },
    //
    comDomain(params) {
      // 转换新的分页参数
      let domain = [];
      let filters = params.filters;
      let fields = [
        "name",
        "img_src",
        "customer_id",
        "status",
        "filter_status",
        "approve_status",
        "create_date",
        "create_uid",
        "image_en_path",
        "image_cn_path",
        "in_designer_id",
        "out_designer_id",
        "flow_status"
      ];
      let offset = params.page - 1 === 0 ? 0 : (params.page - 1) * params.rows;
      for (let i = 0, len = filters.length; i < len; i++) {
        let item = filters[i];
        if (item.field === "filter_status") {
          switch (item.data) {
            case "1":
              // 待取货号
              domain.push(["status", "=", 0]);
              domain.push(["approve_status", "not in", [99]]);
              break;
            case "2":
              // 待标英文
              domain.push(["status", "in", [1, 3]]);
              domain.push(["image_en_path", "=", false]);
              domain.push(["approve_status", "not in", [99]]);
              break;
            case "3":
              // 待标中文
              domain.push(["status", "in", [1, 2]]);
              domain.push(["image_cn_path", "=", false]);
              domain.push(["approve_status", "not in", [2, 99]]);
              break;
            case "4":
              // 待提交
              domain.push(["approve_status", "=", 0]);
              domain.push(["image_cn_path", "=", true]);
              break;
            case "5":
              // 待审核
              domain.push(["approve_status", "=", 1]);
              break;
            case "6":
              // 已审核
              domain.push(["approve_status", "=", 2]);
              break;
            case "7":
              // 已作废
              domain.push(["approve_status", "=", 99]);
              break;
            default:
              // 按字段查询
              domain.push([item.field, "ilike", item.data]);
              break;
          }
        } else if (
          item.field === "in_designer_id" ||
          item.field === "out_designer_id"
        ) {
          if (item.data.indexOf(",") > -1) {
            let ids = item.data.split(",");
            ids = ids.map(val => {
              return Number(val) || val;
            });
            domain.push([item.field, "in", ids]);
          } else {
            domain.push([item.field, "=", Number(item.data)]);
          }
        } else {
          switch (item.op) {
            case "eq":
              let data = Number(item.data) || item.data;
              domain.push([item.field, "=", data]);
              break;
            case "cn":
              domain.push([item.field, "ilike", item.data]);
              break;
            case "ge":
              domain.push([item.field, ">=", item.data]);
              break;
            case "le":
              domain.push([item.field, "<=", item.data]);
              break;
            default:
              break;
          }
        }
      }
      let post = {
        model: "ss.sample.tag.image",
        fields: fields,
        offset: offset, // star
        limit: params.rows, // max end
        domain: domain,
        // sort: 'create_date desc',
        sort: "batch_no desc,sort_num asc"
      };
      return post;
    },
    /**  event  */
    rotateClick(goods, ind) {
      let Img = new _IMG({ url: goods.url });
      Img.imageRotate(180);
      Img.imageDom(goods.url)
        .then(myImg => {
          return Img.imageBase64(myImg);
        })
        .then(base64 => {
          Img.imageToFile(base64).then(file => {
            let id = goods.id;
            this.taggingEdit(id, ind, file, base64);
          });
        });
    },
    openBasicsEdit(goods) {
      // 打开编辑
      let add = this.$refs["addBase"];
      let list = this.$refs["TagList"];
      if (goods) {
        let id = goods.id;
        add.openBasicsEdit([id], false);
      } else {
        let ids = [];
        let checks = list.getChecks();
        checks.filter(item => {
          // 符合勾选条件
          if (item.status === 0) {
            ids.push(item.id);
          }
          return item.status === 0;
        });
        if (!ids.length) {
          this.$Message.warning("请先勾选需要操作的图片!");
          return;
        }
        add.openBasicsEdit(ids, true);
      }
    },
    toTaggingPage(goods, type) {
      // debugger
      console.log(goods.status && goods.approve_status !== 99);
      // return
      // 打开详情页面 下发样品单后仍然可以修改
      if (!goods.status) {
        this.$Message.warning("请先补充基础数据再进行编辑!");
        return;
      }
      let routeData = this.$router.resolve({
        path: "/PictureMarkItem",
        query: {
          id: goods.id,
          type: type,
          uid: Zero.GetQueryString('uid'),
        }
      });
      // window.open(routeData.href, '_self');
      window.open(routeData.href, "_blank");
    },
    deletePicture(goods) {
      // 作废
      this.$Modal.confirm({
        title: "作废图片！",
        content: "是否确定作废该图片！",
        closable: true,
        onOk: () => {},
        okText: "取消",
        onCancel: () => {
          this.taggingDelete(goods.id);
        },
        cancelText: "作废"
      });
    }
  },
  data() {
    return {
      params: {},
      initData: {},
      isMultiple: true,

      goods: [],
      buttons: {
        show: true,
        btnList: [
          {
            key: "refresh",
            name: "刷新页面",
            method: function() {
              this.getData();
              // this.getInit();
            }
          }
        ],
        businessList: [
          {
            key: "refresh",
            name: "完善基础",
            method: this.openBasicsEdit
          }
        ],
        hasPowerList: []
      },
      initSearch: {
        baseQueryList: [],
        likeQueryList: [],
        quickQueryList: [
          {
            key: "name",
            label: "货号",
            uiType: "text",
            valuesMap: {},
            style: {
              width: "180px"
            }
          },
          {
            key: "customer_id",
            label: "客户",
            uiType: "sglSelect",
            valuesMap: {},
            style: {
              width: "90px"
            }
          },
          {
            key: "series_id",
            label: "系列",
            uiType: "stageSelect",
            valuesMap: [],
            style: {
              width: "220px"
            }
            // keys: ['seriesFirstLevel', 'seriesSecondLevel', 'seriesThreeLevel'],
          },
          {
            key: "category_id",
            label: "大类",
            uiType: "stageSelect",
            valuesMap: []
            // keys: ['seriesFirstLevel', 'seriesSecondLevel', 'seriesThreeLevel'],
          },
          {
            key: "out_designer_id",
            label: "外部设计师",
            uiType: "sglSelect",
            valuesMap: {}
          },
          {
            key: "in_designer_id",
            label: "内部设计师",
            uiType: "sglSelect",
            valuesMap: {}
          },
          {
            key: "create_uid",
            label: "上传人",
            uiType: "sglSelect",
            valuesMap: {}
          },
          {
            key: "filter_status",
            label: "图片状态",
            uiType: "sglSelect",
            valuesMap: {
              wait_number: "待取货号",
              not_en_tag: "待标英文",
              not_cn_tag: "待标中文",
              en_wait_submit: "英文待提交",
              cn_wait_submit: "中文待提交",
              invalid: "已作废"
              // 2020.06.22 标注状态更改
              // 1: "待取货号",
              // 2: "待标英文",
              // 3: "待标中文",
              // 4: "待提交",
              // 5: "待审核",
              // 6: "已审核",
              // 7: "已作废"
            },
            style: {
              width: "180px"
            }
          },
          {
            key: "create_date",
            label: "上传时间范围",
            uiType: "daterange"
          }
        ]
      }
    };
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped></style>
