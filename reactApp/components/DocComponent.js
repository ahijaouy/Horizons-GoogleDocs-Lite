import axios from 'axios';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Routes from '../routes';
import { Editor, EditorState, Modifier, RichUtils, convertToRaw,
  convertFromRaw } from 'draft-js';
import  { styleMap, getBlockStyle, BlockStyleControls, InlineStyleControls,
  myBlockTypes } from './DocComponentStyles';
import { Row, Col, Input, CardPanel, Button, Icon,
  Card } from 'react-materialize';

class DocComponent extends React.Component {
  constructor (props) {
    super(props);
    console.log('props for DOC COMPONENT: ',this.props);
    this.state = {
      socket: this.props.socket,
      editorState: EditorState.createEmpty(),
      currentDocument: '',
      docName: '',
      currentUser: '',
      myColor: '',
      docUsers: [],
      history: [],
      showHist: false,
    };
    this.focus = () => this.refs.editor.focus();
    // this.onChange = (editorState) => this.setState({editorState});

    this.onChange = this._onChange.bind(this);
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.onTab = this._onTab.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.toggleColor = this._toggleColor.bind(this);

    this.handleTextUpdate = this.handleTextUpdate.bind(this);
    this.handleShowHist = this.handleShowHist.bind(this);
    this.handleHideHist = this.handleHideHist.bind(this);
    this.renderPast = this.renderPast.bind(this);
  }

  _onChange (editorState) {
    const selection = editorState.getSelection();
    const hasSelection = parseInt(selection.anchorOffset) - parseInt(selection.focusOffset);

    const newBody = hasSelection ? this.handleSendSelection(editorState) : this.handleSendText(editorState);

    this.setState({editorState});

    this.state.socket.emit('editor_change', {content: JSON.stringify(newBody), selection: JSON.stringify(selection)});
  }

  handleSendSelection (editorState) {
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    let toggledColor = this.state.myColor;

    const nextContentState = Object.keys(styleMap)
      .reduce((contentState, color) => {
        if (color.startsWith('BACKGROUND'))
        { return Modifier.removeInlineStyle(contentState, selection, color); }
        else
        { return contentState; }
      }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );
    const currentStyle = editorState.getCurrentInlineStyle();

    // // Unset style override for current color.
    // if (selection.isCollapsed()) {
    //   nextEditorState = currentStyle.reduce((state, color) => {
    //     return RichUtils.toggleInlineStyle(state, color);
    //   }, nextEditorState);
    // }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }

    console.log('NEW es with color:', nextEditorState);

    return convertToRaw(nextEditorState.getCurrentContent());
  }

  handleSendText (editorState) {
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    let toggledColor = this.state.myColor;

    const nextContentState = Object.keys(styleMap)
      .reduce((contentState, color) => {
        if (color === toggledColor)
        { return Modifier.removeInlineStyle(contentState, selection, color); }
        else
        { return contentState; }
      }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );
    console.log('NEW es with color:', nextEditorState);
    return convertToRaw(nextEditorState.getCurrentContent());
    // return convertToRaw(editorState.getCurrentContent());
  }

  componentDidMount() {
    // GET DOCUMENT ID FROM PROPS, AXIOS CALL TO GET STATE
    this.setState({currentDocument: this.props.id.match.params.doc_id});
    axios.get('http://localhost:3000/document')
    .then(response => {
      response.data.forEach((doc) => {
        if(doc._id === this.state.currentDocument){
          this.setState({docName: doc.name});
          const parsedBody = doc.body ? JSON.parse(doc.body) : JSON.parse('{}');
          const finalBody = convertFromRaw(parsedBody);
          this.setState({editorState: EditorState.createWithContent(finalBody)})
          this.setState({history: doc.history});
        }
      });
    });


    /* ***** START SOCKET FUNCTIONS ***** */
    console.log('socket', this.state.socket);

    // GET USER, EMIT JOIN DOC WITH THIS USER
    axios.get('http://localhost:3000/user')
    .then(response => {
      return new Promise((resolve, reject) => {
        console.log('got axios response', response,'and setting current user');
        resolve(this.setState({currentUser: response.data}));
      });
    })
    .then(() => {
      console.log('current user: ', this.state.currentUser);
      const currentDoc = this.state.currentDocument;
      const currentUser = this.state.currentUser;
      this.state.socket.emit('join_doc', { currentDoc, currentUser});
    });

    // LISTENER FOR SUCCESSFUL JOIN DOC
    this.state.socket.on('joined_doc', myColor => {
      console.log('setting state with color', myColor)
      this.setState({myColor});
    })

    // LISTENER FOR NEW USER JOINED DOC
    this.state.socket.on('user_joined', newUser => {
      console.log('USER', newUser, 'JOINED');
      const newUsers = this.state.docUsers;
      newUsers.push(newUser);
      this.setState({docUsers: newUsers});
      console.log('changed docUsers');
    });

    // LISTENER FOR CHANGE IN EDITOR STATE
    this.state.socket.on('editor_change', ({ content, selection, isSelection }) => {
      console.log('new selection state', JSON.parse(content), 'vs.');
      const parsedBody = JSON.parse(content);
      const finalBody = convertFromRaw(parsedBody);
      // const newES = EditorState.createWithContent(finalBody)
      const newES = (isSelection) ? EditorState.acceptSelection(finalBody) : EditorState.createWithContent(finalBody);

      this.setState({editorState: newES});
    });

    // LISTENER FOR ERROR MSG FROM SOCKET
    this.state.socket.on('errorMessage', msg => {
      console.log('ERROR FROM SOCKETS:', msg);
    });

    // LISTENING FOR USER LEAVE DOC
    this.state.socket.on('user_left', username => {
      const i = this.state.docUsers.indexOf(username);
      if (i >= 0) {
        const newUsers = this.state.docUsers.slice(0, i).concat(this.state.docUsers.slice(i+1, this.state.docUsers.length));
        this.setState({docUsers: newUsers });
      }
    });

    /* ***** END SOCKET FUNCTIONS ***** */
  }

  //
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



  _handleKeyCommand (command) {
    const {editorState} = this.state;
    // console.log('this: ',this,'editorState',editorState);

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this._onChange(newState);
      return true;
    }
  }

  _onTab (e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType (blockType) {
    // console.log('this: ',this,'editorState',this.state.editorState);

    this._onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType || 'unstyled'
      )
    );
  }

  _toggleInlineStyle (inlineStyle) {
    // console.log('this: ',this,'editorState',this.state.editorState);

    this._onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  _toggleColor (toggledColor) {
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    // console.log('this: ',this,'editorState',editorState);
    const newES = this.toggleColorHelper(toggledColor, {editorState}, selection);
    this.setState({editorState: newES});
  }

  toggleColorHelper(toggledColor, {editorState}, selection) {
    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(styleMap)
      .reduce((contentState, color) => {
        if (!color.startsWith('FONT') && !color.startsWith('BACKGROUND'))
        { return Modifier.removeInlineStyle(contentState, selection, color); }
        else
        { return contentState; }
      }, editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );
    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }

    return nextEditorState;
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
          {/* {!this.state.showHist ? */}
            <Col s={2}> <Button
              onClick={this.handleShowHist}
              fab='vertical' faicon='fa fa-plus'
              className='purple darken-4'
              large style={{bottom: '45px', right: '24px'}}
              icon='change_history'
              waves='light' floating >
              <Col s={1}> {this.state.history.map((past, i) => (
                <div key={i}><Button onClick={() => this.renderPast(past.content)}
                  className='deep-purple lighten-5 history_btn'
                  style={{color: 'black', width: '250px', right: '200px'}}
                  waves='light' >
                  {formatDate(past.date)}
                </Button></div>))} </Col>
            </Button> </Col>
            {/* :
            // <div>
            //   <Col s={1}> {this.state.history.map((past) => (
            //     <div><Button onClick={() => this.renderPast(past.content)}
            //       className='deep-purple lighten-5 history_btn'
            //       style={{color: 'black'}}
            //       waves='light' >
            //       {formatDate(past.date)}
            //     </Button></div>))} </Col>
            //   <Col s={1}> <Button onClick={this.handleHideHist} className='purple darken-4 history_btn'>
            //     Hide History
            //   </Button> </Col>
            // </div>
          } */}
        </Row>

        <Button onClick={this.handleTextUpdate} className='light-blue darken-1 doc_save_btn'>Save</Button>
      </div>
    );
  }
}

export default DocComponent;




/**** local helper function ***/
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






// RaisedButton:
// onMouseDown={(e) => {this.toggleInlineStyle(e, style)}};
// ...
// e.preventDefault()


// in react component for button:
// backgroundColor={this.state.editorState.getCurrentINlineStyle().has(style) ? colorToggled : colorUntoggled}
