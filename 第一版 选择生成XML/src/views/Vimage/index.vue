<template>
  <div class="picture-view">
    <div class="picture-view-center" :style="{ paddingTop: top ? top : '75%' }">
      <img v-lazy="url" :key="url" />
    </div>
  </div>
</template>

<script>
/**
 * :date 2019/6/21
 * :user Zero
 * 功能: 图片自适应居中展示/响应
 *
 * */
export default {
  name: "pictureView",
  props: ["url", "top"]
};
</script>

<style scoped>
.picture-view {
  width: 100%;
}
.picture-view-center {
  position: relative;
  width: 100%;
  display: flex;
  padding-top: 75%;
}
.picture-view-center img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
