import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios'
import Routes from '../routes';

class HeaderComponent extends React.Component {
  constructor() {
    super()
    this.state = {

    }
  }
  componentDidMount(){

  }

  render() {

    return (
      <div>
        <h1 style ={{textAlign: 'center'}}> Dom Docs - 'doc.id' </h1>
        <div style={{width: '100%', height: '30px', border: '3px solid black'}}>
          toolbar here
        </div>
    </div>
    )

  }
};

export default HeaderComponent;
