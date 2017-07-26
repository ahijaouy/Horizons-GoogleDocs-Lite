// import React from 'react';
// import ReactDOM from 'react-dom';
// import DocPortalComponent from './components/DocPortalComponent';
// import DocComponent from './components/DocComponent';
// import AppContainer from './components/AppContainer';
// import {Route, HashRouter as Router} from 'react-router-dom';
// import createHistory from 'history/createBrowserHistory';
// import Routes from './routes';

// export const history = createHistory();



// // /* WHEN YOU ACTUALLY WRITE YOUR REDUCER, FIX THE 2 LINES BELOW */
// // import mainReducer from './reducers/index'; /*UNCOMMENT*/
// //
// // const store = createStore(mainReducer);

// ReactDOM.render(
//   <Router>
//     <AppContainer/>
//   </Router>,

//   document.getElementById('root')
// );


import React from 'react';
import { render } from 'react-dom';
import { configureStore } from './store/configureStore';
import Root from './Root/Root';
import createHistory from 'history/createHashHistory';

const history = createHistory();
const store = configureStore(history);


render(
    <Root store={store} history={history} />,
    document.getElementById('root')
);


