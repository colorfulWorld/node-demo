import storage from "store";
import { login, register } from "@/api/user";
import { ACCESS_TOKEN } from "@/store/mutation-types";

const state = {
  token: "",
  userInfo: storage.get("userInfo") || {},
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
};

const actions = {
  // 注册
  register(undifiend, registerForm) {
    return new Promise((resolve, reject) => {
      register(registerForm)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 登录
  login({ commit }, loginForm) {
    return new Promise((resolve, reject) => {
      login(loginForm)
        .then((response) => {
          const data = response;
          storage.set(ACCESS_TOKEN, data.token, 7 * 24 * 60 * 60 * 1000);
          storage.set("userInfo", data.userData, 7 * 24 * 60 * 60 * 1000);
          commit("SET_TOKEN", data.token);
          commit("SET_USER_INFO", data.userData);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 登出
  logout({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_USER_INFO", {});
      storage.remove(ACCESS_TOKEN);
      storage.remove("userInfo");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
