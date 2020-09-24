<template>
  <div class="picture-list-wrapper">
    <header class="picture-list-head">
      <div class="picture-list-menu">
        <slot name="menu"></slot>
        <E-size @getMenuInfo="getCardClass"></E-size>
        <E-button
          class="picture-list-btn"
          v-show="buttons.show"
          :isStyle="false"
          :menuList="buttons.businessList"
          :btnList="[...btnList, ...buttons.btnList]"
          :hasPowerList="[...hasPowerList, ...buttons.hasPowerList]"
        ></E-button>
      </div>
      <div class="picture-list-search">
        <E-search :InitData="initSearch" @getFilters="getFilters"></E-search>
      </div>
    </header>
    <section class="picture-list-body e-size-body">
      <div
        class="card-view-wrapper"
        :class="goodClass"
        v-for="(item, ind) in goods"
        :key="ind"
      >
        <Card class="card-view">
          <h3 slot="title" class="card-title">{{ item.title || "无" }}</h3>
          <div class="card-body">
            <div class="card-body-msg">
              <div class="top-msg left" v-if="item.time">{{ item.time }}</div>
              <div class="top-msg right" v-if="item.size">{{ item.size }}</div>
            </div>
            <router-link
              v-if="item.link"
              tag="a"
              target="_blank"
              :to="item.link"
            >
              <V-image :url="item.url"></V-image>
            </router-link>
            <div v-else class="card-img-shadow">
              <V-image :url="item.url"></V-image>
            </div>
            <!--<div class="card-body-info">-->
            <!--<div class="bottom-info left"></div>-->
            <!--<div class="bottom-info right">{{item.user || ''}}</div>-->
            <!--</div>-->
            <div class="card-body-info">
              <div class="bottom-info left">{{ item.type || "" }}</div>
              <div class="bottom-info right">{{ item.name || "" }}</div>
            </div>
          </div>
          <div class="card-footer">
            <slot
              name="item"
              :goods="item"
              :ind="ind"
              :goodsCheck="goodsCheck[ind]"
            ></slot>
          </div>
        </Card>
      </div>
    </section>
    <footer>
      <Page
        transfer
        size="small"
        ref="pageJump"
        placement="top"
        class="table-page"
        show-total
        show-sizer
        show-elevator
        :total="total"
        :transfer="true"
        :page-size="rows"
        :class-name="'pageSize'"
        :page-size-opts="[20, 50, 100, 200, 500]"
        @on-change="pageJump"
        @on-page-size-change="pageSizeChange"
      />
    </footer>
    <div class="picture-list-right" style="display: none;"></div>
  </div>
</template>

<script>
/**
 * 新增全选 isMultiple: true
 * 修改接口函数 自组件触发、父组件请求并处理、废弃 initPost
 *
 *
 * */

import Size from "../../components/Esize/index";
export default {
  name: "ViewPictureTemp",
  components: {
    "E-size": Size
  },
  // props: ['buttons', 'initSearch', 'isMultiple', '', 'getInitData', 'getGoodsPost'],
  props: {
    goods: {
      default: function() {
        return [];
      }
    },
    buttons: {
      default() {
        return {
          show: false,
          btnList: [],
          businessList: [],
          hasPowerList: []
        };
      }
    },
    initSearch: {
      default() {
        return {
          baseQueryList: [],
          likeQueryList: [],
          quickQueryList: []
        };
      }
    },
    isMultiple: {
      default: true
    }
  },
  methods: {
    init() {
      this.pageJump();
      this.isMultipleChecks();
    },
    getInit() {
      this.filters = [];
      this.pageJump();
    },
    /** 接口 */
    getData() {
      let params = {
        page: this.page,
        rows: this.rows,
        sorts: [],
        sumFields: [],
        filters: this.filters,
        groupOp: this.groupOp
      };
      this.$emit("getGoodsPost", params);
    },
    /** 获取搜索 */
    getFilters(filters, groupOp) {
      console.log(filters, groupOp);
      this.filters = filters;
      this.groupOp = groupOp;
      this.pageJump(1);
    },
    /** 图片排列 */
    getCardClass(name) {
      this.goodClass = name;
    },
    /** 批量选中 */
    checkOne(ind) {
      let check = this.goodsCheck[ind];
      this.$set(this.goodsCheck, ind, !check);
    },
    checkAll(bool) {
      let len = this.goods.length;
      let arr = new Array(len).fill(bool);
      this.$set(this, "goodsCheck", arr);
    },
    getChecks() {
      let checks = this.goods.filter((item, ind) => {
        return this.goodsCheck[ind];
      });
      return checks;
    },
    isMultipleChecks() {
      if (this.isMultiple && this.buttons.businessList.length) {
        let btnList = [
          {
            key: "all",
            name: "全选",
            method: () => {
              this.checkAll(true);
            }
          },
          {
            key: "not",
            name: "取消全选",
            method: () => {
              this.checkAll(false);
            }
          }
        ];
        let hasPowerList = ["all", "not"];
        this.btnList = btnList;
        this.hasPowerList = hasPowerList;
      }
    },
    /** 页面跳转 */
    pageInit() {
      if (!this.$refs["pageJump"]) return;
      this.$refs["pageJump"].currentPage = 1;
    },
    pageJump(page = 1) {
      this.page = page;
      this.getData();
      if (page === 1) this.pageInit();
    },
    pageSizeChange(pageSize) {
      this.rows = pageSize;
      this.getData();
    }
  },
  data() {
    return {
      page: 0,
      rows: 50,
      total: 100,

      filters: [],
      groupOp: "",

      // goods: [],
      goodClass: "",
      goodsCheck: [],

      btnList: [],
      hasPowerList: []
    };
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss">
.picture-list-wrapper {
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  position: absolute;
  background: #f5f7f9;
  min-height: 100%;
  .picture-list-head {
    .picture-list-menu {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 57px;
      z-index: 99999999;
      background: #ffffff;
      padding: 15px 15px 0;
      box-shadow: 0 2px 3px 2px rgba(0, 0, 0, 0.1);
      .picture-list-btn {
        padding: 0;
        right: 15px !important;
      }
    }
    .picture-list-search {
      margin-top: 42px;
      min-height: 30px;
    }
  }
  .picture-list-right {
    position: fixed;
    top: 10%;
    right: 0;
    width: 30px;
    height: 90%;
    z-index: 9999;
    background: #000;
  }
  .picture-list-body {
    /* 卡片样式 star */
    .card-view-wrapper {
      .ivu-card-head {
        padding: 7px 8px;
      }
      .ivu-card-body {
        padding-top: 5px;
        padding-bottom: 0 !important;
      }
      .card-view {
        .card-title {
        }
        .card-body {
          position: relative;
          padding-top: 16px;
          .card-body-msg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 16px;
            display: flex;
            .top-msg {
              /*color: #ccc;*/
              font-size: 12px;
              line-height: 16px;
              &.left {
                flex: 1;
                text-align: left;
              }
            }
          }
          .card-body-info {
            width: 100%;
            height: 30px;
            display: flex;
            line-height: 30px;
            .bottom-info {
              font-size: 14px;
              &.left {
                flex: 1;
                font-weight: bold;
                text-align: left;
              }
            }
          }
        }
        .card-footer {
          position: relative;
          left: -14px;
          display: flex;
          margin: 3px 0;
          min-height: 40px;
          width: calc(100% + 28px);
          border-top: 1px solid #eee;
          & > i,
          & > div,
          & > button {
            flex: 1;
            cursor: pointer;
            transition: all 0.3s;
          }
          & > i {
            font-size: 21px;
            margin: 0 !important;
            line-height: 40px !important;
            &:hover {
              transform: scale(1.3);
              transition: all 0.21s;
              /*background: #2db7f5;*/
            }
          }
          & > button {
            margin: 5px 1%;
            color: #e3e3e3;
            text-align: center;
            /*font-size: 15px;*/
            /*background-color: #2d8cf0;*/
          }
        }
      }
    }
    /* 卡片样式 end */
  }
}
</style>
