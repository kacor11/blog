const Post = require('../models/Post');
const validator = require('express-validator');



exports.postsGET = (req, res) => {
  Post.find({}, 'title text date', (err, posts) => {
    if(err) { return res.status(404)}
    return res.json(posts);
  })
}

exports.singlePostGET = (req, res) => {
  Post.find({_id: req.params.id }, (err, post) => {
    if(err) { return res.status(404)}
    return res.json(post);
  })
}

exports.createPostPOST = [
  validator.body('title', 'Your post need to have title').trim().isLength({min: 1}),
  validator.body('text', 'Your post must contain something').trim().isLength({min: 1}),
  (req, res) => {
    const errors = validator.validationResult(req);
    if(!errors.isEmpty()) {
      res.status(400).json({errors: errors.array().map(error => error.msg)})
      return
    }
    const post = new Post({
      title: req.body.title,
      text: req.body.text
    })
    post.save((err) => {
      if(err) { 
        res.sendStatus(503) 
        return
      }
      return res.sendStatus(201)
    }) 
  }]

