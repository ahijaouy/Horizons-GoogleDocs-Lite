import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Navbar,
  NavItem } from 'react-materialize';

class DocPortalComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      currentDocs: [],
      newDoc: '',
      sharedDoc: '',
      search: '',
      searchList:[]
    };
    this.handleNewDoc = this.handleNewDoc.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSharedDoc = this.handleSharedDoc.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount(){
    axios.get('http://localhost:3000/document')
      .then(response => {
        this.setState({currentDocs: response.data});
      });
  }

  handleNewDoc(e){
    e.preventDefault();
    this.setState({newDoc: e.target.value});
  }

  handleSharedDoc(e){
    e.preventDefault();
    this.setState({sharedDoc: e.target.value});
  }

  handleCreate(e){
    e.preventDefault();
    const newState = this.state.currentDocs;
    const newDocsState = newState.concat({name: this.state.newDoc, id: this.state.currentDocs.length + 1});
    this.setState({currentDocs: newDocsState, newDoc: ''});
    axios.post('http://localhost:3000/document',{
      name: this.state.newDoc,
      body: ''
    });
  }

  handleAdd(e){
    e.preventDefault();
    // const newState = this.state.currentDocs;
    // Document.find({id: this.state.sharedDoc}).exec()
    //   .then(response => {
    //     console.log('response HA', response)
    //     const newDocsState = newState.concat({name: this.state.sharedDoc, id: this.state.currentDocs.length + 1})
    //     this.setState({currentDocs: newDocsState, sharedDoc: ''})
    //   })
  }

  handleSearch(e){
    e.preventDefault();
    console.log(e.target.value);
    this.setState({search: e.target.value});
    const currDocs = this.state.currentDocs;
    const filteredDocs = currDocs.filter((item) => {
      if(item.name.startsWith(e.target.value) || item._id === e.target.value){
        return true;
      }
      return false;
    });
    console.log('find me', filteredDocs);
    this.setState({searchList: filteredDocs});
  }

  render() {
    return (
      <div>
        <Navbar brand='Horizons GoogleDocs Lite' right>
           <NavItem><Link to="/">Logout</Link></NavItem>
        </Navbar>
        <h1 style ={{textAlign: 'center'}}> Dom Docs Portal </h1>
          <input
            type="text"
            value={this.state.search}
            placeholder="Search for Docs"
            onChange={this.handleSearch}/>
        <form onSubmit={this.handleCreate}>
          <input
            type="text"
            value={this.state.newDoc}
            placeholder="New Document Title"
            onChange={this.handleNewDoc}/>
            <input type="submit" value="Create component" onClick={this.handleCreate}/>
        </form>
        <div style={{height: '200px', width: '100%', border: '2px solid black'}}>
          <h3>My Documents</h3>
            {this.state.search === '' ? this.state.currentDocs.map((doc) => (<div><Link to={`/doc/${doc._id}`}>{doc.name}</Link></div>))
          :this.state.searchList.map((doc) => (<div><Link to={`/doc/${doc._id}`}>{doc.name}</Link></div>))}
        </div>
        <form onSubmit={this.handleAdd}>
          <input
            type="text"
            value={this.state.sharedDoc}
            placeholder="Paste a doc ID"
            onChange={this.handleSharedDoc}/>
            <input type="submit" value="Add Shared Document" onClick={this.handleAdd}/>
        </form>
      </div>
    );
  }
}

export default DocPortalComponent;
