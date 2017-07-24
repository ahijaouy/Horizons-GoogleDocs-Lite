// NPM Packages
const express = require('express');
const router = express.Router();

// Local Imports
const User = require('./models/user');

router.post('/register', function (req, res) {
  console.log(req.body);
  User.register(req.body.name, req.body.username, req.body.password, console.log);

  res.send('Successfully Registered!');
});

router.get('/success', function(req, res) {
  res.json({authenticated: true, user: req.user});
});

router.get('/failed', function(req, res) {
  res.json({authenticated: false});
});

module.exports = router;