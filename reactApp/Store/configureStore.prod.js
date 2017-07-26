import { createStore } from 'redux';
import rootReducer from '../Root/rootReducer';

export function configureStore(initialState) {
  return createStore(
        rootReducer,
        initialState
    );
}
