import  {
  styleMap,
  getBlockStyle,
  BlockStyleControls,
  InlineStyleControls,
  myBlockTypes
} from './DocComponentStyles';
import { Editor, EditorState, Modifier, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';


function _onChange (editorState) {
  console.log('this: ',this,'editorState',editorState);
  this.setState({editorState});
}

function _handleKeyCommand (command) {
  const {editorState} = this.state;
  console.log('this: ',this,'editorState',editorState);

  const newState = RichUtils.handleKeyCommand(editorState, command);
  if (newState) {
    _onChange(newState);
    return true;
  }
}

function _onTab (e) {
  const maxDepth = 4;
  this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
}

function _toggleBlockType (blockType) {
  console.log('this: ',this,'editorState',this.state.editorState);

  _onChange(
    RichUtils.toggleBlockType(
      this.state.editorState,
      blockType
    )
  );
}

function _toggleInlineStyle (inlineStyle) {

  console.log('this: ',this,'editorState',this.state.editorState);

  _onChange(
    RichUtils.toggleInlineStyle(
      this.state.editorState,
      inlineStyle
    )
  );
}

function _toggleColor (toggledColor) {
  const {editorState} = this.state;
  const selection = editorState.getSelection();
  console.log('this: ',this,'editorState',editorState);


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
}

module.exports = {
  _onChange,
  _handleKeyCommand,
  _onTab,
  _toggleBlockType,
  _toggleInlineStyle,
  _toggleColor
}
