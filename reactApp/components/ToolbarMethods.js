function _handleKeyCommand (command) {
  const {editorState} = this.state;
  const newState = RichUtils.handleKeyCommand(editorState, command);
  if (newState) {
    this.onChange(newState);
    return true;
  }
}

function _onTab (e) {
  const maxDepth = 4;
  this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
}

function _toggleBlockType (blockType) {
  this.onChange(
    RichUtils.toggleBlockType(
      this.state.editorState,
      blockType
    )
  );
}

function _toggleInlineStyle (inlineStyle) {
  this.onChange(
    RichUtils.toggleInlineStyle(
      this.state.editorState,
      inlineStyle
    )
  );
}

function _toggleColor (toggledColor) {
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

module.exports = {
  _handleKeyCommand,
  _onTab,
  _toggleBlockType,
  _toggleInlineStyle,
  _toggleColor
}
