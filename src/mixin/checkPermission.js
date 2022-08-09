import store from "@/store";
export default {
  methods: {
    checkPermission(key) {
      console.log(store.state.user);
      return !store.state.user.userinfo.roles.points.includes(key);
    },
  },
};
