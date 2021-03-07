const mongoose = require('mongoose');
const { Schema } = mongoose;

const VoteSchema = new Schema({
  _id: String,
  name: String,
  votes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Vote', VoteSchema);
