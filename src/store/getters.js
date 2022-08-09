const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  // avatar: state => state.user.avatar,
  name: (state) => state.user.userinfo.username,
  userid: (state) => state.user.userinfo.userId,
  staffPhoto: (state) => state.user.userinfo.staffPhoto,
  companyId: (state) => state.user.userinfo.companyId,
  routes: (state) => state.permission.routes,
};
export default getters;
