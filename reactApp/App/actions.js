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

function updateLinks(link) {
  return {
    type: types[link.toUpperCase()]
  };
}
module.exports = {
  login,
  dashboard,
  updateLinks
};
