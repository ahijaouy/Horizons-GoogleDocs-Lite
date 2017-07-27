import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Input, CardPanel, Button, Icon, Card } from 'react-materialize';

function filterDocs(array, user_id){
  // console.log('FD', array, user_id)
  const userDocs = [];
  array.forEach((doc) => {
    // console.log('doc', doc)
    doc.collaborators.forEach((user) => {
      // console.log('user', user)
      if(user._id === user_id){
        userDocs.push(doc)
      }
    })
  })
  return userDocs;
}

class DocPortalComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      currentDocs: [],
      currentUser:'',
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
    axios.get('http://localhost:3000/document')
      .then(response => {
        this.setState({currentDocs: response.data})
      });
    axios.get('http://localhost:3000/user')
    .then(response => {
      this.setState({currentUser: response.data});
    });
  }

  handleNewDoc(e){
    e.preventDefault();
    // console.log('new doc', e.target.value)
    this.setState({newDoc: e.target.value})
  }

  handleSharedDoc(e){
    e.preventDefault();
    this.setState({sharedDoc: e.target.value})
  }

  handleCreate(e){
    e.preventDefault();
    if(this.state.newDoc === ''){
      alert('Please specify a Document Name!')
    }else{
      axios.post('http://localhost:3000/document',{
        name: this.state.newDoc,
        body: ''
      })
      .then((resp) => {
        // console.log('curr docs', this.state.currentDocs);
        const newState = this.state.currentDocs;
        const newDocsState = newState.concat([resp.data]);
        this.setState({currentDocs: newDocsState, newDoc: ''})
      })
      .catch((err) => {
        console.log('err', err)
      })
    }
  }

  handleAdd(e){
    e.preventDefault();
    if(this.state.newDoc === ''){
      alert('Please specify a Document ID!')
    }else{
    axios.post('http://localhost:3000/user',{
      id: this.state.sharedDoc
    })
      .then((resp) => {
        // console.log(resp)
      })
      .catch((err) => {
        console.log('err', err)
      })
    }
  }

  handleSearch(e){
    e.preventDefault()
    console.log(e.target.value)
    this.setState({search: e.target.value})
    const currDocs = filterDocs(this.state.currentDocs, this.state.currentUser._id);
    const filteredDocs = currDocs.filter((item) => {
      console.log('item', item)
      if(item.name.includes(e.target.value) || item._id === e.target.value){
        return true
      }
      return false
    })
    // console.log('FD', filteredDocs)
    this.setState({searchList: filteredDocs})
  }

  render() {
    return (
      // <div id="portal_container">
      //   <h1 style ={{textAlign: 'center'}}> Welcome {this.state.currentUser.name} </h1>
      //     <input
      //       type="text"
      //       value={this.state.search}
      //       placeholder="Search for Docs"
      //       onChange={this.handleSearch}/>
      //   <form onSubmit={this.handleCreate}>
      //     <input
      //       type="text"
      //       value={this.state.newDoc}
      //       placeholder="New Document Title"
      //       onChange={this.handleNewDoc}/>
      //       <input type="submit" value="Create component" onClick={this.handleCreate}/>
      //   </form>
      //   <div style={{/* SHOULD HAVE NONE!!!! */}}>

      <div id="portal_container">
        <Row>
          <Col s={12}><h1 style ={{textAlign: 'center'}}> Welcome {this.state.currentUser.name} </h1></Col>
          <Input
            s={5}
            type="text"
            value={this.state.search}
            placeholder="  Search for Docs"
            onChange={this.handleSearch}>
            <Button floating><Icon className='cyan' medium>find_in_page</Icon></Button>
          </Input>
          <form onSubmit={this.handleCreate}>
            <Input
              s={5} offset={'s1'}
              type="text"
              value={this.state.newDoc}
              placeholder="  New Document Title"
              onChange={this.handleNewDoc}>
              <Button floating waves='light'>
                <Icon className='cyan' type="submit" value="Create component" onClick={this.handleCreate}>
                  add</Icon></Button>
            </Input>
          </form>
        </Row>
        <div>
          <h3>My Documents</h3>
          {!this.state.search ? filterDocs(this.state.currentDocs, this.state.currentUser._id).map((doc, i) => (<div key={i}><Link to={`/doc/${doc._id}`}>{doc.name}</Link><button>abc</button></div>))
          :this.state.searchList.map((doc, i) => (<div key={i}><Link to={`/doc/${doc._id}`}>{doc.name}</Link></div>))}
        </div>
        <form onSubmit={this.handleAdd}>
          <Row>
            <Input
              s={5}
              type="text"
              value={this.state.sharedDoc}
              placeholder="Paste a doc ID"
              onChange={this.handleSharedDoc}>
            </Input>
            <Col s={1}>
              <Button className='cyan' type="submit" onClick={this.handleAdd}>Add Shared Doc</Button>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
};

export default DocPortalComponent;
