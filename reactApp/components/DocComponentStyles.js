import React from 'react';
import StyleButton from './StyleButtonComponent';
import ColorControls from './StyleButtonColorComponent';
import{ Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';
// CUSTOM STYLE MAP
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 26,
    padding: 2,
  },
  // FONT SIZES
  FONT_SMALL: { fontSize: 12 },
  FONT_MEDIUM: { fontSize: 18 },
  FONT_LARGE: { fontSize: 24 },
  FONT_XLARGE: { fontSize: 36 },

  // COLOR STYLES
  red: { color: 'rgba(255, 0, 0, 1.0)', },
  orange: { color: 'rgba(255, 127, 0, 1.0)', },
  yellow: { color: 'rgba(180, 180, 0, 1.0)', },
  green: { color: 'rgba(0, 180, 0, 1.0)', },
  blue: { color: 'rgba(0, 0, 255, 1.0)', },
  indigo: { color: 'rgba(75, 0, 130, 1.0)', },
  violet: { color: 'rgba(127, 0, 255, 1.0)', },

  // BACKGROUND COLOR STYLES
  BACKGROUND_RED: { backgroundColor: 'rgba(255, 0, 0, 0.4)'},
  BACKGROUND_ORANGE: { backgroundColor: 'rgba(255, 127, 0, 0.4)'},
  BACKGROUND_YELLOW: { backgroundColor: 'rgba(250, 250, 0, 0.4)'},
  BACKGROUND_GREEN: { backgroundColor: 'rgba(0, 180, 0, 0.3)'},
  BACKGROUND_BLUE: { backgroundColor: 'rgba(0, 0, 205, 0.3)'},
  BACKGROUND_INDIGO: { backgroundColor: 'rgba(15, 0, 130, 0.3)'},
  BACKGROUND_VIOLET: { backgroundColor: 'rgba(227, 0, 255, 0.3)'},
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
  {label: 'Left Indent', style: 'left' },
  {label: 'Right-indent', style: 'right'},
  {label: 'Center-indent', style:'center'}
];
const myBlockTypes = DefaultDraftBlockRenderMap.merge(new Map({
  center: {
    wrapper: <div className="center-align" />
  },
  right: {
    wrapper: <div className="right-align" />
  },
  left: {
    wrapper: <div className="left-align" />
  }
}));

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

// METHODS AND OBJECTS FOR INLINE STYLES:
var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
  {label: 'Small', style: 'FONT_SMALL'},
  {label: 'Medium', style: 'FONT_MEDIUM'},
  {label: 'Large', style: 'FONT_LARGE'},
  {label: 'XLarge', style: 'FONT_XLARGE'}
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  // const changeTextSize = (change) => {
  //   const {editorState} = props.editorState;
  //   const selection = editorState.getSelection();
  // };

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
  myBlockTypes
};
