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
      <div 
        id="headerComponent"
        style={{width: '100%', height: '15px', backgroundColor:'blue'}}>
        this is header
      </div>
    );
  }
};

export default DocPortalComponent;
