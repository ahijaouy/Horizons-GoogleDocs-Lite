import * as types from './LoginActionTypes';
const initialState = {
  username: 'username',
  password: 'password',
  user: {},
  failed: false,
};

function loginReducer(state = initialState, action) {
  switch (action.type) {
  case types.USERNAME_CHANGE: {
    const newState = Object.assign({}, state);
    newState.username = action.username;
    return newState;
  }
  case types.PASSWORD_CHANGE: {
    const newState = Object.assign({}, state);
    newState.password = action.password;
    return newState;
  }
  case types.LOGIN_SUCCESS: {
    return {username: '', password: '', user: action.user};
  }
  case types.LOGIN_FAILED: {
    console.log('login failed!');
    return state;
  }
  default:
    return state;
  }
}

export default loginReducer;
