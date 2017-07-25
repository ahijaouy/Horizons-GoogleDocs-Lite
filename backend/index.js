// import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import selectReducer from './selectReducer';
import { routerReducer } from 'react-router-redux';
// import * as types from '../actions/types';

const rootReducer = combineReducers({
    cookieSelect: selectReducer,
    routing: routerReducer
});

export default rootReducer;
