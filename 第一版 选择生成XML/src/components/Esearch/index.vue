<template>
  <div class="erp-search-form">
    <div v-show="vagueShow">
      <Input
        v-model="searchVal"
        :title="vagueListVal"
        :placeholder="vagueListVal"
        style="width: 220px"
      />
      <DatePicker
        v-show="this.frame.key"
        type="daterange"
        :clearable="false"
        :value="searchDate"
        placeholder="请选择时间范围"
        style="width: 200px"
      >
      </DatePicker>
      <Button icon="md-search" @click.native="vagueSearch"></Button>
      <Button
        icon="md-arrow-down"
        v-show="!seniorShow"
        @click.native="seniorShow = true"
      ></Button>
      <Button
        icon="md-arrow-up"
        v-show="seniorShow"
        @click.native="seniorShow = false"
      ></Button>
      <Button icon="md-close" @click.native="clearSearch"></Button>
    </div>
    <transition>
      <div v-show="seniorShow" style="display: flex;">
        <E-form
          v-for="item in seniorList"
          :key="item.key"
          :ref="'form-item-' + item.key"
          :item="item"
          v-show="!item.hide"
        ></E-form>
        <Button
          type="info"
          icon="ios-search"
          style="margin-left: 10px; margin-top: 10px;"
          @click="seniorSearch"
          >高级搜索</Button
        >
        <Button
          type="error"
          style="margin-left: 10px; margin-top: 10px;"
          @click.native="clearSearch"
          >清空</Button
        >
      </div>
    </transition>
  </div>
</template>

<script>
/**
 * 查询模块
 * 一、供外部使用的函数
 * setFrame 设置当前过滤时间初始值(timeStar, timeEnd)
 * getFrame 获取当前时间过滤条件(key: String, times: [timeStar, timeEnd])
 * 二、需要绑定的数据（函数）
 * :InitData={导入搜索数据}
 * :getInitData="数据请求函数"
 * @getFilters="函数(filters: Array, groupOp: String)"
 * uiType: [text, select, date, datetime, daterange, number, decimal, childCust, mainCust]
 * 三、更新
 * 12.26号 为每个表单都增加一个控制显示隐藏的数据 hide = false
 * 05.27号 为每个表单增加一个样式控制字段 style = {}
 * 07.24号 新增 stageSelect UI类型； 同时 InitData 数据中增加一个 keys字段 数组 用来为多级下拉对应多个搜索条件
 * */
export default {
  name: "indexCopy",
  data() {
    return {
      filters: [],

      vagueShow: true,
      seniorShow: false,

      frame: {},
      searchVal: "",
      vagueList: [],
      searchDate: [],
      seniorList: []
    };
  },
  props: ["InitData", "getInitData"], //获取初始化数据'frame', 'vagueList', 'seniorList'
  computed: {
    vagueListVal() {
      let val = [];
      this.vagueList.forEach(item => {
        val.push(item.label);
      });
      return "请搜索" + val.join("、") + "...";
    }
  },
  mounted() {
    this.getData();
    this.setFrame("2019-08-01", new Date());
  },
  methods: {
    //数据源
    getData() {
      const orderRes = res => {
        this.vagueList = res.likeQueryList;
        this.seniorList = res.quickQueryList;
        this.frame = res.baseQueryList[0] || {};
        if (this.vagueList.length === 0) {
          this.seniorShow = true;
          this.vagueShow = false;
        }
      };
      if (this.getInitData) {
        this.getInitData().then(res => {
          orderRes(res["queryVo"]);
        });
      } else {
        if (this.InitData) {
          orderRes(this.InitData);
        } else {
          //没搜索条件
        }
      }
    },
    // 清空
    clearSearch() {
      this.filters = [];
      this.searchVal = "";
      this.seniorList.forEach(item => {
        let key = "form-item-" + item.key;
        this.$refs[key][0].init();
      });
    },
    // 设置时间范围-暂时只设置模糊搜索范围(格式：YYYY-MM-DD)
    setFrame(timeStar, timeEnd) {
      this.searchDate = [timeStar, timeEnd];
    },
    // 返回时间范围条件
    getFrame(key, times) {
      if (!isArray(times) || times.length !== 2) return;
      let star = times[0].format ? times[0].format("yyyy-MM-dd") : times[0];
      let end = times[1].format ? times[1].format("yyyy-MM-dd") : times[1];
      return [
        {
          op: "ge",
          data: star + "T00:00:00.000Z",
          field: key
        },
        {
          op: "le",
          data: end + "T23:59:59.000Z",
          field: key
        }
      ];
    },
    //搜索-模糊
    vagueSearch() {
      if (this.searchVal === "") return;
      let dateFilters = this.getFrame(this.frame.key, this.searchDate);
      this.filters = this.vagueList.map(item => {
        let filter = {};
        filter.field = item.key;
        filter.data = this.searchVal;
        filter.op = filter.data.indexOf(",") > -1 ? "in" : "cn";
        return filter;
      });
      this.filters.push(...dateFilters);
      this.$emit("getFilters", this.filters, "or");
    },
    //搜索-高级
    seniorSearch() {
      this.filters = [];
      this.seniorList.forEach(item => {
        let filter = {};
        let filters = [];
        filter.field = item.key;
        let key = "form-item-" + item.key;
        let val = this.$refs[key][0].get();
        if (
          item.uiType == "mainCust" ||
          isNull(val) ||
          (isNull(val[0]) && val instanceof Array)
        )
          return;
        switch (item.uiType) {
          case "childCust":
            this.custIdComput(val, this.$refs[key][0]);
            break;
          case "text":
            filter.op = val.indexOf(",") > -1 ? "in" : "cn";
            filter.data = val;
            this.filters.push(filter);
            break;
          case "multSelect":
            if (val.length === 1) {
              filter.op = "eq";
              filter.data = val[0];
              this.filters.push(filter);
            } else {
              filter.op = "in";
              filter.data = val.join(",");
              this.filters.push(filter);
            }
            break;
          case "stageSelect":
            if (item.keys) {
              val.forEach((oneItem, ind) => {
                this.filters.push({
                  field: item.keys[ind],
                  op: "eq",
                  data: oneItem
                });
              });
            } else {
              this.filters.push({
                field: item.key,
                op: "eq",
                data: val[val.length - 1]
              });
            }
            break;
          case "date":
            filters = this.getFrame(item.key, [val, val]);
            this.filters = this.filters.concat(filters);
            break;
          case "datetime":
            filter.op = "eq";
            filter.data = val.format("yyyy-MM-dd hh:mm:ss");
            this.filters.push(filter);
            break;
          case "daterange":
            filters = this.getFrame(item.key, val);
            this.filters = this.filters.concat(filters);
            break;
          // case 'number':
          //   filter.op = 'eq';
          //   filter.data = val;
          //   this.filters.push(filter);
          //   break;
          // case 'decimal':
          //   filter.op = 'eq';
          //   filter.data = val;
          //   this.filters.push(filter);
          //   break;
          default:
            // TODO sglSelect number decimal
            filter.op = "eq";
            filter.data = val;
            this.filters.push(filter);
            break;
        }
      });
      this.$emit("getFilters", this.filters, "and");
    },
    //辅助函数
    custIdComput(value, $el) {
      // 客户数据整理
      if (value === "all") {
        let selects = $el.custIdList_all[0]["data"];
        if (selects.father.length) {
          selects.father.forEach(key => {
            let childrens = $el.custIdList_fathers[key]["children"];
            for (let k in childrens) {
              selects.son.push(k);
            }
          });
        }
        let datas = Array.from(new Set([...selects.son]));
        this.filters.push({
          op: "in",
          field: "custRelId",
          data: datas.join(",")
        });
      } else if (value && this.custIdList_sons[value]) {
        this.filters.push({
          op: "eq",
          field: "custRelId",
          data: value
        });
      } else if (value && this.custIdList_fathers[value]) {
        this.filters.push({
          op: "eq",
          field: "custId",
          data: value
        });
      }
    }
  }
};
</script>

<style scoped>
.erp-search-form {
  text-align: left;
  padding: 10px 0px;
}
</style>
