import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../Root/rootReducer';
import DevTools from '../Root/DevTools';
import { routerMiddleware } from 'react-router-redux';

export function configureStore(history) {
  const middleware = [thunk, routerMiddleware(history)];
  console.log(middleware);
  return createStore(
        rootReducer,
        compose(
          applyMiddleware(...middleware),
          DevTools.instrument()
        )
    );
}




