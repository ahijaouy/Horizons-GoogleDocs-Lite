import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';
// import TutorHomeComponent from '../components/TutorHomeComponent';
// import TutorRegisterComponent from '../components/TutorRegisterComponent';
// import StudentHomeComponent from '../components/StudentHomeComponent';
// import HomeComponent from '../components/HomeComponent';
import Routes from '../routes';
import HeaderComponent from '../components/HeaderComponent';

const AppContainer = (props) => {
  return (
    <div>
      <HeaderComponent/>
    { Routes }
  </div>
  );
}

export default AppContainer;
