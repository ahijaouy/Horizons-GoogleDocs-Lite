import React from 'react';
import StyleButton from './StyleButtonComponent';
import ColorControls from './StyleButtonColorComponent';
import { Redirect, Link } from 'react-router-dom';

// CUSTOM STYLE MAP
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  // COLOR STYLES
  red: { color: 'rgba(255, 0, 0, 1.0)', },
  orange: { color: 'rgba(255, 127, 0, 1.0)', },
  yellow: { color: 'rgba(180, 180, 0, 1.0)', },
  green: { color: 'rgba(0, 180, 0, 1.0)', },
  blue: { color: 'rgba(0, 0, 255, 1.0)', },
  indigo: { color: 'rgba(75, 0, 130, 1.0)', },
  violet: { color: 'rgba(127, 0, 255, 1.0)', },
};

// METHODS AND OBJECTS FOR BLOCK STYLES:
function getBlockStyle(block) {
  switch (block.getType()) {
  case 'blockquote': return 'RichEditor-blockquote';
  default: return null;
  }
}
const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
  {label: 'Left Indent', style: 'DraftEditor-alignLeft'}
];
const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
  .getCurrentContent()
  .getBlockForKey(selection.getStartKey())
  .getType();
  return (
    <div className="RichEditor-controls">
      <button><Link to={'/'}>Back to Portal</Link></button>
    {BLOCK_TYPES.map((type) =>
      <StyleButton
        key={type.label}
        active={type.style === blockType}
        label={type.label}
        onToggle={props.onToggle}
        style={type.style}
      />
    )}
    </div>
  );
};

// METHODS AND OBJECTS FOR INLINE STYLES:
var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}

      <ColorControls
        editorState={props.editorState}
        onToggle={props.toggleColor}
      /> 
    </div>
  );
};


// EXPORT ALL
module.exports = {
  styleMap,
  getBlockStyle,
  BLOCK_TYPES,
  BlockStyleControls,
  INLINE_STYLES,
  InlineStyleControls,
}
