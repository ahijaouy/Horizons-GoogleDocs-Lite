import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import DocPortalComponent from './components/DocPortalComponent';
import RichEditorExample from './components/DocComponent';

export default (
	<Switch>
			<Route exact path="/" render={() => <DocPortalComponent />} />
			<Route exact path="/doc/:doc_id" render={() => < RichEditorExample />} />
	</Switch>
);
