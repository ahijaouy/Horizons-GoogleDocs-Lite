// import PropTypes from 'prop-types';
import React from 'react';
// import { connect } from 'react-redux';
import Login from '../Login/Login';
import Header from '../Header/Header';
import { Route, Switch } from 'react-router-dom';
import DocPortalComponent from '../components/DocPortalComponent';
export default function AppContainer() {
  return (
    <div>
        <Header/>
        <Switch>
          <Route exact path='/' component={Login}/>
          <Route path='/dashboard' component={DocPortalComponent}/>
        </Switch>
    </div>
  );
}

// AppContainer.propTypes = {
//   name: PropTypes.string,
// };

// const mapStateToProps = (state) => {
//   return {
//   };
// };

// const mapDispatchToProps = (/* dispatch */) => {
//   return {
//   };
// };

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(AppContainer);
