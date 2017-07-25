import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import Routes from '../routes';
import HeaderComponent from '../components/HeaderComponent';
import RichEditorExample from '../components/DocComponent';
import {
  Navbar,
  NavItem,
SideNavItem, SideNav, Button } from 'react-materialize';


const AppContainer = () => {
  return (
    <div id="app_container">
      <Routes/>
    </div>
  );
};

export default AppContainer;
