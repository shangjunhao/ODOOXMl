<template>
  <div id="app">
    <!--<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-family: -apple-system, "SF UI Text", "Helvetica Neue", Arial,
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Zen Hei",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* 全局配置 css */

$margin: 8;

.margin-bottom-#{$margin} {
  height: 0;
  margin-bottom: 8px;
}

html,
body,
#app,
#app > div {
  height: 100%;
  /*overflow: hidden;*/
}
</style>
