import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios'

class DocPortalComponent extends React.Component {
  constructor() {
    super()
    this.state = {

    }
  }
  componentDidMount(){

  }

  render() {
    return (
      <div id="headerComponent" >
        <h2>this is header</h2>
      </div>
    );
  }
};

export default DocPortalComponent;
