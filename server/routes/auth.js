var express= require('express')

var app=express();

var router = express.Router();
//var mongodb = require('mongodb').MongoClient;
var passport = require('passport');
var jwt = require('jwt-simple');
var moment = require('moment');
var users = require('../models/user');

app.set('jwtTokenSecret', 'whatevs');


router.post('/register', function(req,res){

    users.find({'username': req.body.userName },function(request,response){
        if (response.length ==0){
            //var url = 'mongodb://localhost:27017/passportTemplate';
            //mongodb.connect(url,function(err,db){
            //    var collection = db.collection('users');
            //    var user = {
            //        username: req.body.userName,
            //        password: req.body.password
            //    };
            var newuser = {
                username: req.body.userName,
                password : req.body.password
            };


                //going to need a find first to see if the user has already been created, then throw back error if true
                //collection.insert(user, function(err,results){
            users.create(newuser, function(err,results){
                    console.log(newuser);
                    req.login(newuser,function(){
                        var user = req.user.username;
                        var expires = moment().add(10,'m').valueOf();
                        var token = jwt.encode({
                            iss: user,
                            exp: expires
                        }, app.get('jwtTokenSecret'));

                        res.json({
                            token: token,
                            expires: expires,
                            user: user,
                            valid: true
                        });

                    });

                })
            //})

        } else {
            res.send('unavailable');
        }
    });




});
router.get('/relogin', function(req,res){
    console.log('failure redirect');
    console.log(req.body);
    res.send({message: 'Incorrect Username/Password', valid: false});
});

router.get('/logout', function(req,res){
    req.logout();
    res.send({message: 'Successfully Logged Out'})
});

router.get('/newToken', function(req,res){

})


//router.get('/profile', function(req,res){
//    var expires = moment().add(1,'days').valueOf();
//    console.log(expires, req.user);
//    //var token = jwt.encode({
//    //    iss: req.user.userName,
//    //    exp: expires
//    //}, router.get('jwtTokenSecret'));
//
//    console.log('say whaaat');
//    //res.json(token);
//});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/relogin'
    }), function(req,res){
        var user = req.user.username;
        var expires = moment().add(10,'m').valueOf();
        var token = jwt.encode({
            iss: user,
            exp: expires
        }, app.get('jwtTokenSecret'));

        res.json({
            token: token,
            expires: expires,
            user: user,
            valid: true
        });
    });




module.exports = router;