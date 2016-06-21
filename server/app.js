var express=require('express');
var app=express();
var index=require('./routes/index');
var path=require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var authRoutes = require('./routes/auth');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var dbRoute = require('./routes/db');
var jwt = require('jwt-simple');



var mongoURI = "mongodb://localhost:27017/passportTemplate";
var MongoDB = mongoose.connect(mongoURI).connection;

app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({secret: 'mySecret'}));

MongoDB.on('error', function(err){
    console.log('mongo connection error', err);

});

MongoDB.once('open', function(err){
    console.log('mongo connection open');
});

require('./config/passport')(app);

app.use('/db', dbRoute);
app.use('/auth', authRoutes)
app.use('/', index);

app.listen(app.get("port"), function(){
    console.log("listening on port: " + app.get("port"));
});