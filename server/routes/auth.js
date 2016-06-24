var express= require('express')
var app=express();
var router = express.Router();
var passport = require('passport');
var jwt = require('jwt-simple');
var moment = require('moment');
var users = require('../models/user');
var nodemailer = require('nodemailer');

app.set('jwtTokenSecret', 'whatevs');


router.post('/register', function(req,res){

    users.find({'username': req.body.userName },function(request,response){
        if (response.length ==0){

            var newuser = {
                username: req.body.userName,
                password : req.body.password,
                firstname : req.body.firstName,
                lastname : req.body.lastName
            };


            users.create(newuser, function(err,results){
                    console.log('new user',newuser);
                    req.login(newuser,function(){
                        var user = req.user;
                        console.log('after login', user);
                        var expires = moment().add(10,'m').valueOf();
                        var token = jwt.encode({
                            iss: user,
                            exp: expires
                        }, app.get('jwtTokenSecret'));

                        res.json({
                            token: token,
                            _id: user._id,
                            expires: expires,
                            user: user.username,
                            firstname: user.firstname,
                            lastname: user.lastname,
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

router.put('/edit/:id', function(req,res){
    console.log('edit object',req.body);
    var userEdit = req.body;
    console.log('id', req.params.id);
    users.findById(req.params.id, function(err,user) {
        console.log('find user', user);
        user.password = userEdit.password;
        user.username = userEdit.username;
        user.firstname = userEdit.firstname;
        user.lastname = userEdit.lastname;

        user.save(function(err){
            req.login(user, function(err){
                if (err){console.log('error ' + err)};
                var user = req.user;
                console.log('after login', user);
                var expires = moment().add(10,'m').valueOf();
                var token = jwt.encode({
                    iss: user,
                    exp: expires
                }, app.get('jwtTokenSecret'));

                res.json({
                    token: token,
                    _id: user._id,
                    expires: expires,
                    user: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    valid: true
                });
            });
        });


    })

});

router.post('/forgot', function(req,res){

    var passwordGenerator = function(){
        var pw = '';
        for(var i=0;i<6;i++) {
            var num = Math.floor((Math.random() * 10) + 1);
            pw = num + pw
        }
        return pw

    };

    var newPassword = passwordGenerator();

    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "tpt.roomer@gmail.com",
            pass: "tptroomer"
        }
    });

// setup e-mail data with unicode symbols
    var mailOptions = {
        from: "tpt.roomer@gmail.com", // sender address
        to: req.body.email, // list of receivers
        subject: "New Password", // Subject line
        text: "Here is your new password, " + newPassword + ", please log back in with it and change it immediately" // plaintext body
    };




    users.findOne({username: req.body.username}, function(err,user){
        console.log('forgotuser',user);
        if (!user){
            res.send({message: 'nope'})
        } else{
            console.log('newpassword',newPassword);
            //user.password = newPassword;
             //send mail with defined transport object
            smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                }else{
                    console.log("Message sent: " + response.message);
                    user.password = newPassword;
                    user.save(function(err){
                        res.send({message: 'sent'})
                    })

                }



        // if you don't want to use this transport object anymore, uncomment following line
         // shut down the connection pool, no more messages
            });
            smtpTransport.close()
        }

    });





});


router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/relogin'
    }), function(req,res){

        var user = res.req.user;
        var expires = moment().add(10,'m').valueOf();
        var token = jwt.encode({
            iss: user,
            exp: expires
        }, app.get('jwtTokenSecret'));

        res.json({
            token: token,
            _id: user._id,
            expires: expires,
            user: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            valid: true
        });
    });








module.exports = router;