const Post = require('../models/Post');
const validator = require('express-validator');
const Comment = require('../models/Comment');
const redis = require('redis');
const client = redis.createClient({ port: 6379, host: '127.0.0.1' });



exports.postsGET = (req, res) => {
  Post.find({}, 'title text date author')
    .sort('-date')
    .exec((err, posts) => {
      if(err) { return res.status(404)}
      client.set(req.path, JSON.stringify(posts));
      return res.json(posts);
    })
}

exports.singlePostGET = (req, res) => {
  Post.findById(req.params.id)
    .populate('comments')
    .exec((err, post) => {
      if(err) { return res.status(403)}
      return res.json(post);
    }) 
}

exports.deletePostDELETE = (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if(err) {
      return res.sendStatus(404);
    } 
    if(req.user.isAdmin || req.user.id == post.author) {
      post.remove((err) => {
        if(err) {
          return res.sendStatus(401);
        }
      })
      client.DEL('/');
      return res.sendStatus(200)
    }
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
      text: req.body.text,
      author: req.user._id,
    })
    post.save((err, post) => {
      if(err) { 
        return res.sendStatus(503)         
      }
      client.DEL('/');
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
        return res.status(400).json({errors: errors.array().map(error => error.msg)})
      }
      const comment = new Comment({
        title: req.body.title,
        text: req.body.text,
        author: req.body.author
      })

      comment.save((err) => {
        if(err) {
          return res.sendStatus(503)
        }
        Post.findByIdAndUpdate(req.params.id, { "$push": {"comments": comment._id} },(err) => {
          if(err) {
            return res.sendStatus(503)
          }
          return res.status(200).json(comment)
        })
      }) 
  }
]


