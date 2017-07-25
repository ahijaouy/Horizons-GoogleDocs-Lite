import React from 'react';
import ReactDOM from 'react-dom';
import DocPortalComponent from './components/DocPortalComponent';
import DocComponent from './components/DocComponent';
import AppContainer from './components/AppContainer'
// import Root from './containers/Root';
import {Route, HashRouter as Router} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

export const history = createHistory();



// /* WHEN YOU ACTUALLY WRITE YOUR REDUCER, FIX THE 2 LINES BELOW */
// import mainReducer from './reducers/index'; /*UNCOMMENT*/
//
// const store = createStore(mainReducer);

ReactDOM.render(
  <Router history={history}>
    <Route path="/" component={AppContainer}/>
  </Router>,

  document.getElementById('root')
);
