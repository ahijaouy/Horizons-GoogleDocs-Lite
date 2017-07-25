import React from 'react';
import axios from 'axios';
import {
  Navbar,
  NavItem,
  Row,
  Col,
  Input,
CardPanel, Button,
Card } from 'react-materialize';
import { Redirect, Link } from 'react-router-dom';




class Login extends React.Component {
  constructor() {
    super();
    this.username = "";
    this.password = "";
    this.state = {
      authenticated : false
    };
  }

  updateUsername(text) {
    this.username = text;
  }

  updatePassword(text) {
    this.password = text;
  }
  handleLogin(event) {
    axios.post('http://localhost:3000/login', {
      username: this.username,
      password: this.password
    }).then((resp) => {
      this.setState({authenticated: resp.data.authenticated});
      this.username = '';
      this.password = '';
    });
  }

  render() {
    return (
      this.state.authenticated ? (
        <Redirect to="/dashboard"/>
      ) : (

      <div>
         <Navbar brand='Horizons GoogleDocs Lite' right>
           <NavItem><Link to="/register">Register</Link></NavItem>
        </Navbar>
        <Row>
          <Col s={6} offset={"s3"} >
            <Card
              className='white darken-1'
              title='Login'
              actions={[<Button key={"loginButton"} waves='light' onClick={(e) => this.handleLogin(e)}>Login</Button>]}>
                <span></span>
                <Row>
                  <Input s={6} label="Username" validate onChange={(e) => this.updateUsername(e.target.value)}/>
                  <Input s={6} label="Password" type='password' validate onChange={(e) => this.updatePassword(e.target.value)} />
                </Row>
            </Card>
          </Col>
        </Row>
      </div>
    ));
  }
}


export default Login;
