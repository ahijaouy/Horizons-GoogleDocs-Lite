import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LoginActions from './LoginActions';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Navbar,
  NavItem,
  Row,
  Col,
  Input,
CardPanel, Button,
Card } from 'react-materialize';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
// import { push } from 'react-router-redux';

// component part
export function Login({ username, password, user, changeUsername, changePassword, login }) {
  //console.log(changeUsername('Andre'));
  return (
    <div>
      <Row>
          <Col s={6} offset={"s3"} >
            <Card
              className='white darken-1'
              title='Login'
              actions={[<Button key={"loginButton"} waves='light' onClick={() => login()}>Login</Button>]}>
                <span></span>
                <Row>
                  <Input s={6} label="Username" validate onChange={(e) => changeUsername(e.target.value)}/>
                  <Input s={6} label="Password" type='password' validate onChange={(e) => changePassword(e.target.value)} />
                </Row>
            </Card>
          </Col>
        </Row>
    </div>
  );
}

Login.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  user: PropTypes.object,
  changeUsername: PropTypes.func,
  changePassword: PropTypes.func,
  login: PropTypes.func

};

const mapStateToProps = (state) => {
  return {
    username: state.login.username,
    password: state.login.password,
    user: state.login.user
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);