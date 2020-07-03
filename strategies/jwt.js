const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;

module.exports = new JwtStrategy(opts, function(jwt_payload, done) {
  if (Date.now() >= jwt_payload.exp) {
    return done(null, false);
  }
  User.findById(jwt_payload.sub, (err, user) => {
    if(err) {
      return done(err, false);
    }
    if(user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })

});
