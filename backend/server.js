// NPM Packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

// Local Imports
const User = require('./models/user');
const dbconfig = require('./config/database');
const router = require('./routes');
// Global Variables
const app = express();

// Setup Database Connection
mongoose.connect(dbconfig);

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Passport Config
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.verifyPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// Login Route
app.post('/login',
  passport.authenticate('local', { successRedirect: '/success',
    failureRedirect: '/failed'})
);

app.use('/', router);

app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!');
});
