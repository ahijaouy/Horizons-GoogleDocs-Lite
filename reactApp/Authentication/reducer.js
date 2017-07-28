import * as types from './types';
import * as helpers from './helpers';

const initialState = {
  username: 'username',
  password: 'password',
  user: {},
  loginFailed: false,
  registrationFailed: false,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
  case types.LOGOUT:
    helpers.logout();
    return initialState;
  case types.USERNAME_CHANGE: {
    const newState = Object.assign({}, state);
    newState.username = action.username;
    return newState;
  }
  case types.NAME_CHANGE: {
    const newState = Object.assign({}, state);
    newState.name = action.name;
    return newState;
  }
  case types.PASSWORD_CHANGE: {
    const newState = Object.assign({}, state);
    newState.password = action.password;
    return newState;
  }
  case types.LOGIN_SUCCESS: {
    return {username: '', password: '', user: action.user, loginFailed: false};
  }
  case types.LOGIN_FAILED: {
    const newState = Object.assign({}, state);
    newState.password = "";
    newState.loginFailed = true;
    return newState;
  }
  case types.REGISTER_SUCCESS: {
    return {username: '', password: '', user: action.user, registrationFailed: false};
  }
  case types.REGISTER_FAILED: {
    const newState = Object.assign({}, state);
    newState.password = "";
    newState.registrationFailed = true;
    return newState;
  }
  default:
    return state;
  }
}

export default authReducer;
