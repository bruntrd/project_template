var passport = require('passport');
var Users = require('../models/user');

module.exports = function(app){
    console.log('where does this happen');
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user,done){
        console.log(user.username)
        //null is in place of err, and user is probably user.email or user.username
        done(null, user.username)
    });

    passport.deserializeUser(function(username, done){
        Users.find(username, function(err, user){
            if(err) done(err);
            done(null, user);
        });
    });


    require('./strategies/localStrategy')();
};