<template>
  <div class="PictureDepotList">
    <pictureTemp
      ref="DepotList"
      :goods="goods"
      :buttons="buttons"
      :initSearch="initSearch"
      :isMultiple="'isMultiple'"
      :getInitData="getInitPost"
      :getGoodsPost="getGoodsPost"
      @getGoodsData="getGoodsData"
    >
      <!-- 导航 -->
      <RadioGroup
        slot="menu"
        v-model="menu"
        type="button"
        class="depot-menus"
        @on-change="setMenuType"
      >
        <Radio v-for="(item, ind) in menuList" :key="ind" :label="ind"
          ><span class="library-menus-mobile">{{ item }}</span>
        </Radio>
      </RadioGroup>
      <!-- 操作 -->
      <template slot="item" slot-scope="props">
        <Icon
          v-show="menu === 1"
          :style="{ color: props.goodsCheck ? 'green' : '#666' }"
          :type="props.goodsCheck ? 'ios-checkmark-circle' : 'md-add-circle'"
          @click.stop="$refs['DepotList'].checkOne(props.ind)"
        />

        <Icon
          :style="{ color: props.goods.collectFlag ? 'red' : '#666' }"
          :type="props.goods.collectFlag ? 'md-star' : 'md-star-outline'"
          @click.stop="collectFlagChange(props.ind)"
        />

        <Icon
          v-show="menu === 1"
          style="margin-left: 6px;"
          :style="{ color: props.goods.shareFlag ? 'green' : '#666' }"
          :type="props.goods.shareFlag ? 'ios-eye' : 'ios-eye-off'"
          @click.stop="shareFlagChange(props.ind)"
        />

        <Icon
          type="md-link"
          @click.stop="cobyLink(props.goods['proId'])"
        ></Icon>
      </template>
    </pictureTemp>
  </div>
</template>

<script>
import pictureTemp from "../../views/VpictureTemp";

export default {
  name: "PictureDepotList",
  components: {
    pictureTemp: pictureTemp
  },
  mounted() {},
  methods: {
    /** POST */
    getInitPost() {},
    getGoodsPost() {},
    getInitData() {},
    getGoodsData(data) {
      // 数据处理
      this.goods = data.map(item => {
        return {
          url:
            "https://singsongpict.oss-cn-hangzhou.aliyuncs.com/image/proEnv/tagsrc/1567739941010_n4fp8duoipst.jpg",
          link: "222",
          title: "333",
          size: "1080*960",
          time: "2019/08/09",
          type: "开发样",
          name: "诸葛四郎",
          shareFlag: true,
          checkState: true,
          collectFlag: true,

          status: item.status,
          operatorTag: item.operatorTag,
          imageEnPath: item.imageEnPath,
          imageCnPath: item.imageCnPath
        };
      });
    },
    /** Event */
    cobyLink() {},
    shareFlagChange() {},
    collectFlagChange() {},

    /** Methods */
    setMenuType(key) {
      if (key === 1) {
        this.buttons.show = true;
      } else {
        this.buttons.show = false;
      }
    },
    batchOperation(str) {
      let checks = this.$refs["DepotList"].getChecks();
      console.log(checks);
    }
  },
  data() {
    return {
      menu: 0,
      menuList: ["全部", "我的收藏", "分享收藏"],
      goods: [],
      buttons: {
        show: false,
        btnList: [],
        businessList: [
          {
            key: "collect",
            name: "取消收藏",
            method: () => {
              this.batchOperation("collect");
            }
          },
          {
            key: "share",
            name: "分享收藏",
            method: () => {
              this.batchOperation("share");
            }
          },
          {
            key: "down",
            name: "批量下载",
            method: () => {
              this.batchOperation("down");
            }
          },
          {
            key: "move",
            name: "批量移动",
            method: () => {
              this.batchOperation("move");
            }
          }
        ],
        hasPowerList: ["collect", "share", "down", "move"]
      },
      initSearch: {
        baseQueryList: [],
        likeQueryList: [],
        quickQueryList: [
          {
            key: "proNo",
            label: "货号",
            uiType: "text",
            valuesMap: {},
            style: {
              width: "180px"
            }
          },
          {
            key: "custId", //custId
            label: "客户",
            uiType: "sglSelect",
            valuesMap: {},
            style: {
              width: "90px"
            }
          },
          {
            key: "series", //series
            label: "系列",
            uiType: "stageSelect",
            valuesMap: [],
            style: {
              width: "220px"
            },
            keys: ["seriesFirstLevel", "seriesSecondLevel", "seriesThreeLevel"]
          },
          {
            key: "categoryCn", //categoryCn
            label: "大类",
            uiType: "sglSelect",
            valuesMap: {}
          },
          {
            key: "outDesigner", //outDesigner
            label: "外部设计师",
            uiType: "sglSelect",
            valuesMap: {}
          },
          {
            key: "inDesigner", //inDesigner
            label: "内部设计师",
            uiType: "sglSelect",
            valuesMap: {}
          },
          {
            key: "creatorId", //creatorId
            label: "上传人",
            uiType: "sglSelect",
            valuesMap: {}
          },
          {
            key: "SPECIAL", //special
            label: "图片状态",
            uiType: "sglSelect",
            valuesMap: {
              0: "待取货号",
              1: "英文未标注",
              2: "中文未标注",
              3: "待审核",
              4: "已审核",
              5: "已作废"
            }
          },
          {
            key: "createDate",
            label: "上传时间范围",
            uiType: "daterange"
          }
        ]
      }
    };
  }
};
</script>

<style scoped lang="scss">
.depot-menus {
  position: fixed;
  top: 15px;
  left: 15px;
}
</style>
