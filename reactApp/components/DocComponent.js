import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios'

class DocComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'doc1',
      body:''
    }
  }
  componentDidMount() {
    console.log('doc_id', this.props.match.params.doc_id)
    // if(DBName.id === this.props.params.doc_id)
    // this.setState({name: DBname})
  }


  render() {
    return (
      <div>
        <h1 style ={{textAlign: 'center'}}> Dom Docs Portal - {this.state.name} </h1>
        <div style={{height: '20px', width: '100%', border: '2px solid black', textAlign:'center'}}>
          TOOL BAR HERE
        </div>
      </div>
    );
  }
};

export default DocComponent;
