// import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';
// import * as types from '../actions/types';

const rootReducer = combineReducers({
    routing: routerReducer
});

export default rootReducer;
