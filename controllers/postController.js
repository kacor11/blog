const Post = require('../models/Post');
const validator = require('express-validator');
const Comment = require('../models/Comment');



exports.postsGET = (req, res) => {
  Post.find({}, 'title text date')
    .sort('-date')
    .exec((err, posts) => {
      if(err) { return res.status(404)}
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
      console.log('witam blad')
      return res.sendStatus(404);
    } 
    console.log(req.user.id)
    console.log(post.author)
    console.log(req.user.id === post.author)
    if(req.user.isAdmin || req.user.id == post.author) {
      post.remove((err) => {
        if(err) {
          console.log('witam blad 1')
          return res.json({error: 'hjuston mam problem'})
        }
        console.log('witam sukces')
        return res.json({error: 'awantura o kase'})
      })
      // TUTAJ TRZEBA ERROR HANDLING ZROBIC ZIOMEK
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


