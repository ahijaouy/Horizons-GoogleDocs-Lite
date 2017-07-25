import PropTypes from 'prop-types';
import React from 'react';
import {Provider} from 'react-redux';
import AppContainer from '../App/App';
import DevTools from './DevTools';
import { ConnectedRouter } from 'react-router-redux';


export default function Root({ store, history }) {
  return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
              <div>
                 <AppContainer/>
                <DevTools />
              </div>
            </ConnectedRouter>
        </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired
};
