/**
 一、目的

 1.全局请求配置

 2.请求的promise封装

 3.统一捕获接口错误并处理

 4.统一弹窗提示信息、请求loading

 5.请求携带token、参数序列化、请求前进行权限判断进行统一拦截

 6.转换请求、请求并发、取消重复请求、路由跳转取消当前页面的数据请求

 二、需求

 全局配置： 超时时间、请求头Content-Type、baseURL等

 错误处理：

 （1）请求错误、状态码非200

 （2）参数错误、请求异常、无权限、未登陆等

 请求拦截：权限判断、登陆判断、

 请求封装：token、params、promise

 请求响应：信息提示、数据处理、权限判断

 其他封装：URL整合、转换请求、并发请求、取消请求
 * */
import vue from "vue";
import axios from "axios";
import store from "./store";
import router from "./router";
import Cookies from "js-cookie";
import Message from "iview/src/components/message/index";
import Loading from "iview/src/components/loading-bar/index";

Message.config({
  top: 90,
  duration: 3
});

let time = null; // 加载延时器
let baseURL = "web/"; // 请求路径
let isToken = false; // 是否开启token校验
let requestList = []; // 请求队列
let sourcesList = {};
let notPowerList = [
  "erp/application/noAuth/login",
  "erp/application/noAuth/validate",
  "erp/application/noAuth/dingTalkLogin"
];

// 不同环境配置
if (process.env.NODE_ENV === "production") {
  if (process.env.VUE_APP_FLAG === "pro") {
    // production 生产
    baseURL = "pro/";
  } else {
    // test 测试
    baseURL = "pre/";
  }
} else {
  // 开发
  baseURL = "web/";
}
console.log(baseURL);

const timeout = 30000;
const CancelToken = axios.CancelToken;
const Http = axios.create({
  baseURL: baseURL, // 设置请求地址
  timeout: timeout, //设置超时
  withCredentials: false, // 是否允许带cookie这些
  responseType: "json",
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});
const File = axios.create({
  baseURL: baseURL, // 设置请求地址
  timeout: timeout, //设置超时
  withCredentials: false, // 是否允许带cookie这些
  responseType: "json",
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: Cookies.get("token")
  },
  onUploadProgress: e => {
    let completeProgress = (((e.loaded / e.total) * 100) | 0) + "%";
    console.log("上传进度：", completeProgress);
    // this.progress = completeProgress;
  }
});
const Down = axios.create({
  baseURL: baseURL, // 设置请求地址
  timeout: timeout, //设置超时
  withCredentials: false, // 是否允许带cookie这些
  responseType: "blob",
  headers: {
    "Content-Type": "application/json",
    Authorization: Cookies.get("token")
  }
});
const OdooDown = axios.create({
  baseURL: baseURL, // 设置请求地址
  timeout: timeout, //设置超时
  withCredentials: false, // 是否允许带cookie这些
  responseType: "blob",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
    // 'Authorization': Cookies.get('token')
  }
});

// 用户 废弃
const getUser = callbcak => {
  let id = localStorage.getItem("userID");
  let url = "/web/ss_common/user_info";
  if (id) return true;
  return Http.post(url, JSON.stringify({}))
    .then(res => {
      console.log(res);
      res = JSON.parse(res);
      let result = res.result;
      if (result.status) {
        let user = result.data.user_id;
        localStorage.setItem("userID", user);
        callbcak && callbcak(user);
      } else {
        Message.error({
          content: result["failure_msg"],
          duration: 3
        });
      }
    })
    .catch(rej => {
      Message.error({
        content: "获取当前登陆用户失败！",
        duration: 3
      });
    });
};
// 开始请求
const loadingStar = loading => {
  // loading 为 true 不开启加载动画
  if (loading) return;
  Loading.start();
  new vue().$Spin.show();
  store.commit("setLoading", true);

  // 超时关闭
  if (time) return; // clearTimeout(time)
  time = setTimeout(function() {
    new vue().$Spin.hide();
    Message.error({
      content: "请求中...",
      duration: 3
    });
  }, timeout * 3);
};
// 请求失败
const loadingError = loading => {
  console.log("loadingError");

  Loading.error();
  clearTimeout(time);
  new vue().$Spin.hide();
  store.commit("setLoading", loading);
};
// 请求完成
const loadingFinish = loading => {
  console.log("loadingFinish");

  Loading.finish();
  clearTimeout(time);
  new vue().$Spin.hide();
  store.commit("setLoading", loading);
};
// 请求出错
const responseError = error => {
  return;
  // 响应失败 服务器错误信息 提示
  if (axios.isCancel(error)) {
    source.cancel("操作被用户取消.");
  } else {
    // 数据异常拦截处理
    const data = error.response.data;
    Message.error({
      content: data.errorCode + ":" + data.errorMsg,
      duration: 6,
      closable: true
    });
  }
};
// 请求成功 ODOO
const responseSuccess = (res, resolve) => {
  // 响应成功 请求失败 错误码解析
  if (res.result) {
    // 请求成功
    res = typeof res.result === "string" ? JSON.parse(res.result) : res.result;
    if (!res.status && res["error_code"]) {
      Message.error({
        content:
          "错误代码：" + res["error_code"] + ",错误信息：" + res["failure_msg"],
        duration: 5
      });
    } else if (res.status) {
      res && resolve(res.data);
    } else {
      res && resolve(res);
    }
  } else if (res.error) {
    // ODOO 报错
    res = res.error;
    Message.error({
      content:
        "错误代码：" +
        res.code +
        ",错误信息：" +
        res.message +
        ",错误提示：" +
        res.data.message,
      duration: 6
    });
  } else {
  }
  // 弃用
  if (false && !res.data.status) {
    if (res.data.errorCode === 910001 || res.data.errorCode === 910002) {
      Cookies.set("token", "");
      router.push({ path: "/login" });
    } else {
      Message.warning({
        content: res.data["errorMsg"],
        duration: 6,
        closable: true
      });
    }
  }
};
// 拦截请求
Http.interceptors.request.use(
  config => {
    // 判断是否重复
    const request = JSON.stringify(config.url) + JSON.stringify(config.data);
    config.cancelToken = new CancelToken(cancel => {
      sourcesList[request] = cancel;
    });
    requestList.includes(request)
      ? sourcesList[request]("取消重复请求")
      : requestList.push(request);

    // 判断是否登陆
    const token = Cookies.get("token");
    if (notPowerList.indexOf(config.url) === -1 && isToken) {
      if (token === undefined || token === null || token === "") {
        router.push({ path: "/login" });
        return false;
      } else {
        config.headers.Authorization = token;
      }
    }

    // 判断当前登陆用户
    // if (!localStorage.getItem('getUser')) {
    //   let user = getUser();
    //   localStorage.setItem('getUser', '123');
    //   console.log(user);
    // } else {
    //
    // }
    return config;
  },
  function(error) {
    //请求错误拦截处理
    // loadingError();
    Message.error({
      content: "发起请求失败!",
      duration: 3
    });
    return Promise.reject(error);
  }
);

// 拦截响应
Http.interceptors.response.use(
  response => {
    // 判断是否结束
    const request =
      JSON.stringify(response.config.url) +
      JSON.stringify(response.config.data);
    requestList.splice(requestList.findIndex(item => item === request), 1);
    !requestList.length && loadingFinish();

    // 请求成功处理
    responseSuccess(response);
    return response;
  },
  function(error) {
    // 清空请求列表
    loadingError();
    requestList.length = 0;
    throw new axios.Cancel("cancel request");

    // 错误处理
    responseError(error);
    return Promise.reject(error);
  }
);

export default {
  axios,
  Http,
  File,
  Down,
  OdooDown,
  /**
   * @param url 地址
   * @param params 参数
   * @param params = { files : [] };
   * @param loading 是否显示遮罩 为true不显示
   * @param getList 请求列表 [{url: url, type: type, params: params}]
   * @return {Promise}
   * */
  post: function(url, params = {}, loading) {
    loadingStar(loading);
    return new Promise((resolve, reject) => {
      Http.post(url, JSON.stringify(params))
        .then(res => {
          res = res["data"];
          if (res.status) {
            res = res["responseData"];
            resolve(res);
          } else {
            // errorMsg errorCode
            Message.error({
              content: res["errorCode"] + ":" + res["errorMsg"],
              duration: 6,
              closable: true
            });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  odoo: function(url, params = {}, loading) {
    loadingStar(loading);
    if (!params.params) params = { params };
    return new Promise((resolve, reject) => {
      Http.post(url, JSON.stringify(params))
        .then(res => {
          res = res["data"];
          responseSuccess(res, resolve);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fileUpLoad: function(url, params = {}, loading) {
    loadingStar(loading);
    return new Promise((resolve, reject) => {
      File.post(url, params)
        .then(res => {
          loadingFinish();
          resolve(res);
        })
        .catch(err => {
          loadingError();
          reject(err);
        });
    });
  },
  fileFlowDown: function(url, params, name) {
    return new Promise((resolve, reject) => {
      loadingStar(true);
      Down.post(url, JSON.stringify(params))
        .then(res => {
          // 下载文件
          loadingFinish();
          if (!res.data) return;
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", name);
          document.body.appendChild(link);
          link.click();
          resolve(res);
        })
        .catch(err => {
          loadingError();
          reject(err);
        });
    });
  }
};

/*all: function (getList, loading) {
    /!** 废 *!/
    if (getList.length) {
      loadingStar(loading);
      return axios.all(getList);
      return new Promise((resolve, reject) => {
        axios.all(getList).then(axios.spread( () => {
          resolve(arguments)
        })).catch(error => {
          reject(error)
        })
      })
    }
  },
  get: function (url, params = {}, loading) {
    /!** 废 *!/
    loadingStar(loading);
    return new Promise( (resolve, reject) => {
      Http.get(url, {
        params: params
      }).then( res => {
        resolve(res.data);
        // if (!res.data.status) return;
        // resolve(res.data['responseData'])
      }).catch( err => {
        reject(err)
      })
    })
  },
  post: function (url, params = {}, loading) {
    /!** 废 *!/
    loadingStar(loading);
    return new Promise( (resolve, reject) => {
      Http.post(url, JSON.stringify(params)).then(res => {
        resolve(res.data);
        // if (!res.data.status) return;
        // resolve(res.data['responseData'])
      }).catch( err => {
        reject(err)
      })
    })
  },*/
