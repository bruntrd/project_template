var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var Users = require('../../models/user');
var mongoose = require('mongoose');

module.exports = function(){
    console.log('does this happen ls');
    passport.use(new localStrategy({
            usernameField: 'userName',
            passwordField: 'password'
        },
        function(username, password, done) {


            Users.findOne({username: username}, function(err, user) {
                if (err) throw err;
                if (!user) {
                    return done(null, false, {message: 'Incorrect username and password'})
                }

                user.comparePassword(password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch)
                        return done(null, user);
                    else
                        done(null, false, {message: 'Incorrect username and password'});
                });
            });


        }));
};