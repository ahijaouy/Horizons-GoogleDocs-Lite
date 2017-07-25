const mongoose = require('mongoose');
const User = require('./user')
const Schema = mongoose.Schema


const documentSchema = new Schema({
  name: String,
  body: String,
  owner: String,
  collaborators: Array,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  //CHECK THAT THIS IS RIGHT
  }
});

module.exports = mongoose.model('Document', documentSchema)
