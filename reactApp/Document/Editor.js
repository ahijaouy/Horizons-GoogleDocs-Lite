import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './actions';
import PropTypes from 'prop-types';
import React from 'react';
import { } from 'react-materialize';
import { } from 'react-router-dom';
// import { push } from 'react-router-redux';

// component part
export function Editor({  }) {
  return (
    <div>
      <h1>Editor Container</h1>
    </div>
  );
}

Editor.propTypes = {

};

const mapStateToProps = (state) => {
  return {

  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
