function headerReducer(state = {links: ['register', 'login']}, action) {
  switch (action.type) {
  case 'LOGOUT':
  case 'LOGIN':
    return {links: ['register', 'login']};
  case 'DASHBOARD':
  case 'LOGIN_SUCCESS':
    return {links: ['logout']};

  default:
    return state;
  }
}

export default headerReducer;
