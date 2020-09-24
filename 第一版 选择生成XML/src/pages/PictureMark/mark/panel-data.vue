<template>
  <div class="mark-data-panel">
    <header class="">
      <div class="mark-data-tabs">
        <div
          class="mark-data-tab"
          v-for="(item, ind) in menus"
          :class="{ active: index === ind }"
          :key="ind"
          @click="setMenus(ind)"
          :title="item.type"
        >
          <div
            v-if="ind === 0"
            class="data-tab-bg"
            :style="{ transform: 'translateX(' + index + '00%)' }"
          ></div>
          <div
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent;"
          >
            {{ item.val }}
          </div>
        </div>
      </div>
    </header>

    <section class="">
      <div class="mark-data-query">
        <Input
          prefix="md-create"
          v-model="custom"
          placeholder="自定义"
          size="small"
          @on-enter="setContent()"
        />
      </div>
      <div class="mark-data-query last">
        <Input
          prefix="ios-search"
          v-model="query"
          placeholder="快速检索"
          size="small"
        />
      </div>

      <div class="mark-data-base">
        <div class="mark-data-list">
          <div
            class="mark-data-item"
            v-for="(val, key) in bases"
            @click="setContent(val, key)"
            v-show="
              val['cn'].toLowerCase().includes(query.toLowerCase()) ||
                val['en'].toLowerCase().includes(query.toLowerCase()) ||
                !query
            "
            :key="key"
            v-if="val[EnOrCn]"
            :title="val[lang]"
          >
            {{ val[EnOrCn] || "未定义" }}
          </div>
        </div>
      </div>

      <div class="mark-data-query">
        <div>
          <ColorPicker v-model="color2" size="small" @on-change="setDispose" />
        </div>
        <div>文字:</div>
        <div>
          <ColorPicker v-model="color" size="small" @on-change="setDispose" />
        </div>

        <div>
          <!--文字:-->
          <Select
            v-model="size"
            size="small"
            style="width:50px"
            @on-change="setDispose"
          >
            <Option v-for="item in sizes" :value="item" :key="item">{{
              item
            }}</Option>
          </Select>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "panel-data",
  props: ["EnOrCn"],
  data() {
    return {
      query: "",
      custom: "",
      initData: {},

      color: "#000",
      color2: "#000",

      size: 15,
      sizes: [10, 11, 12, 13, 15, 16, 18, 22, 24],

      index: 0,
      menus: [
        { key: "material", val: "材质", type: "arrow" },
        { key: "pro_size", val: "尺寸", type: "maxLength" },
        { key: "technics", val: "工艺", type: "arrow" }
      ],

      lang: "en",
      bases: {}
    };
  },
  mounted() {},
  watch: {
    EnOrCn() {
      this.setLang();
    }
  },
  methods: {
    init(data) {
      this.setLang();
      this.setDispose();
      this.setMenus(0, data || this.initData);
    },
    setLang() {
      this.lang = this.EnOrCn === "en" ? "cn" : "en";
    },
    setMenus(ind, data) {
      this.index = ind;
      if (data) this.initData = data;
      let item = this.menus[this.index];
      let $Mark = this.$parent.$refs["mark"];

      this.setBases(item.key);
      $Mark.setDrawData(item.type, "type");
    },
    setBases(key) {
      // console.log(this.initData, key);
      this.bases = this.initData[key] || {};
    },
    setDispose() {
      let $Mark = this.$parent.$refs["mark"];
      $Mark.setDrawData &&
        $Mark.setDrawData(
          {
            size: this.size,
            color: this.color,
            nodeColor: this.color2
          },
          "config"
        );
    },
    setContent(item = {}, key) {
      // console.log(item, key)
      let text = item[this.EnOrCn];
      let $Mark = this.$parent.$refs["mark"];
      $Mark.editTextEvent &&
        $Mark.editTextEvent({
          content: text || this.custom || "未定义",
          contentI: key || "自定义",
          contentT: this.menus[this.index].key
        });
    }
  }
};
</script>

<style lang="scss">
@mixin fontHide {
  overflow: hidden; /*超出部分隐藏*/
  white-space: nowrap; /*内容超宽后禁止换行显示*/
  text-overflow: ellipsis; /*文字超出部分以省略号显示*/
}

.mark-data-panel {
  width: 100%;
  height: 100%;
  border-right: 1px solid #dedee4;
  /* tab */
  header {
    background: #afb7bf;
    background: rgb(242, 243, 244);
    .mark-data-tabs {
      height: 32px;
      display: flex;
      padding: 7px 5px 0;
      overflow: hidden;
      align-items: center;
      /*justify-content: space-around;*/
      .mark-data-tab {
        position: relative;
        flex: 1;
        height: 100%;
        padding: 0 6px;
        cursor: pointer;
        font-size: 14px;
        line-height: 25px;
        transition: all 0.3s;
        border-radius: 3px 3px 0 0;
        @mixin tab-hover {
          color: red;
          background: #ffffff;
        }
        .data-tab-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          border-radius: 3px 3px 0 0;
          transition: all 0.3s ease-in-out 0s;
        }
        &.hover {
          @include tab-hover;
        }
        &.active {
          @include tab-hover;
        }
        .data-tab-bg {
          @include tab-hover;
        }
      }
    }
  }

  /* content */
  section {
    padding-left: 8px;
    height: calc(100% - 32px);
    .mark-data-query {
      padding: 10px;
      display: flex;
      line-height: 24px;
      justify-content: space-between;
      border-bottom: 1px solid #dedee4;
      &.last {
        border-bottom-color: transparent;
        /*margin-bottom: 8px;*/
      }
      &:last-child {
        border-bottom: none;
        border-top: 1px solid #dedee4;
      }
    }

    .mark-data-base {
      height: calc(100% - 135px);
      position: relative;
      overflow-y: scroll;
      .mark-data-list {
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        position: absolute;
        .mark-data-item {
          cursor: pointer;
          @include fontHide;
          width: (100% / 2);
          margin-bottom: 5px;
          box-sizing: border-box;
          border-right: 1px solid #dedee4;
          &:nth-child(2n) {
            border-width: 0;
          }
          &:hover {
            color: #2b85e4;
          }
        }
      }
    }
  }
}
</style>
