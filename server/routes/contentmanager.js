var express= require('express');
var router = express.Router();
var path = require('path');
var http = require('http');

var token;


router.get('/login', function(req,res){

    var loginInfo = JSON.stringify( {
        'username' : 'administrator',
        'password' : 'Mad5ca1a'
        //'networkId' : '2'

    });
    var options = {
        host : 'avidmgconnect',
        port : 8080,
        path : '/ContentManager/api/rest/auth/login',
        method : 'POST',
        headers : {
            'Content-type' : 'application/json',
            'Content-Length' : Buffer.byteLength(loginInfo, 'utf8')

        }
    };
    var request = http.request(options, function(response){
        console.log('requesting login');
        var body = "";
        response.on('data', function(data){
            body += data;
        });
        response.on('end', function(){
            res.send(JSON.parse(body));
        });
    });
    request.on('error', function(e){
        console.log('Problem with request: ' + e.message);
    });
    request.write(loginInfo);
    request.end();


});

router.post('/playlists', function(req,res){
    console.log(req.body);
    token = req.body.token;
    console.log(token);

    var options = {
        host : 'avidmgconnect',
        port : 8080,
        path : '/ContentManager/api/rest/playlists/all?search=POD',
        method : 'GET',
        headers: {
            'apiToken' : token,
            'Content-Type' : 'application/json'
        }
    };

    var request = http.request(options, function(response){
        var body = "";
        response.on('data', function(data){
            body+=data;
        });
        response.on('end', function(){
            res.send(JSON.parse(body));
        });
    });
    request.on('error', function(e){
        console.log('problem with request: ' + e.message);
    });
    request.end();

});

router.post('/channels', function(req,res){

    console.log(token);

    var options = {
        host : 'avidmgconnect',
        port : 8080,
        path : '/ContentManager/api/rest/channels?search=Pod',
        method : 'GET',
        headers: {
            'apiToken' : token,
            'Content-Type' : 'application/json'
        }
    };

    var request = http.request(options, function(response){
        var body = "";
        response.on('data', function(data){
            body+=data;
        });
        response.on('end', function(){
            res.send(JSON.parse(body));
        });
    });
    request.on('error', function(e){
        console.log('problem with request: ' + e.message);
    });
    request.end();

});

router.post('/scheduleSet', function(req,res){
    console.log('request', req.body);
    var channel = req.body.channelID;
    var token = req.body.token;
    var frame = req.body.frameID;
    var date = req.body.date;
    var playlist = req.body.playlist
    console.log(playlist);

    var scheduleObject =  JSON.stringify({
        frames: [{
            id: frame,
            timeslots: [{
                //id: "268",
                deleteFlag: "false",
                recurrencePattern: "WEEKLY",
                playlist: {
                    id: playlist
                },
                name: "Main",
                playFullScreen: "true",
                weekdays: ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"],
                startDate: date + " 00:00:00",
                startTime: "00:00:00",
                endTime: "24:00:00"

            }]
        }]
    });

    //console.log(req.body.token);
    //console.log(req.body.id);

    var options = {
        host : 'avidmgconnect',
        port : 8080,
        path : '/ContentManager/api/rest/channels/'+channel+'/schedules',
        method : 'PUT',
        headers: {
            'apiToken': token,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(scheduleObject, 'utf8')
        }



    };

    var request = http.request(options, function(response){
        console.log('hello world');
        var body = "";
        response.on('data', function(data){
            body +=data
            console.log('this is our data', body);
        });
        response.on('end', function(){

            console.log('whatevs');
            res.send('hello');
        });
    });

    request.on('error', function(e){
        console.log('problem with request: ' + e.message);
    });
    request.write(scheduleObject);
    request.end();

});

router.post('/scheduleRemove', function(req,res){
    console.log('request', req.body);
    var channel = req.body.channelID;
    var token = req.body.token;
    var frame = req.body.frameID;
    var timeslot = req.body.timeslotID;
    var name = req.body.name;

    var scheduleObject =  JSON.stringify({
        frames: [{
            id: frame,
            name: name,
            timeslots: [{
                id: timeslot,
                deleteFlag: "true",

            }]
        }]
    });


    var options = {
        host : 'avidmgconnect',
        port : 8080,
        path : '/ContentManager/api/rest/channels/'+channel+'/schedules',
        method : 'PUT',
        headers: {
            'apiToken': token,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(scheduleObject, 'utf8')
        }



    };

    var request = http.request(options, function(response){
        console.log('hello world');
        var body = "";
        response.on('data', function(data){
            body +=data;
            console.log('this is our data', body);
        });
        response.on('end', function(){

            console.log('whatevs');
            res.send('hello');
        });
    });

    request.on('error', function(e){
        console.log('problem with request: ' + e.message);
    });
    request.write(scheduleObject);
    request.end();

});
router.post('/timeslots', function(req,res){

    console.log('request', req.body);
    var channel = req.body.channelID;
    var token = req.body.token;
    var frame = req.body.frameID;
    var fromDate = req.body.date;

    console.log(token);

    var options = {
        host : 'avidmgconnect',
        port : 8080,
        path : '/ContentManager/api/rest/channels/'+channel+'/frames/'+frame+'/timeslots?fromDate='+fromDate,
        method : 'GET',
        headers: {
            'apiToken': token,
            'Content-Type': 'application/json'
            //'Content-Length': Buffer.byteLength(scheduleObject, 'utf8')
        }
    };

    var request = http.request(options, function(response){
        var body = "";
        response.on('data', function(data){
            body+=data;
            console.log(body);
        });
        response.on('end', function(){
            res.send(JSON.parse(body));
        });
    });
    request.on('error', function(e){
        console.log('problem with request: ' + e.message);
    });
    request.end();

})




module.exports = router;

