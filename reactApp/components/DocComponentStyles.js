import React from 'react';
import StyleButton from './StyleButtonComponent';

// METHODS AND OBJECTS FOR BLOCK STYLES:
// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};
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
    </div>
  );
};

module.exports = {
  styleMap,
  getBlockStyle,
  BLOCK_TYPES,
  BlockStyleControls,
  INLINE_STYLES,
  InlineStyleControls
}