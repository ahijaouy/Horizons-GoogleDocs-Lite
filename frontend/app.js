var React = require('react');
var ReactDOM = require('react-dom');
import Register from './components/Register';

/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err;});

ReactDOM.render(<Register/>,
   document.getElementById('root'));
