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
