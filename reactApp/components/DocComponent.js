import axios from 'axios';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Routes from '../routes';
import { Editor, EditorState, Modifier, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import  {
  styleMap,
  getBlockStyle,
  BLOCK_TYPES,
  BlockStyleControls,
  INLINE_STYLES,
  InlineStyleControls
} from './DocComponentStyles';

class RichEditorExample extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      currentDocument: '',
      docName: ''
    };
    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.handleTextUpdate = this.handleTextUpdate.bind(this);
  }

  _handleKeyCommand (command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
  }

  _onTab (e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType (blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle (inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  _toggleColor (toggledColor) {
    const {editorState} = this.state;
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(styleMap)
      .reduce((contentState, color) => {
        if (!color.startsWith('FONT'))
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

    this.onChange(nextEditorState);
  }

  componentDidMount() {
    // console.log('doc_id', this.props.id.match.params.doc_id);
    this.setState({currentDocument: this.props.id.match.params.doc_id});
    axios.get('http://localhost:3000/document')
    .then(response => {
      // console.log('resp data on start', response.data)
      response.data.forEach((doc) => {
        if(doc._id === this.state.currentDocument){
          // console.log('matched up');
          // console.log('doc', doc)
          this.setState({docName: doc.name});
          const parsedBody = doc.body ? JSON.parse(doc.body) : JSON.parse('{}');
          // console.log('newBody2', parsedBody);
          const finalBody = convertFromRaw(parsedBody);
          this.setState({editorState: EditorState.createWithContent(finalBody)});
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
      // console.log('res2', response2)
      response2.forEach((doc) => {
        if(this.state.currentDocument === this.props.id.match.params.doc_id){
          // console.log('in here')
          const newBody = convertToRaw(this.state.editorState.getCurrentContent());
          // console.log('aaaaa', newBody);
          axios.post('http://localhost:3000/document/update',{
            id: this.props.id.match.params.doc_id,
            body: JSON.stringify(newBody)
          })
          .catch((err) => {
            console.log('error', err);
          });
        }
      });
    });
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
      <div className="RichEditor-root">
        <Link to={'/'}><button>Back to Portal</button></Link>
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
          toggleColor={this._toggleColor.bind(this)}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
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
        <button onClick={this.handleTextUpdate}>Save</button>
      </div>
    );
  }
}

export default RichEditorExample;
<<<<<<< HEAD



// RaisedButton:
// onMouseDown={(e) => {this.toggleInlineStyle(e, style)}};
// ... 
// e.preventDefault()


// in react component for button:
// backgroundColor={this.state.editorState.getCurrentINlineStyle().has(style) ? colorToggled : colorUntoggled}
=======
>>>>>>> 7d6bf3faa759782a5ab79a800a1769f37a023429
