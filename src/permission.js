import router from "@/router";
import store from "@/store";
import NProgress from "nprogress"; // 引入一份进度条插件
import "nprogress/nprogress.css"; // 引入进度条样式

const loginpath = "/login";
const notfoundpath = "/404";
// 白名单页面
const whitelist = [loginpath, notfoundpath];
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const token = store.getters.token;
  if (token) {
    if (!store.getters.userid) {
      const res = await store.dispatch("user/getUserInfo");
      console.log(res.roles.menus);
      const routes = await store.dispatch(
        "permission/filterRoutes",
        res.roles.menus
      );
      router.addRoutes([
        ...routes,
        { path: "*", redirect: "/404", hidden: true },
      ]);
      next(to.path);
    }
    if (to.path === loginpath) {
      next("/");
    } else {
      next();
    }
  } else {
    if (whitelist.includes(to.path)) {
      next();
    } else {
      next(loginpath);
    }
  }
  NProgress.done();
});

router.afterEach(function () {
  NProgress.done();
});
