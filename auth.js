const { PrismaClient } = require('@prisma/client');
const passport = require('passport');

const prisma = new PrismaClient();

var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


passport.use(new GoogleStrategy({
    clientID:     process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URL,
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    prisma.user.findFirst({
      where: { email: profile.email },
    }).then(user => {
      if(!user){
        return done(null, false, {message: 'user not found'});
      }
      if(!user.isActive){
        return done(null, false, {message: 'user not active'});
      }
      return done(null, user);
    }).catch(err => {
      return done(err, false,{message: 'Error occured'});
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });

module.exports = {passport};