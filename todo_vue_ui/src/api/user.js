import request from "@/utils/request";

const userApi = {
  login: "/user/login",
  logout: "/user/logout",
  register: "/user/register",
};

export function login(parameter) {
  return request({
    url: userApi.login,
    method: "post",
    data: parameter,
  });
}

export function logout() {
  return request({
    url: userApi.logout,
    method: "post",
  });
}

export function register(parameter) {
  return request({
    url: userApi.register,
    method: "post",
    data: parameter,
  });
}
