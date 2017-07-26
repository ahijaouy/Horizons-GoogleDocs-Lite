// NPM Imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col, Input, Button, Card } from 'react-materialize';

// Local Imports
import * as actions from './actions';

// component part
export function Register({ name, username, password, user, changeUsername, changePassword, changeName,  register }) {
  return (
      <Row>
          <Col s={6} offset={"s3"} >
            <Card
              className='white darken-1'
              title='Create New Account'
              actions={[<Button key={"registerButton"} waves='light' onClick={() => register()}>Register</Button>]}>
                <Row>
                  <Input s={12} label="Name" validate onChange={(e) => changeName(e.target.value)}/>
                  <Input s={12} label="Username" validate onChange={(e) => changeUsername(e.target.value)}/>
                  <Input s={12} label="Password" type='password' validate onChange={(e) => changePassword(e.target.value)} />
                </Row>
            </Card>
          </Col>
        </Row>
  );
}

Register.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  password: PropTypes.string,
  user: PropTypes.object,
  changeUsername: PropTypes.func,
  changePassword: PropTypes.func,
  changeName: PropTypes.func,
  register: PropTypes.func

};

const mapStateToProps = (state) => {
  return {
    name: state.auth.name,
    username: state.auth.username,
    password: state.auth.password,
    user: state.auth.user
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);