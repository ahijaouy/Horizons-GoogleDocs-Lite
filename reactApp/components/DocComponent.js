import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { Editor,
         EditorState,
         Modifier,
         RichUtils,
         convertToRaw,
         convertFromRaw } from 'draft-js';
import  { styleMap,
          getBlockStyle,
          BlockStyleControls,
          InlineStyleControls,
          myBlockTypes } from './DocComponentStyles';
import { Row,
         Col,
         Button,
         Input,
         Icon } from 'react-materialize';

import myKeyBindingFn from './KeyBindings';

class DocComponent extends React.Component {
  constructor (props) {
    super(props);
    console.log('props for DOC COMPONENT: ',this.props);
    this.state = {
      socket: this.props.socket,
      editorState: EditorState.createEmpty(),
      currentDocument: this.props.id.match.params.doc_id,
      docName: '',
      currentUser: '',
      myColor: '',
      docUsers: [],
      history: [],
      showHist: false,
      collab: '',

      cursors: [],
      collabArray: []
    };

    this.focus = () => this.refs.editor.focus();

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

    this.previousHighlight = null;

    this.handleCollab = this.handleCollab.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  _onChange (editorState) {
    const selection = editorState.getSelection();
    const hasSelection = parseInt(selection.anchorOffset) - parseInt(selection.focusOffset);

    if (this.previousHighlight) {
     editorState = EditorState.acceptSelection(editorState, this.previousHighlight);
     editorState = this.removeColorBackground(this.state.myColor, {editorState}, this.previousHighlight);
     editorState = EditorState.acceptSelection(editorState, selection);
   }

    const newBody = hasSelection ? this.handleSendSelection(editorState) : this.handleSendText(editorState);

    this.setState({editorState});

    this.state.socket.emit('editor_change', {content: JSON.stringify(newBody), selection: JSON.stringify(selection)});
  }

  handleSendSelection (editorState) {
    const selection = editorState.getSelection();

    this.previousHighlight = selection;
    console.log('set previous highlight:', this.previousHighlight);

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

    return convertToRaw(nextEditorState.getCurrentContent());
  }

  handleSendText (editorState) {
     const selection = editorState.getSelection();

    console.log('sending cursor move with color: ', this.state.myColor);
    this.state.socket.emit('cursor_move', { selection, color: this.state.myColor });

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
    this.setState({editorState: nextEditorState});

    return convertToRaw(nextEditorState.getCurrentContent());
  }

  componentDidMount() {
    // GET DOCUMENT ID FROM PROPS, AXIOS CALL TO GET STATE
    axios.get('http://localhost:3000/document')
    .then(response => {
      response.data.forEach((doc) => {
        if(doc._id === this.state.currentDocument){
          this.setState({docName: doc.name});
          this.setState({collabArray: doc.collaborators});
          const parsedBody = doc.body ? JSON.parse(doc.body) : JSON.parse('{}');
          const finalBody = convertFromRaw(parsedBody);
          this.setState({editorState: EditorState.createWithContent(finalBody)});
          this.setState({history: doc.history});
        }
      });
    });


    /* ***** START SOCKET FUNCTIONS ***** */

    // GET USER, EMIT JOIN DOC WITH THIS USER
    axios.get('http://localhost:3000/user')
    .then(response => {
      return new Promise((resolve, reject) => {
        console.log('got axios response');
        resolve(this.setState({currentUser: response.data}));
      });
    })
    .then(() => {
      console.log('current user: ', this.state.currentUser.name);
      const currentDoc = this.state.currentDocument;
      const currentUser = this.state.currentUser;
      this.state.socket.emit('join_doc', { currentDoc, currentUser});
    });

    // LISTENER FOR SUCCESSFUL JOIN DOC
    this.state.socket.on('joined_doc', myColor => {
      this.setState({myColor});
    });

    // LISTENER FOR NEW USER JOINED DOC
    this.state.socket.on('user_joined', newUser => {
      console.log('USER', newUser, 'JOINED');
      const newUsers = this.state.docUsers;
      newUsers.push(newUser);
      this.setState({docUsers: newUsers});
    });

    // LISTENER FOR CHANGE IN EDITOR STATE
    this.state.socket.on('editor_change', ({ content, selection, isSelection }) => {
      // console.log('new selection state', JSON.parse(content), 'vs.');
      const parsedBody = JSON.parse(content);
      const finalBody = convertFromRaw(parsedBody);
      const thisSelection = this;

      let newES = EditorState.createWithContent(finalBody);

      this.setState({editorState: newES});
    });

    // LISTENING FOR USER LEAVE DOC
    this.state.socket.on('user_left', username => {
      const i = this.state.docUsers.indexOf(username);
      if (i >= 0) {
        const newUsers = this.state.docUsers.slice(0, i).concat(this.state.docUsers.slice(i+1, this.state.docUsers.length));
        this.setState({docUsers: newUsers });
      }
    });

    // LISTENEG FOR OTHER'S CURSOR MOVE
    this.state.socket.on('cursor_move', ({ selection, color }) => {
      // console.log('*********other cursor at: ', selection);
      let es = this.state.editorState;
      const thisES = es;
      const thisSelect = es.getSelection();

      const incomingSelect = thisSelect.merge(selection);

      const tempES = EditorState.forceSelection(es, incomingSelect);
      this.setState({ editorState: tempES }, () => {
        const winSel = window.getSelection();
        const range = winSel.getRangeAt(0);
        const { top, left, bottom } = range.getClientRects()[0];

        const newCursor = { top, left, height: bottom - top, color };

        let cursorExists = false;
        let cursorArr;

        this.state.cursors.map((cursor, i) => {
          if (cursor.color === color) {
            cursorExists = i+1;
          }
        });
        if (cursorExists) {
          cursorArr = this.state.cursors.slice(0, cursorExists-1)
            .concat(this.state.cursors.slice(cursorExists, this.state.cursors.length));
          cursorArr.push(newCursor)
        } else {
          cursorArr = [...this.state.cursors, newCursor];
        }

        this.setState({ editorState: thisES, cursors: cursorArr });
      });

    });

    // LISTENER FOR ERROR MSG FROM SOCKET
    this.state.socket.on('errorMessage', msg => {
      console.log('ERROR FROM SOCKETS:', msg);
    });

    /* ***** END SOCKET FUNCTIONS ***** */
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
    this.setState({showHist: true});
  }

  handleHideHist(){
    this.setState({showHist: false});
  }

  renderPast(past){
    const parsedBody = JSON.parse(past);
    const finalBody = convertFromRaw(parsedBody);
    this.setState({editorState: EditorState.createWithContent(finalBody)});
  }

  handleCollab(e){
    e.preventDefault();
    this.setState({collab: e.target.value});
  }

  handleAdd(){
    if(this.state.collab === ''){
      alert('Please specify a Collaborator Name or ID!');
    }else{
      console.log('broke before axios');
      axios.post('http://localhost:3000/user',{
        name: this.state.collab,
        id: this.state.currentDocument
      })
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log('err', err)
      })
      this.setState({collab: ''})

    }
  }

  _handleKeyCommand (command) {
    const {editorState} = this.state;
    // console.log('this: ',this,'editorState',editorState);

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this._onChange(newState);
      return true;
    }
    if(command === 'myeditor-save'){
      this.handleTextUpdate();
      return 'handled';
    }
    return 'unhandled';
  }

  _onTab (e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType (blockType) {
    this._onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType || 'unstyled'
      )
    );
  }

  _toggleInlineStyle (inlineStyle) {
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
    const newES = this.toggleColorHelper(toggledColor, {editorState}, selection);
    this.setState({editorState: newES});
  }

  removeColorBackground(toggledColor, {editorState}, selection) {
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

    return nextEditorState;

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

        {this.state.cursors.length && (
          this.state.cursors.map( (cursor, i) =>
            (<div id="cursor_div" key={i}
              style={{
                height: cursor.height,
                top: cursor.top,
                left: cursor.left,
                backgroundColor: styleMap[cursor.color].backgroundColor
              }}>
            </div>)
          )
        )}

        <Link to={'/dashboard'}><Button
          className='cyan'
          style={{color: 'white'}}
          waves='light' >
          Back to Portal
        </Button></Link>
        <div style={{display: 'flex'}}>
        <h4 style={{flex:4}}>Name: {this.state.docName}</h4>
        <Input
          s={5} offset={'s1'}
          type="text"
          value={this.state.collab}
          placeholder="  Add Collaborators"
          onChange={this.handleCollab}>
          <Button floating waves='light' onClick={this.handleAdd}>
            <Icon className='cyan' type="submit" value="Create component" >
              add</Icon></Button>
        </Input>
        <div>
        {this.state.collabArray.map((user, i) => (<div key={i}>{user.name}</div>))}
      </div>
        </div>
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
            keyBindingFn={myKeyBindingFn}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="Tell a story..."
            ref="editor"
            spellCheck={true}
          />
        </div>
        <Row id="doc_btns">
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
