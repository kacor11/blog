const mongoose = require('mongoose');
const Comment = require('./Comment')

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {type: String, required: true, },
  text: {type: String, required: true},
  date: {type: Date, default: Date.now},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
});

PostSchema.pre('remove', function (next) {
  Comment.deleteMany({ _id: { $in: this.comments }})
    .exec()
    next();
})

module.exports = mongoose.model('Post', PostSchema);
