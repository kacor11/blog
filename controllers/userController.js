const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('express-validator');
const bcrypt = require('bcrypt');


exports.userCreatePOST = [
  validator.body('username', 'Please enter username').trim().isLength({min: 1}),
  validator.body('password', 'Please enter password').trim().isLength({min: 1})
    .custom((value, {req, loc, path}) => {
      if(value !== req.body.confirmPassword) {
        throw new Error('Passwords dont match');
      } else {
        return value
      }
    }),
  
  (req, res) => {
    const errors = validator.validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(404).json({errors: errors.array().map(error => error.msg)})
    }
    User.find( { username: req.body.username }, (err, user) => {  
      if(err) { return res.sendStatus(404) };
      if(user.length !== 0) { return res.status(409).json('This username is taken')};
      
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) { return res.sendStatus(404) }
        const newUser = new User({
          username: req.body.username,
          password: hash 
        })
  
        newUser.save((err) => {
          if(err) { return res.status(404)}
          return res.sendStatus(201);
        })
      })
    })
  }
]


exports.userLoginPOST = (req, res) => {
  User.findOne( {username: req.body.username}, (err, user) => {
    console.log(req.body)
    if(err) {
      return res.status(401).json( {error: 'Wrong username or password'} )
    }
    if(!user) {
      console.log('user')
      return res.status(401).json( {error: 'Wrong username or password'} )
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      console.log('password')
      if(err) { return res.status(401).json( {error: 'Wrong username or password'} ) }
      if(result) {
        const payload = {
          sub: user.id,
          iat: Date.now(),
          admin: user.isAdmin
        }
        const secret = process.env.TOKEN_SECRET;
        const token = jwt.sign(payload, secret , {expiresIn: '1d'})
        return res.status(200).json( {token: token} )
      } else {
        return res.status(401).json( {error: 'Wrong username or password'} );
      }

    })
  })
}