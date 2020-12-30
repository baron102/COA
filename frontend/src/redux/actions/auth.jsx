import AuthHelper from '../../helpers/authHelper.jsx';
import {toastr} from "react-redux-toastr";

export const LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';
export const LOGOUT = 'auth/LOGOUT';
export const REFRESH_TOKEN_REQUEST = 'auth/REFRESH_TOKEN_REQUEST';
export const REFRESH_TOKEN_SUCCESS = 'auth/REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_FAILURE = 'auth/REFRESH_TOKEN_FAILURE';
export const GET_USER_INFO_REQUEST = 'auth/GET_USER_INFO_REQUEST';
export const GET_USER_INFO_SUCCESS = 'auth/GET_USER_INFO_SUCCESS';
export const GET_USER_INFO_FAILURE = 'auth/GET_USER_INFO_FAILURE';
export const SIGNUP_REQUEST = 'auth/SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'auth/SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'auth/SIGNUP_FAILURE';

export const login = (username, password) => dispatch => {
  dispatch({type: LOGIN_REQUEST});
  return AuthHelper.login(username, password)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    }).catch(err => {
      dispatch({
        type: LOGIN_FAILURE,
      });
      throw(err);
    });
};

export const logout = () => {
  return {
    type: LOGOUT
  }
};

export const refreshToken = () => (dispatch, getState) => {
  let token = getState().auth.refresh.token;
  dispatch({type: REFRESH_TOKEN_REQUEST});
  return AuthHelper.refreshToken({refresh: token})
    .then(res => {
      dispatch({
        type: REFRESH_TOKEN_SUCCESS,
        payload: res.data,
      });
    }).catch(err => {
      dispatch({
        type: REFRESH_TOKEN_FAILURE,
      });
    });
};

export const getUserInfo = () => dispatch => {
  dispatch({type: GET_USER_INFO_REQUEST});
  return AuthHelper.getUserInfo()
    .then(res => {
      dispatch({
        type: GET_USER_INFO_SUCCESS,
        payload: res.data
      });
    }).catch(err => {
      dispatch({
        type: GET_USER_INFO_FAILURE,
      });
    });
};

export const signup = (userInfo) => dispatch => {
  dispatch({type: SIGNUP_REQUEST});
  return AuthHelper.register(userInfo)
    .then(res => {
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: res.data,
      });
      toastr.success('Success!', 'Account created successfully.');
    }).catch(err => {
      dispatch({
        type: SIGNUP_FAILURE,
      });
      throw(err);
    });
};