const passport = require('passport');
const express = require("express");
const router = express.Router();

const {authMiddleware} = require("../middlewares");

router.get('/google',
    passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
));

router.get( '/google/callback',
    passport.authenticate( 'google', {
        failureMessage: true,
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

router.get('/google/success', authMiddleware, (req, res) => {
    // res.send('You have successfully logged in with Google.');
    res.redirect('/');
});

router.get( '/google/failure', (req, res) => {
    console.log('req',req.session.messages);
    res.redirect('/authfailed?message=' + req.session.messages[0]);
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
    });
    res.redirect('/');
});

module.exports = router;
