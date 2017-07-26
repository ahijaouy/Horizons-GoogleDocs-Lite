import React from 'react';
import Login from '../Authentication/Login';
import Register from '../Authentication/Register';
import Header from './Header/Header';
import { Route, Switch } from 'react-router-dom';
import DocPortalComponent from '../components/DocPortalComponent';
export default function AppContainer() {
  return (
    <div>
        <Header/>
        <Switch>
          <Route exact path='/' component={Login}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/register' component={Register}/>
          <Route path='/dashboard' component={DocPortalComponent}/>
        </Switch>
    </div>
  );
}