const Post = require('../models/Post');
const validator = require('express-validator');
const Comment = require('../models/Comment');



exports.postsGET = (req, res) => {
  Post.find({}, 'title text date', (err, posts) => {
    if(err) { return res.status(404)}
    return res.json(posts);
  })
}

exports.singlePostGET = (req, res) => {
  Post.findById(req.params.id)
    .populate('comments')
    .exec((err, post) => {
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
    post.save((err, post) => {
      if(err) { 
        return res.sendStatus(503)         
      }
      return res.status(201).json( {id: post._id} )
    }) 
  }]

exports.createCommentPOST = [
  validator.body('title', 'Your comment need to have title').trim().isLength({min: 1}),
  validator.body('text', 'Your comment must contain something').trim().isLength({min: 1}),
  validator.body('author', 'Your comment must have author').trim().isLength({min: 1}),
  (req, res) => {
    const errors = validator.validationResult(req);
      if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array().map(error => error.msg)})
      }
      const comment = new Comment({
        title: req.body.title,
        text: req.body.text,
        author: req.body.author
      })

      comment.save((err) => {
        if(err) {
          res.sendStatus(503)
        }
        Post.findByIdAndUpdate(req.params.id, { "$push": {"comments": comment._id} },(err) => {
          if(err) {
            res.sendStatus(503)
          }
          return res.sendStatus(200)
        })
      }) 
  }
]


