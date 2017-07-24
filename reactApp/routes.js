import React from 'react';
import { Route, Switch } from 'react-router-dom';
<<<<<<< HEAD
import docPortalComponent from './components/DocPortalComponent';
import docComponent from './components/DocComponent';

import DocPortalComponent from './components/DocPortalComponent';
import RichEditorExample from './components/DocComponent';

export default (
	<Switch>
			<Route exact path="/" render={() => <DocPortalComponent />} />
			<Route exact path="/doc/:doc_id" render={() => < RichEditorExample />} />
	</Switch>
);
