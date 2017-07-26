import axios from 'axios';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Routes from '../routes';
import { Editor, EditorState, Modifier, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import  {
  styleMap,
  getBlockStyle,
  BlockStyleControls,
  InlineStyleControls,
  myBlockTypes
} from './DocComponentStyles';
import {
  Row,
  Col,
  Input,
  CardPanel,
  Button,
  Icon,
  Card } from 'react-materialize';
import {
  _onChange,
  _handleKeyCommand,
  _onTab,
  _toggleBlockType,
  _toggleInlineStyle,
  _toggleColor
} from './ToolbarMethods';
// const socket = require('socket.io-client')('http://localhost:3000');

function formatDate(olddate) {
  const date = new Date(olddate);
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  let minute = '00';
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minuteTemp =  date.getMinutes();
  if(String(minuteTemp).length === 1){
    minute = '0'+String(minuteTemp);
  }else{
    minute = minuteTemp;
  }

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ' : ' + hour +':'+minute;
}

class DocComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      socket: this.props.socket,
      editorState: EditorState.createEmpty(),
      currentDocument: '',
      docName: '',
      history: [],
      showHist: false,
    };
    this.focus = () => this.refs.editor.focus();
    // this.onChange = (editorState) => this.setState({editorState});

    this.onChange = _onChange.bind(this);
    this.handleKeyCommand = _handleKeyCommand.bind(this);
    this.onTab = _onTab.bind(this);
    this.toggleBlockType = _toggleBlockType.bind(this);
    this.toggleInlineStyle = _toggleInlineStyle.bind(this);
    this.toggleColor = _toggleColor.bind(this);
    // this.toggleColor = (color) => _toggleColor(color);

    this.handleTextUpdate = this.handleTextUpdate.bind(this);
    this.handleShowHist = this.handleShowHist.bind(this);
    this.handleHideHist = this.handleHideHist.bind(this);
    this.renderPast = this.renderPast.bind(this);
  }


  componentDidMount() {
    //
    // console.log('socket', socket)
    // socket.on('hi', () => {
    //   console.log('RECEIVED HI2');
    //
    // });
    this.state.socket.emit('typing', ' I fucking work')

    this.state.socket.on('typing', (msg) => {
      console.log('msg', msg)
    })
    //

    this.setState({currentDocument: this.props.id.match.params.doc_id});
    console.log('reaches document! with id: ', this.props, this.state.currentDocument)

    axios.get('http://localhost:3000/document')
    .then(response => {
      console.log('in here 1', this.props)
      response.data.forEach((doc) => {
        // console.log('in here 2.5doc', doc)
        if(doc._id === this.state.currentDocument){
            console.log('in here 2', doc.name)
          this.setState({docName: doc.name});
          const parsedBody = doc.body ? JSON.parse(doc.body) : JSON.parse('{}');
          const finalBody = convertFromRaw(parsedBody);
          this.setState({editorState: EditorState.createWithContent(finalBody)})
          this.setState({history: doc.history});
        }
      });
    });
  }

  handleTextUpdate(){
    axios.get('http://localhost:3000/document')
    .then(response => {
      return response.data;
    })
    .then(response2 => {
      response2.forEach((doc) => {
        if(this.state.currentDocument === this.props.id.match.params.doc_id){
          const newBody = convertToRaw(this.state.editorState.getCurrentContent());
          axios.post('http://localhost:3000/document/update',{
            id: this.props.id.match.params.doc_id,
            body: JSON.stringify(newBody),
            history: this.state.history,
          })
          .catch((err) => {
            console.log('error', err);
          });
        }
      });
    });
  }

  handleShowHist(){
    // console.log('hist', this.state.history[0].date)
    this.setState({showHist: true})
  }

  handleHideHist(){
    // console.log('hist', this.state.history)
    this.setState({showHist: false})
  }

  renderPast(past){
    // console.log('past', past);
    const parsedBody = JSON.parse(past)
    const finalBody = convertFromRaw(parsedBody);
    this.setState({editorState: EditorState.createWithContent(finalBody)})
  }



  render() {
    const {editorState} = this.state;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root doc_container">
        <Link to={'/dashboard'}><Button
          className='cyan'
          style={{color: 'white'}}
          waves='light' >
          Back to Portal
        </Button></Link>
        <h4>Name: {this.state.docName}</h4>
        <h5>ID: {this.state.currentDocument}</h5>
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
          editorState={editorState}
          toggleColor={this.toggleColor.bind(this)}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            blockRenderMap ={myBlockTypes}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="Tell a story..."
            ref="editor"
            spellCheck={true}
          />
        </div>
        <Row id="doc_btns">
          {!this.state.showHist ?
            <Col s={2}> <Button
              onClick={this.handleShowHist}
              fab='vertical' faicon='fa fa-plus'
              className='purple darken-4'
              large style={{bottom: '45px', right: '24px'}}
              icon='change_history'
              waves='light' floating >
              <Col s={1}> {this.state.history.map((past) => (
                <div><Button onClick={() => this.renderPast(past.content)}
                  className='deep-purple lighten-5 history_btn'
                  style={{color: 'black'}}
                  waves='light' >
                  {formatDate(past.date)}
                </Button></div>))} </Col>
            </Button> </Col> :
            <div>
              <Col s={1}> {this.state.history.map((past) => (
                <div><Button onClick={() => this.renderPast(past.content)}
                  className='deep-purple lighten-5 history_btn'
                  style={{color: 'black'}}
                  waves='light' >
                  {formatDate(past.date)}
                </Button></div>))} </Col>
              <Col s={1}> <Button onClick={this.handleHideHist} className='purple darken-4 history_btn'>
                Hide History
              </Button> </Col>
            </div>
          }
        </Row>

        <Button onClick={this.handleTextUpdate} className='light-blue darken-1 doc_save_btn'>Save</Button>
      </div>
    );
  }
}

export default DocComponent;



// RaisedButton:
// onMouseDown={(e) => {this.toggleInlineStyle(e, style)}};
// ...
// e.preventDefault()


// in react component for button:
// backgroundColor={this.state.editorState.getCurrentINlineStyle().has(style) ? colorToggled : colorUntoggled}
