import hljs from "highlight.js"; //导入代码高亮文件
import "highlight.js/styles/monokai-sublime.css"; //导入代码高亮样式

export default Vue => {
  //自定义一个代码高亮指令
  Vue.directive("highlight", function(el) {
    let highlight = el.querySelectorAll("pre code");
    highlight.forEach(block => {
      hljs.highlightBlock(block);
    });
  });
  //
  Vue.directive("focus", {
    update: function(el, binding) {
      el.focus();
    }
  });
  // 权限判断指令
  Vue.directive("has", {
    bind: function(el, binding) {
      let key = binding.value.key;
      let array = binding.value.power || [];
      if (array.indexOf(key) === -1) {
        if (el.parentElement && el.parentNode.removeChild) {
          el.parentNode.removeChild(el);
        }
      }
    }
  });
  // 云图库图片地址
  // 2019.6.23号 部分弃用 弃用
  function imgSrcFun(el, binding) {
    let src = binding.value;
    let newImg = new Image();
    let http = window.location.origin;
    let load_src = "../../../static/images/imgLoading.gif";
    let error_src = "../../../static/images/logo.png";
    el.src = load_src;
    el.onerror = () => (el.src = error_src);
    if (isNull(src) || src == "") {
      src = error_src;
    } else if (src.indexOf("http") > -1) {
      // src = src;
    } else if (http.indexOf("localhost") > -1) {
      src = "https://erptest.singsong.cn" + src;
    } else {
      src = http + src;
    }
    newImg.src = src;
    newImg.onload = () => (el.src = src);
    setTimeout(function() {
      if (el.src.indexOf("imgLoading") > -1) {
        el.src = error_src;
        el.title = "图片加载超时！";
      }
    }, 10000);
  }

  Vue.directive("imgSrc", {
    bind: function(el, binding) {
      imgSrcFun(el, binding);
    },
    update: function(el, binding) {
      if (binding.modifiers.update) {
        imgSrcFun(el, binding);
      }
    }
  });
};
