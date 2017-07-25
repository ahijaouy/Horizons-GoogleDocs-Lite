import * as types from './LoginActionTypes';

import * as loginHelpers from './LoginHelper';

import { push } from 'react-router-redux';

function changeUsername(username) {
  return {
    type: types.USERNAME_CHANGE,
    username: username
  };
}

function changePassword(password) {
  return {
    type: types.PASSWORD_CHANGE,
    password: password
  };
}

function login() {
  return function (dispatch, getState) {
    const { username, password } = getState().login;
    loginHelpers.login(username, password).then(resp => {
      if (resp.data.authenticated) {
        dispatch({type: types.LOGIN_SUCCESS, user: resp.data.user});
        dispatch(push('/dashboard'));
      } else {
        dispatch({type: types.LOGIN_FAILED});
      }
    });
  };
}



module.exports = {
  changeUsername,
  changePassword,
  login
};