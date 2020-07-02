const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  title: {type: String, required: true, minLength: 1},
  text: {type: String, required: true, minLength: 1},
  author: {type: String, required: true, minLgenth: 1},
  date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Comment', CommentSchema);