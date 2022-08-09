import Cookies from "js-cookie";

const TokenKey = "hrsaas_token";
const time = "login_time";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function gettime() {
  return Cookies.get(time);
}
export function settime() {
  Cookies.set(time, Date.now());
}
