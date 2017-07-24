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

    const currentDocs = [{name: 'doc1', id: 1}, {name: 'doc2', id: 2}, {name: 'doc3', id: 3}]
    return (
      <div>
        <h1 style ={{textAlign: 'center'}}> Dom Docs Portal </h1>
        <div style={{height: '200px', width: '100%', border: '2px solid black'}}>
          <ul>
            {currentDocs.map((doc) => (<li>{doc.name}</li>)
            )}
          </ul>
        </div>
      </div>
    );
  }
};

export default DocPortalComponent;
