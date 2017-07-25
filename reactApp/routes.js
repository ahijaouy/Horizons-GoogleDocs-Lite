import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import docPortalComponent from './components/DocPortalComponent';
// import docComponent from './components/DocComponent';

import DocPortalComponent from './components/DocPortalComponent';
import RichEditorExample from './components/DocComponent';
import Login from './components/Login';
import Register from './components/Register';
export default () => (
	<Switch>
<<<<<<< HEAD
      <Route exact path="/" component={Login}/>
			<Route exact path="/register" component={Register} />
      <Route exact path="/dashboard" component={DocPortalComponent}/>
			<Route exact path="/doc/:doc_id" render={() => < RichEditorExample />} />
=======
			<Route exact path="/" render={() => <DocPortalComponent />} />
			<Route exact name="doc" path="/doc/:doc_id" render={(doc_id) => <RichEditorExample id={doc_id}/>} />
>>>>>>> feature/routes
	</Switch>
);
