import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Input, Button, Icon } from 'react-materialize';

function filterDocs(array, user_id){
  // console.log('FD', array, user_id)
  const userDocs = [];
  console.log("fdarr", array);
  array.forEach((doc) => {
    // console.log('doc', doc)
    doc.collaborators.forEach((user) => {
      // console.log('user', user)
      if(user._id === user_id){
        userDocs.push(doc);
      }
    });
  });
  console.log("fd", userDocs);
  return userDocs;
}

class DocPortalComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      currentDocs: [],
      currentUser:'',
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
    axios.get('http://localhost:3000/user')
    .then(response => {
      this.setState({currentUser: response.data});
    });
  }

  handleNewDoc(e){
    e.preventDefault();
    // console.log('new doc', e.target.value)
    this.setState({newDoc: e.target.value});
  }

  handleSharedDoc(e){
    e.preventDefault();
    this.setState({sharedDoc: e.target.value});
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
    console.log('initial docs', this.state.currentDocs);
    if(this.state.sharedDoc === ''){
      alert('Please specify a Document ID!')
    }else{
      axios.post('http://localhost:3000/user',{
        id: this.state.sharedDoc
      })
        .then((resp) => {
          axios.get('http://localhost:3000/document')
            .then(response => {
              this.setState({currentDocs: response.data});
            });

          // console.log('resp data', resp.data);
          // const newState2 = this.state.currentDocs.slice();
          // const newDocsState2 = newState2.concat([resp.data]);
          // console.log('newDocState', newDocsState2);
          // this.setState({currentDocs: newDocsState2, sharedDoc: ''})
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }

  handleSearch(e){
    e.preventDefault()
    console.log('search val', e.target.value)
    this.setState({search: e.target.value})
    const currDocs = filterDocs(this.state.currentDocs, this.state.currentUser._id);
    const filteredDocs = currDocs.filter((item) => {
      // console.log('item', item.name, e.target.value)
      if(item.name.includes(e.target.value) || item._id === e.target.value){
        return true
      }
      return false
    })
    // console.log('FD', filteredDocs)
    this.setState({searchList: filteredDocs})
  }

  render() {
    console.log('rendering');
    return (
      <div id="portal_container">
        <Row id="portal_header">
          <Col s={12}><h1 style ={{textAlign: 'center'}}> Welcome {this.state.currentUser.name} </h1></Col>

          <Col s={5} >
            <Input
              s={12}
              type="text"
              value={this.state.search}
              placeholder="  Search for Docs"
              onChange={this.handleSearch}>
              <Button floating><Icon className='cyan' medium>find_in_page</Icon></Button>
            </Input>
          </Col><Col s={5} offset={'s1'}><form onSubmit={this.handleCreate}>
            <Input
              className='sidekick_icon'
              s={12}
              type="text"
              value={this.state.newDoc}
              placeholder="   Create New Document"
              onChange={this.handleNewDoc}>
              <Button floating waves='light'>
                <Icon className='cyan' type="submit" value="Create component" onClick={this.handleCreate}>
                  description</Icon></Button>
            </Input>
          </form></Col>
        </Row>
        <div id="docs_container">
          <Row><Col s={6} m={5} l={4} offset={'s3 m4 l5'}><h3>My Documents</h3></Col></Row>
          <Row id="docs_list">
            {!this.state.search ? filterDocs(this.state.currentDocs, this.state.currentUser._id).map((doc, i) =>
            (<div key={doc._id}>
              <Col s={12} m={6} l={4}>
                <Link to={`/doc/${doc._id}/${this.state.currentUser.name}`} className='doc_link'>
                <Button large className='blue-grey lighten-3'>
                  {doc.name}
                </Button>
              </Link></Col>
            </div>)
          ) : this.state.searchList.map((doc,i) => (<div key={i}>
            <Col s={12} m={6} l={4}>
              <Link to={`/doc/${doc._id}/${this.state.currentUser.name}`} className='doc_link'>
              <Button large className='blue-grey lighten-3'>
                {doc.name}
              </Button>
            </Link></Col>
          </div>))}
        </Row>
        </div>
        <Row>
          <form onSubmit={this.handleAdd}>
            <Input
              s={5}
              type="text"
              value={this.state.sharedDoc}
              placeholder="   Paste a doc ID"
              onChange={this.handleSharedDoc}>
              <Button floating waves='light'>
                <Icon className='cyan' type="submit" value="Create component" onClick={this.handleAdd}>
                  input</Icon></Button>
          </Input>
          </form>
        </Row>
      </div>
    );
  }
}

export default DocPortalComponent;

// old code:
//{/* {this.state.search === '' ? this.state.currentDocs.map((doc, i) => (<div key={i}><Link to={`/doc/${doc._id}`}>{doc.name}</Link></div>))
//:this.state.searchList.map((doc, i) => (<div key={i}><Link to={`/doc/${doc._id}`}>{doc.name}</Link></div>))} */}
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
