import React from 'react';
import { Route, Switch } from 'react-router-dom';
import docPortalComponent from './components/DocPortalComponent';

const socket = io();

export default (
	<Switch>
		<Route exact path="/portal" component={docPortalComponent} />
		<Route exact path="/" component={HeaderComponent} />
	</Switch>
);
