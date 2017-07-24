import React from 'react';
import { Route, Switch } from 'react-router-dom';
import docPortalComponent from './components/DocPortalComponent';

//const socket = io();

export default (
	<Switch>
		<Route exact path="/" component={docPortalComponent} />
	</Switch>
);
