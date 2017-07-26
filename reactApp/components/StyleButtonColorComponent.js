import React from 'react';

const ColorControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div style={styles.controls}>
      {COLORS.map(type =>
        <StyleButtonColor
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          className="color_style_button"
        />
      )}
    </div>
  );
};

/* ****************** LOCAL HELPER FUNCITONS & OBJECTS ****************** */

class StyleButtonColor extends React.Component {
  constructor(props) {
    super(props);
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(props.style);
    };
  }
  render() {
    let style;
    if (this.props.active) {
      style = Object.assign({}, styles.styleButton, colorStyleMap[this.props.style]);
      // style = { ...styles.styleButton, ...colorStyleMap[this.props.style]};
    } else {
      style = styles.styleButton;
    }
    return (
      <span style={style} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

// COLOR STYLES
var COLORS = [
  {label: 'Red', style: 'red'},
  {label: 'Orange', style: 'orange'},
  {label: 'Yellow', style: 'yellow'},
  {label: 'Green', style: 'green'},
  {label: 'Blue', style: 'blue'},
  {label: 'Indigo', style: 'indigo'},
  {label: 'Violet', style: 'violet'},
];

// This object provides the styling information for our custom color
// styles.
const colorStyleMap = {
  red: { color: 'rgba(255, 0, 0, 1.0)', },
  orange: { color: 'rgba(255, 127, 0, 1.0)', },
  yellow: { color: 'rgba(180, 180, 0, 1.0)', },
  green: { color: 'rgba(0, 180, 0, 1.0)', },
  blue: { color: 'rgba(0, 0, 255, 1.0)', },
  indigo: { color: 'rgba(75, 0, 130, 1.0)', },
  violet: { color: 'rgba(127, 0, 255, 1.0)', },
};

const styles = {
  controls: {
    fontFamily: '\'Helvetica\', sans-serif',
    fontSize: 14,
    marginBottom: 10,
    userSelect: 'none',
  },
  styleButton: {
    color: '#999',
    cursor: 'pointer',
    marginRight: 16,
    padding: '2px 0',
  },
};

export default ColorControls;
// module.exports = {
//   ColorControls,
// }