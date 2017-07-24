import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import docPortalComponent from './components/DocPortalComponent';
import docComponent from './components/DocComponent';



export default (
	<Switch>
			<Route exact path="/" component={docPortalComponent} />
			<Route exact path="/doc/:doc_id" component={docComponent} />
	</Switch>
);
