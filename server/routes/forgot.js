var express= require('express')
var app=express();
var router = express.Router();
var users = require('../models/user');
var nodemailer = require('nodemailer');

router.post('/', function(req,res){
    users.findOne({username: req.body.username}, function(err,user){
        if (!user){
            res.send({message: 'nope'})
        } else{
            var newPassword = passwordGenerator();
            console.log(newPassword);
        }

    });


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
        to: "bruntrd@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world ✔", // plaintext body
        html: "<b>Hello world ✔</b>" // html body
    };

// send mail with defined transport object
//    smtpTransport.sendMail(mailOptions, function(error, response){
//        if(error){
//            console.log(error);
//        }else{
//            console.log("Message sent: " + response.message);
//        }
//
//        // if you don't want to use this transport object anymore, uncomment following line
//        //smtpTransport.close(); // shut down the connection pool, no more messages
//    });

});


module.exports = router;

