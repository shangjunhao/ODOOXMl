import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  base: "/",
  // mode:'history',
  routes: [
    //
    {
      path: "/PictureSearch",
      name: "PictureSearch",
      component: () => import("./pages/PictureSearch/PictureSearch.vue")
    },
    //
    {
      path: "/PictureDepot",
      name: "PictureDepotList",
      component: () => import("./pages/PictureDepot/PictureDepotList.vue")
    },
    // 标注
    {
      path: "/PictureMark",
      name: "PictureMarkList",
      component: () => import("./pages/PictureMark/PictureMarkList.vue")
    },
    {
      path: "/PictureMarkItem",
      name: "PictureMarkItem",
      component: () => import("./pages/PictureMark/PictureMarkDetails.vue")
    },
    {
      path: "/Analysis",
      name: "AnalysisCustomer",
      component: () => import("./pages/Analysis/index.vue")
    },
    // 权限配置 SystemPermissions
    {
      path: "/Index",
      name: "Index",
      component: () => import("./pages/SystemPermissions/index.vue")
    },
    // {
    //   path: "/SystemPermissions",
    //   name: "SystemPermissions",
    //   component: () =>
    //     import("./pages/SystemPermissions/delete/SystemPermissions.vue")
    // },
    // 收集货号界面
    {
      path: "/SaleOrderView",
      name: "SaleOrderView",
      component: () => import("./pages/SaleOrderView/index.vue")
    },
  ]
});
