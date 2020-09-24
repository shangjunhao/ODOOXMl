<template>
  <div class="guide-item"></div>
</template>

<script>
let guide = {
  text: {
    template: ``
  },
  image: {
    template: `<div class="guide-image" :style="getStyle(node.image)"><img src="node.url" alt="URL Error!" width="100%" height="100%"></div>`
  }
};
export default {
  name: "guide-node",
  components: guide
};
</script>

<style scoped></style>
