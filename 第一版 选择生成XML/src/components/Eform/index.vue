<template>
  <div
    class="erp-form-item"
    :class="item.uiType"
    v-show="item.uiType != 'mainCust'"
    :style="item.style || {}"
  >
    <!--文本-->
    <template v-if="item.uiType === 'text'">
      <Input v-model="text" clearable :placeholder="item.label" />
    </template>
    <!--单选搜索下拉sglSelect-->
    <template v-else-if="item.uiType === 'sglSelect'">
      <Select v-model="text" clearable filterable :placeholder="item.label">
        <Option
          v-for="(val, key) in item['valuesMap']"
          :value="key"
          :key="key"
          >{{ val }}</Option
        >
      </Select>
    </template>
    <!--多选搜索下拉multSelect-->
    <template v-else-if="item.uiType === 'multSelect'">
      <Select
        v-model="array"
        clearable
        filterable
        multiple
        :placeholder="item.label"
      >
        <Option
          v-for="(val, key) in item['valuesMap']"
          :value="key"
          :key="key"
          >{{ val }}</Option
        >
      </Select>
    </template>
    <!--多级搜索下拉stageSelect-->
    <template v-else-if="item.uiType === 'stageSelect'">
      <Cascader
        :data="item['valuesMap']"
        v-model="array"
        filterable
        change-on-select
        :placeholder="item.label"
      ></Cascader>
    </template>
    <!--整数、小数（包含整数）-->
    <template v-else-if="item.uiType === 'number' || item.uiType === 'decimal'">
      <InputNumber
        clearable
        v-model="number"
        @on-change="numberChange($event)"
        :placeholder="item.label"
      ></InputNumber>
    </template>
    <!--日期、日期时间、日期范围、-->
    <template v-else-if="item.uiType === 'date' || item.uiType === 'datetime'">
      <DatePicker
        clearable
        :type="item.uiType"
        :placeholder="item.label"
        v-model="text"
        @on-change="dateRangeChange($event)"
      ></DatePicker>
    </template>
    <template v-else-if="item.uiType === 'daterange'">
      <DatePicker
        clearable
        type="daterange"
        :placeholder="item.label"
        v-model="date"
        @on-change="dateRangeChange($event)"
      ></DatePicker>
    </template>
    <!--特殊客户下拉选择-->
    <template v-else-if="item.uiType === 'childCust'">
      <Select
        v-model="text"
        remote
        clearable
        filterable
        placeholder="客户"
        :remote-method="queryChange"
        :loading="custIdList_state"
      >
        <OptionGroup label="模糊匹配" v-show="custIdList_all.length > 0">
          <Option
            v-for="(item, ind) in custIdList_all"
            :value="item.id"
            :key="ind"
            >{{ item.label }}</Option
          >
        </OptionGroup>
        <OptionGroup label="主客户" v-show="custIdList_father.length > 0">
          <Option
            v-for="(item, ind) in custIdList_father"
            :value="item.id"
            :key="ind"
            >{{ item.label }}</Option
          >
        </OptionGroup>
        <OptionGroup label="分客户" v-show="custIdList_son.length > 0">
          <Option
            v-for="(item, ind) in custIdList_son"
            :value="item.id"
            :key="ind"
            >{{ item.label }}</Option
          >
        </OptionGroup>
      </Select>
    </template>
  </div>
</template>

<script>
/**
 * 2019.03.29 版本: 0.O.1
 *
 * @param uiType: [text-文本 下拉 sglSelect multSelect date-日期 datetime-日期时间 dateRange-日期范围 number-整数 decimal-小数]
 * item: {
 *  key: '',        //键
 *  label: '',      //文本说明
 *  uiType: '',     //表单类型
 *  valuesMap: '',  //下拉数据
 *  style: {},      //样式控制
 *  initData: null, //初始化数据
 * }
 *
 * 考虑更名：E-form-item ？
 * 2019。7。24 增加三级联动表单
 *
 * */
export default {
  data() {
    return {
      key: "",
      text: "",
      date: null,
      array: [],
      number: 0,

      outData: null,

      //查询相关
      seniorShow: false,
      custIdList_state: false,
      // custIdList_val: '',
      custIdList_son: {}, //分客户
      custIdList_all: {}, //全部客户
      custIdList_father: {}, //主客户
      custIdList_sons: {}, //分客户
      custIdList_fathers: {} //主客户
    };
  },
  mounted() {
    this.init();
  },
  name: "E-formItem",
  props: ["item"],
  methods: {
    get() {
      let val = this[this.key];
      return val || null;
    },
    // set(val) {},
    init() {
      this.text = "";
      this.array = [];
      this.number = 0;
      this.date = null;
      this.computedKey();
    },
    check() {},
    //辅助函数
    computedKey() {
      let type = this.item.uiType;
      if (type == "daterange") {
        // || type == 'datetime' || type == 'date'
        this.key = "date";
      } else if (type == "decimal" || type == "number") {
        this.key = "number";
      } else if (type == "multSelect" || type == "stageSelect") {
        this.key = "array";
      } else if (type == "childCust") {
        this.searchDataInit();
      } else {
        this.key = "text";
      }
    },
    // numberChange(event) {},
    // dateRangeChange(val) {},
    //客户搜索-搜索词发生改变
    queryChange(query) {
      if (query !== "" && this.text == "") {
        this.custIdList_val = "";
        this.custIdList_all = [];
        this.custIdList_son = [];
        this.custIdList_father = [];
        let that = this;
        let list = {
          son: [],
          father: []
        };
        query = query.toUpperCase();
        that.custIdList_state = true;
        setTimeout(() => {
          for (let key in that.custIdList_fathers) {
            let item = that.custIdList_fathers[key];
            if (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              this.custIdList_father.push(item);
              list.father.push(item.id);
            }
          }
          for (let key in that.custIdList_sons) {
            let item = that.custIdList_sons[key];
            if (item.label.toLowerCase().indexOf(query.toLowerCase()) > -1) {
              this.custIdList_son.push(item);
              list.son.push(item.id);
            }
          }
          if (list.son.length && list.father.length) {
            that.custIdList_all = [
              {
                label: query + "全部",
                data: list,
                id: "all"
              }
            ];
          }
          that.custIdList_state = false;
        }, 20);
      }
    },
    //客户数据整理
    searchDataInit() {
      for (let key in this.item["valuesMap"]) {
        let it = this.item["valuesMap"][key];
        this.custIdList_fathers[it.id] = {
          id: it.id,
          key: "custId",
          label: key,
          children: it["childMap"]
        };
        for (let k in it["childMap"]) {
          let val = it["childMap"][k];
          this.custIdList_sons[k] = {
            id: k,
            key: "custRelId",
            label: val
          };
        }
      }
    }
    //
  }
};
</script>

<style scoped>
.erp-form-item {
  display: inline-block;
  margin-top: 10px;
  margin-right: 5px;
}
.erp-form-item .text {
  width: 100px;
}
.erp-form-item .date,
.erp-form-item .datetime,
.erp-form-item .daterange {
  width: 200px;
}
</style>
