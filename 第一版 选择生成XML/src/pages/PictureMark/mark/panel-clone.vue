<template>
  <div class="mark-clone-panel">
    <header>
      <div class="head-title">近期已标注</div>
      <div class="close-icon" @click="() => {}"><Icon type="ios-close" /></div>
    </header>
    <div class="mark-clone-query last">
      <Input
        prefix="ios-search"
        v-model="query"
        placeholder="快速检索货号"
        size="small"
        @on-enter="querySkuData"
      />
    </div>
    <div class="mark-clone-images">
      <div
        class="mark-image"
        v-for="(item, ind) in images"
        :class="{ active: index == ind }"
        :key="ind"
        @click="markCloneModal(ind)"
      >
        <div class="mark-image-box">
          <V-image :url="item['img_src']"></V-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 向上 关闭函数
 * 向上 克隆数据
 *
 * TODO 可以合并为一个
 * @getCloneData
 * */
export default {
  name: "panel-clone",
  props: ["EnOrCn"],
  data() {
    return {
      index: -1,
      query: "",
      images: []
    };
  },
  methods: {
    getDataPost(domain) {
      let url = "dataset/search_read";
      let params = {
        model: "ss.sample.tag.image",
        fields: ["id", "img_src"],
        offset: 0, // star
        limit: 50, // max end
        // 自己标注的 时间排序 1-50
        domain: domain,
        sort: "write_date desc"
      };
      this.$http.odoo(url, params).then(res => {
        this.images = [];
        if (res.length) {
          this.images = res.records;
        }
      });
    },
    querySkuData() {
      console.log("qu", this.EnOrCn);
      let uid = Zero.GetQueryString('uid');
      let key = this.EnOrCn === "en" ? "tag_user_id_en" : "tag_user_id_cn";
      let domain = [[key, "=", Number(uid)], ["name", "ilike", this.query]];
      this.getDataPost(domain);
    },
    getRecentData(type) {
      type = type || this.EnOrCn;
      let uid = Zero.GetQueryString('uid');
      let key = type === "en" ? "tag_user_id_en" : "tag_user_id_cn";
      let domain = [[key, "=", Number(uid)]];
      this.getDataPost(domain);
    },
    markCloneModal(ind) {
      this.index = ind;
      this.$Modal.confirm({
        closable: true,
        okText: "克隆",
        title: "克隆数据！",
        cancelText: "取消",
        onCancel: () => {
          console.log(13);
        },
        content:
          "点击克隆按钮，将所点击的标注图片的标注数据克隆到当前标注区域内！",
        onOk: () => {
          // 传输克隆对象ID即可
          let item = this.images[ind];
          this.$emit("getCloneData", item.id);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.mark-clone-panel {
  height: 100%;
  overflow: hidden;
  border-left: 1px solid #dedee4;
  /* 40px */
  header {
    display: flex;
    height: 40px;
    margin: 0 12px;
    padding-left: 12px;
    align-items: center;
    border-bottom: 1px solid #dedee4;
    .head-title {
      height: 100%;
      line-height: 40px;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid transparent;
    }
    .close-icon {
      cursor: pointer;
      padding: 0 10px;
      margin-left: auto;
      font-size: 22px;
    }
  }
  /* 45px */
  .mark-clone-query {
    padding: 10px 22px;
    border-bottom: 1px solid transparent;
  }
  /*  */
  .mark-clone-images {
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
    flex-direction: column;
    height: calc(100% - 95px);
    .mark-image {
      position: relative;
      width: 50%;
      padding: 5px;
      cursor: pointer;
      max-height: 110px;
      @mixin imgBorder {
        position: absolute;
        width: 0;
        height: 0;
        content: "";
        opacity: 0;
        border-radius: 3px;
        border-style: solid;
        border-color: #0e76a8;
        box-sizing: border-box;
        transition: all ease-in-out 0.6s;
      }
      .mark-image-box {
        position: relative;
        &::after {
          top: -1px;
          left: -1px;
          @include imgBorder;
          border-width: 1px 0 0 1px;
        }
        &::before {
          bottom: -1px;
          right: -1px;
          @include imgBorder;
          border-width: 0 1px 1px 0;
        }
        &:hover::after,
        &:hover::before,
        &.active::after,
        &.active::before {
          opacity: 1;
          width: calc(100% + 2px);
          height: calc(100% + 2px);
        }
      }
    }
  }
}
</style>
