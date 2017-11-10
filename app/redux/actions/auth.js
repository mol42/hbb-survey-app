import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  APP_INITIALIZED,
  LOGOUT_REQUEST
} from "./actionTypes";

export function doLogin(loginInfo) {
  return {
    type : LOGIN_REQUEST,
    loginInfo
  }
}

export function loginSuccess(user, token) {
  return {
    type : LOGIN_SUCCESS,
    user, 
    token
  }
}

export function doLogout() {
  return {
    type : LOGOUT_REQUEST
  }
}

export function informAppInitialized() {
  return {
    type : APP_INITIALIZED
  }
}
