<template>
  <!--基础信息编辑-->
  <Modal
    title="基础数据编辑"
    v-model="basicsShow"
    :styles="{ top: '220px', width: '410px' }"
    class-name="vertical-center-modal"
  >
    <Form
      ref="basics"
      class="tag-image-add"
      :model="basicsFrom"
      :label-width="90"
      :rules="ruleCustom"
    >
      <FormItem label="审批" class="add-form-item">
        <RadioGroup v-model="isTrial">
          <Radio label="1">不跳过</Radio>
          <Radio label="0">跳过(工厂选样、取货号)</Radio>
        </RadioGroup>
      </FormItem>

      <FormItem label="系列" prop="series_id" class="add-form-item">
        <Cascader
          :data="initData['series']"
          v-model="basicsFrom['series_id']"
          filterable
        ></Cascader>
      </FormItem>

      <FormItem label="大类" prop="category_id" class="add-form-item">
        <Cascader
          :data="initData['category']"
          v-model="basicsFrom['category_id']"
          filterable
        ></Cascader>
      </FormItem>

      <FormItem label="客户" prop="customer_id" class="add-form-item">
        <Select v-model="basicsFrom['customer_id']">
          <Option
            v-for="(val, key) in initData['customer']"
            :key="key"
            :value="key"
            >{{ val }}</Option
          >
        </Select>
      </FormItem>

      <FormItem label="外部设计师" prop="out_designer_id" class="add-form-item">
        <Select v-model="basicsFrom['out_designer_id']">
          <Option
            v-for="(val, key) in initData['out_designer']"
            :key="key"
            :value="key"
            >{{ val }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="内部设计师" prop="in_designer_id" class="add-form-item">
        <Select v-model="basicsFrom['in_designer_id']">
          <Option
            v-for="(val, key) in initData['in_designer']"
            :key="key"
            :value="key"
            >{{ val }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="原创人" prop="copyright" class="add-form-item">
        <Select v-model="basicsFrom['copyright']">
          <Option
            v-for="(val, key) in initData['all_designer']"
            :key="key"
            :value="key"
            >{{ val }}</Option
          >
        </Select>
      </FormItem>

      <FormItem label="原始货号" prop="old_pro_no" class="add-form-item">
        <Input
          :disabled="isChecker"
          v-model="basicsFrom.old_pro_no"
          placeholder="没有不填"
        />
      </FormItem>

      <FormItem>
        <Button type="primary" @click="basicsSure('basics')">提交</Button>
        <Button style="margin-left: 8px" @click="basicsCancel">取消</Button>
      </FormItem>
    </Form>
    <div slot="footer">
      <p style="color: red">注：编辑后无法修改，请仔细填写！</p>
      <!--<Button type="primary" @click="basicsSure('basics')">提交</Button>-->
      <!--<Button style="margin-left: 8px" @click="basicsCancel">取消</Button>-->
    </div>
  </Modal>
</template>

<script>
/**
 * refs.openBasicsEdit(id) 打开编辑
 * @successCb 成功回调
 * */
export default {
  name: "addBaseData",
  props: ["initData"],
  methods: {
    // post
    addBaseData() {
      // 保存基础数据
      let form = this.basicsFrom;
      let url = "ss_sample/tag_image/complete";
      let isTrial = this.isTrial === "1" ? false : true;
      let basicsFrom = {
        direct_approval: isTrial
      };
      for (let key in form) {
        let item = form[key];
        if (key === "series_id" || key === "category_id") {
          let len = item.length - 1;
          basicsFrom[key] = item[len];
        } else if (key === "old_pro_no") {
          if (item === "") continue;
          basicsFrom[key] = item;
        } else {
          basicsFrom[key] = Number(item);
        }
      }
      let params = {
        array_id: this.ids,
        base_data: basicsFrom,
        batch_flag: this.isChecker
      };
      this.$http.odoo(url, params).then(
        res => {
          this.basicsCancel();
          form.old_pro_no = "";
          let json = JSON.stringify(form);
          localStorage.setItem("basicsFrom", json);
          this.$parent.$refs["TagList"].getData();
        },
        rej => {
          this.$Message.error("添加数据失败！", rej);
        }
      );
    },
    //
    basicsSure(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.addBaseData();
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    basicsCancel() {
      this.getBasicsFrom();
      this.basicsShow = false;
    },
    getBasicsFrom() {
      let basicsFrom = localStorage.getItem("basicsFrom");
      basicsFrom = JSON.parse(basicsFrom) || null;
      this.basicsFrom = basicsFrom || {
        series_id: [],
        category_id: [],
        customer_id: 0,
        in_designer_id: 0,
        out_designer_id: 0,
        old_pro_no: ""
      };
    },
    openBasicsEdit(ids, bool) {
      this.ids = ids;
      this.getBasicsFrom();
      this.isChecker = bool;
      this.basicsShow = true;
    }
  },
  mounted() {
    this.getBasicsFrom();
  },
  data() {
    const validateOld = function(rule, value, callback) {
      if (value.split("R").length > 2) {
        callback(new Error('Illegal string "R" detected!'));
      } else {
        callback();
      }
    };
    return {
      ids: null, // id 集合
      isTrial: "1", // 是否审核
      isChecker: false, // 是否批量
      basicsShow: false, // 是否展示

      basicsFrom: {
        series_id: [],
        category_id: [],
        customer_id: 0,
        in_designer_id: 0,
        out_designer_id: 0,
        copyright: 0,
        old_pro_no: ""
      },
      ruleCustom: {
        old_pro_no: [
          {
            validator: validateOld,
            trigger: "blur"
          }
        ],
        series_id: [
          {
            min: 1,
            type: "array",
            required: true,
            message: "请选择系列",
            trigger: "change"
          }
        ],
        category_id: [
          {
            min: 1,
            type: "array",
            required: true,
            message: "请选择大类",
            trigger: "change"
          }
        ],
        customer_id: [
          {
            required: true,
            message: "请选择客户",
            trigger: "change"
          }
        ],
        in_designer_id: [
          {
            required: true,
            message: "请选择内部设计师",
            trigger: "change"
          }
        ],
        out_designer_id: [
          {
            required: true,
            message: "请选择外部设计师",
            trigger: "change"
          }
        ],
        copyright: [
          {
            required: true,
            message: "请选择原创人",
            trigger: "change"
          }
        ]
      }
    };
  }
};
</script>

<style scoped>
.add-form-item {
  width: 320px;
  margin-bottom: 10px;
}
</style>
