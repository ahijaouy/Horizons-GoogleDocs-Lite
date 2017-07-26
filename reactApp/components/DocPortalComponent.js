import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Navbar,
  NavItem,
  Row,
  Col,
  Input,
  CardPanel,
  Button,
  Icon,
  Card } from 'react-materialize';

class DocPortalComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      currentDocs: [],
      newDoc: '',
      sharedDoc: '',
      search: '',
      searchList:[]
    }
    this.handleNewDoc = this.handleNewDoc.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSharedDoc = this.handleSharedDoc.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount(){
    socket.on('hi', () => {
      console.log('RECEIVED HI')
    });

    axios.get('http://localhost:3000/document')
      .then(response => {
        this.setState({currentDocs: response.data})
      });
  }

  handleNewDoc(e){
    e.preventDefault();
    this.setState({newDoc: e.target.value})
  }

  handleSharedDoc(e){
    e.preventDefault();
    this.setState({sharedDoc: e.target.value})
  }

  handleCreate(e){
    e.preventDefault();
    const newState = this.state.currentDocs;
    const newDocsState = newState.concat({name: this.state.newDoc, id: this.state.currentDocs.length + 1})
    this.setState({currentDocs: newDocsState, newDoc: ''})
    axios.post('http://localhost:3000/document',{
      name: this.state.newDoc,
      body: ''
    })
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
    e.preventDefault()
    // console.log(e.target.value)
    this.setState({search: e.target.value})
    const currDocs = this.state.currentDocs;
    const filteredDocs = currDocs.filter((item) => {
      if(item.name.startsWith(e.target.value) || item._id === e.target.value){
        return true
      }
      return false
    })
    this.setState({searchList: filteredDocs})
  }

  render() {
    return (
     <div id="portal_container">
      <form onSubmit={this.handleCreate}>
        <Row id="add_new_row">
          <Col s={4}>
            <Input
              type="text" id="add_new_row_input"
              // style={{display: 'inline-block'}}
              value={this.state.newDoc}
              placeholder="New Document Title"
              onChange={this.handleNewDoc}
            />
            </Col><Col s={1}>
          <Button className='cyan' waves='light'
            icon='add' type="submit"
            value="Create component"
            style={{display: 'inline-block'}}
            onClick={this.handleCreate}>
          </Button>
          </Col>
        </Row>
      </form>
      <Row id="portal_search_row">
        <Col s={3}>
          <input
            type="text"
            value={this.state.search}
            placeholder="Search for Docs"
            onChange={this.handleSearch}
          />
        </Col>
      </Row>
      {/* <Row> */}
        {/* <Col s={12}> */}
          <div style={{width: '100%'}}>
            <h3>My Documents</h3>
              {this.state.search === '' ?
              this.state.currentDocs.map((doc, i) => (<div key={i}><Link to={`/doc/${doc._id}`}>{doc.name}</Link></div>))
              :
              this.state.searchList.map((doc, i) => (<div key={i}><Link to={`/doc/${doc._id}`}>{doc.name}</Link></div>))}
          </div>
        {/* </Col> */}
        {/* <Col s={12}> */}
          <form onSubmit={this.handleAdd}>
            <input
              type="text"
              value={this.state.sharedDoc}
              placeholder="Paste a doc ID"
              onChange={this.handleSharedDoc}/>
              <Button className="cyan" type="submit" onClick={this.handleAdd}>Add Shared Document</Button>
          </form>
        {/* </Col> */}
      {/* </Row> */}
    </div>
    );
  }
};

export default DocPortalComponent;
