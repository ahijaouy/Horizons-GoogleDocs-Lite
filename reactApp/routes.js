import React from 'react';
import { Route, Switch } from 'react-router-dom';
import docPortalComponent from './components/DocPortalComponent';
import docComponent from './components/DocComponent';


<<<<<<< HEAD:frontend/routes.js
//const socket = io();
=======
>>>>>>> dev:reactApp/routes.js

export default (
	<Switch>
			<Route exact path="/" component={docPortalComponent} />
			<Route exact path="/doc/:doc_id" component={docComponent} />
	</Switch>
);
