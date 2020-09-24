<template>
  <div class="E-size">
    <RadioGroup
      v-model="menu"
      type="button"
      class="order-views"
      @on-change="setMenuInfo"
    >
      <Radio v-for="(item, ind) in menus" :key="ind" :label="item"
        >{{ item }}列</Radio
      >
    </RadioGroup>
  </div>
</template>

<script>
/**
 *
 * 改： 纯列数组件
 * 注：图片列表Ul要增加 e-size-body 类名
 * */
export default {
  name: "e-size",
  data() {
    return {
      menu: 1,
      menus: []
    };
  },
  mounted() {
    this.menuInit();
    this.setMenuInfo(this.menu);
  },
  methods: {
    menuInit() {
      this.menuResize();
      let menu = localStorage.getItem("eSize");
      menu = menu ? Number(menu) : this.menus[0];
      window.onresize = () => this.menuResize();
      if (menu && this.menus.includes(menu)) {
        this.menu = menu;
      }
    },
    menuResize() {
      // 计算公式 最大列数 * 306 + 30
      let width = document.body.clientWidth;
      if (width > 1920) {
        this.menus = [4, 8, 12];
      } else if (width > 1440) {
        this.menus = [3, 6, 9];
      } else if (width > 960) {
        this.menus = [2, 4, 6];
      } else if (width > 640) {
        this.menus = [2, 3, 4];
      }
      this.menu = this.menus[0];
    },
    setMenuInfo(key) {
      localStorage.setItem("eSize", key);
      let style = this.computedSize(key);
      this.$emit("getMenuInfo", style);
    },

    /** 计算 */
    computedSize(size) {
      // todo 返回不同的类名 或者 样式
      return "e-size-" + size;
    }
  }
};
</script>

<style lang="scss">
.e-size-body {
  display: flex;
  flex-wrap: wrap;
}
@each $item in 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15 {
  .e-size-#{$item} {
    width: calc((100% - ((#{$item} - 1) * 6px)) / #{$item});
    margin: 0 6px 10px 0;
    transition: all 0.3s;
    min-width: 150px;
    &:nth-child(#{$item}n) {
      margin-right: 0;
    }
    @if ($item > 5) {
      & .card-footer button {
        padding: 0 3px;
        & > span {
          display: none;
        }
      }
    }
  }
}
</style>
