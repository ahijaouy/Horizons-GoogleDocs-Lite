import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import docPortalComponent from './components/DocPortalComponent';
// import docComponent from './components/DocComponent';

import DocPortalComponent from './components/DocPortalComponent';
import RichEditorExample from './components/DocComponent';

export default (
	<Switch>
			<Route exact path="/" render={() => <DocPortalComponent />} />
			<Route exact name="doc" path="/doc/:doc_id" render={(doc_id) => <RichEditorExample id={doc_id}/>} />
	</Switch>
);
