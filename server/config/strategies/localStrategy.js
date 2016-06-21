var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
//var mongodb = require('mongodb').MongoClient;
var Users = require('../../models/user');
var mongoose = require('mongoose');

module.exports = function(){
    console.log('does this happen ls');
    passport.use(new localStrategy({
            usernameField: 'userName',
            passwordField: 'password'
        },
        function(username, password, done) {
            //var url = 'mongodb://localhost:27017/passportTemplate';
            //mongodb.connect(url,function(err,db){
            //    console.log('req.login' + username);
            //
            //    var collection = db.collection('users');
            //    collection.findOne({
            //        username: username
            //    },
                console.log('mongoose',username);
                Users.findOne({username : username },
                function(err, results){
                    console.log('error',err);

                    if (results == null){
                        console.log('no user');
                        done(null, false, {message:'no user'});

                    }
                    else if (results.password === password){

                        //console.log(results);
                        var user = results;
                        console.log('results ' + user);
                        done(null, user);
                    } else{
                        done(null, false, {message:'bad password'});
                    }


                });


        }));
};