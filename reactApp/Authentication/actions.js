// NPM Imports
import { push } from 'react-router-redux';

// Local Imports
import * as types from './types';
import * as helpers from './helpers';


function changeName(name) {
  return { type: types.NAME_CHANGE, name: name };
}

function changeUsername(username) {
  return { type: types.USERNAME_CHANGE, username: username};
}

function changePassword(password) {
  return { type: types.PASSWORD_CHANGE, password: password };
}

function login() {
  return function (dispatch, getState) {
    const { username, password } = getState().auth;
    helpers.login(username, password).then(resp => {
      if (resp.data.authenticated) {
        dispatch({type: types.LOGIN_SUCCESS, user: resp.data.user});
        dispatch(push('/dashboard'));
      } else {
        dispatch({type: types.LOGIN_FAILED});
      }
    });
  };
}

function register() {
  return function (dispatch, getState) {
    const { username, password, name } = getState().auth;
    helpers.register(username, password, name).then(resp => {
      if (resp.data.user) {
        dispatch({type: types.REGISTER_SUCCESS, user: resp.data.user});
        dispatch(push('/dashboard'));
      } else {
        dispatch({type: types.REGISTER_FAILED});
      }
    });
  };
}



module.exports = {
  changeName,
  changeUsername,
  changePassword,
  login,
  register
};