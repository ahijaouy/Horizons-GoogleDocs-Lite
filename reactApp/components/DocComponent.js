import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios'

class DocComponent extends React.Component {
  constructor() {
    super()
    this.state = {

    }
  }


  render() {
    return (
      <div>
        <h1 style ={{textAlign: 'center'}}> Dom Docs Portal </h1>
        <div style={{height: '20px', width: '100%', border: '2px solid black', textAlign:'center'}}>
          TOOL BAR HERE
        </div>
      </div>
    );
  }
};

export default DocComponent;
