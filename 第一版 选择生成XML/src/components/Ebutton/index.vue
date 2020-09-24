<template>
  <div class="E-button" :style="btnStyle">
    <!--isStyle ? btnStyle : {} 统一放置user左侧-->
    <Button
      v-for="item in btnList"
      class="left"
      :key="item.key"
      @click="btnListClick(item.method)"
      v-has="{ key: item.key, power: hasPowerList }"
      >{{ item.name }}</Button
    >
    <Dropdown
      v-show="menuList.length"
      trigger="click"
      @on-click="dropDownClick"
      class="left"
    >
      <Button>
        业务操作
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <template v-for="(item, ind) in menuList">
          <DropdownItem
            :key="item.key"
            :name="ind"
            v-has="{ key: item.key, power: hasPowerList }"
            >{{ item.name }}</DropdownItem
          >
        </template>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
/**
 * 2019.03.29 版本: 0.O.1
 *
 * btnList Arr [{key,name,method}]
 * menuList Arr [{key,name,method}]
 * hasPowerList Arr [key1,key2,...]
 * 12.11 新增上浮动样式 isStyle Bol 控制交给外部
 * 05.20 统一放置在 user 左侧
 * 09.19 统一代码执行环境为 btn组件父组件
 * */
export default {
  name: "e-button",
  props: ["isStyle", "btnList", "menuList", "hasPowerList"],
  data() {
    return {
      btnStyle: {
        position: "fixed",
        top: "16px",
        right: "calc( 3% + 15px )",
        zIndex: 99
      }
    };
  },
  mounted() {},
  methods: {
    btnListClick(method) {
      method.bind(this.$parent)();
    },
    dropDownClick(name) {
      this.menuList[name]["method"] &&
        this.menuList[name]["method"].bind(this.$parent)();
    }
  }
};
</script>

<style scoped>
.E-button {
  position: absolute;
  top: 0px;
  right: 20px;
  padding: 10px 0;
  transition: all 0.3s;
}
.left {
  margin-left: 4px;
}
</style>
