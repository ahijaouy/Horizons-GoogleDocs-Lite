import { combineReducers } from 'redux';
import login from '../Login/loginReducer';
import header from '../Header/headerReducer';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  login,
  header,
  routerReducer
});