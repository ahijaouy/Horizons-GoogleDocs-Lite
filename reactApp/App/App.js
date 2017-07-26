import React from 'react';
import Login from '../Authentication/Login';
import Register from '../Authentication/Register';
import Header from './Header';
import { Route, Switch } from 'react-router-dom';
import DocPortalComponent from '../components/DocPortalComponent';
import DocComponent from '../components/DocComponent';

const socket = io('http://localhost:3000');

export default function AppContainer() {
  return (
    <div>
        <Header/>
        <Switch>
          <Route exact path='/' component={Login}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/register' component={Register}/>
          <Route path='/dashboard' component={DocPortalComponent}/>
          <Route exact path="/doc/:doc_id" render={(doc_id) => <DocComponent id={doc_id} socket={socket}/>} />

        </Switch>
    </div>
  );
}
