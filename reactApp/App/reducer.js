function headerReducer(state = {links: ['register', 'login']}, action) {
  switch (action.type) {
  case 'LOGIN':
    return {links: ['register', 'login']};

  case 'LOGIN_SUCCESS':
    return {links: ['logout']};

  default:
    return state;
  }
}

export default headerReducer;
