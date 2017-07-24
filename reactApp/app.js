import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import DocPortalComponent from './components/DocPortalComponent';
import DocComponent from './components/DocComponent';
import App from './containers/AppContainer'
import Root from './containers/Root';
// import styles from css folder:
import './css/draft.css';
import './css/main.css';
import './css/richEditor.css';

/* WHEN YOU ACTUALLY WRITE YOUR REDUCER, FIX THE 2 LINES BELOW */
import mainReducer from './reducers/index'; /*UNCOMMENT*/

const store = createStore(mainReducer);

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root')
);
