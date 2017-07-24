import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios'

class DocPortalComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      currentDocs: [{name: 'doc1', id: 1}, {name: 'doc2', id: 2}, {name: 'doc3', id: 3}],
      newDoc: ''
    }
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

  }

  handleChangeName(e){
    console.log('a', e.target.value)
    this.setState({newDoc: e.target.value})
  }

  handleSubmit(e){
    e.preventDefault();
    const newState = this.state.currentDocs;
    const newDocsState = newState.concat({name: this.state.newDoc, id: this.state.currentDocs.length + 1})
    this.setState({currentDocs: newDocsState})
    /***** also update databse **/
  }

  render() {

    return (
      <div>
        <h1 style ={{textAlign: 'center'}}> Dom Docs Portal </h1>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.newDoc}
            placeholder="Add Document Here"
            onChange={this.handleChangeName}/>
            <input type="submit" onClick={this.handleSubmit}/>
        </form>
        <div style={{height: '200px', width: '100%', border: '2px solid black'}}>
          <ul>
            {this.state.currentDocs.map((doc) => (<li><Link to={`/doc/${doc.id}`}>{doc.name}</Link></li>)
            )}
          </ul>
        </div>
      </div>
    );
  }
};

export default DocPortalComponent;
