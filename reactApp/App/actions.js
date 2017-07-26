import * as types from './types';

function login() {
  return {
    type: types.LOGIN,
  };
}

function dashboard() {
  return {
    type: types.DASHBOARD,
  };
}

module.exports = {
  login,
  dashboard
};