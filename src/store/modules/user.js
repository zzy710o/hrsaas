import { login, getUserInfo, getUserDetailById } from "@/api/user";
import { getToken, setToken, removeToken, settime } from "@/utils/auth";
import { resetRouter } from "@/router";
// import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  userinfo: {},
};
const mutations = {
  // 修改token的办法
  setToken(state, token) {
    state.token = token;
    setToken(token);
  },
  removeToken(state) {
    state.token = null;
    removeToken();
  },
  setuserinfo(state, userinfo) {
    state.userinfo = userinfo;
  },
  removeUserInfo(state) {
    state.userinfo = {};
  },
};
const actions = {
  // 登录请求 commit mutations
  async login(context, data) {
    const res = await login(data);
    console.log(res);
    settime();
    context.commit("setToken", res);
  },
  // 请求用户信息
  async getUserInfo(context) {
    const res = await getUserInfo();
    const base = await getUserDetailById(res.userId);
    const baseResult = { ...res, ...base };
    context.commit("setuserinfo", baseResult);
    return {
      ...res,
      ...base,
    };
  },
  logOut(context) {
    context.commit("removeToken");
    context.commit("removeUserInfo");
    resetRouter();
    context.commit("permission/setRoutes", [], { root: true });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
