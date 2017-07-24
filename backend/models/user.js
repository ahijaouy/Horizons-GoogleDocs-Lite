const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// define the schema for our user model
var userSchema = mongoose.Schema({
  name: String,
  username: String,
  password: String
});

userSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.statics.register = function(name, username, plainTextPassword, cb) {
  const newUser = new this();
  const saltRounds = 10;
  bcrypt.hash(plainTextPassword, saltRounds, function(err, password) {
    newUser.name = name;
    newUser.username = username;
    newUser.password = password;
    newUser.save(cb);
  });
};
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);