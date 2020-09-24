import Vue from "vue";
import iView from "iview";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import http from "./http";
import Cookies from "js-cookie";
import VueLazyload from "vue-lazyload";
import "iview/dist/styles/iview.css";
import hljs from "highlight.js"; //导入代码高亮文件
import "highlight.js/styles/dark.css"; //导入代码高亮样式
import directives from "./directives.js";
import odoo from "./odoo";
//通用公共组件
import IMG from "./views/Vimage/index";
import E_form from "./components/Eform/index";
import E_table from "./components/Etable/index";
import E_search from "./components/Esearch/index";
import E_button from "./components/Ebutton/index";

let opt = {
  preLoad: 1.3,
  error: "./logo.png",
  loading: "./loading.gif",
  attempt: 2
};

//自定义一个代码高亮指令
Vue.directive("highlight", function(el) {
  let highlight = el.querySelectorAll("pre code");
  highlight.forEach(block => {
    hljs.highlightBlock(block);
  });
});

Vue.use(iView);
Vue.use(directives);
Vue.use(VueLazyload, opt);
Vue.prototype.$http = http;
Vue.prototype.$odoo = odoo;
Vue.prototype.$cookies = Cookies;
Vue.config.productionTip = false;
Vue.component("V-image", IMG);
Vue.component("E-form", E_form);
Vue.component("E-table", E_table);
Vue.component("E-search", E_search);
Vue.component("E-button", E_button);

let vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

vm.$Message.config({
  top: 90,
  duration: 5
});
