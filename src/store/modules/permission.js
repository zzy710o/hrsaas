import { constantRoutes, asyncRoutes } from "@/router";
const state = {
  routes: constantRoutes, // 所有人默认拥有静态路由
};
const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes];
  },
};
const actions = {
  filterRoutes(context, menus) {
    const resRoutes = asyncRoutes.filter((item) => {
      return menus.includes(item.name);
    });
    context.commit("setRoutes", resRoutes);
    return resRoutes;
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
