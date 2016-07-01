var express = require('express');
var router = express.Router();
var path = require('path')
//var mongodb = require('mongodb').MongoClient;
var pods = require('../models/podDB');

router.post('/', function(req,res){
        console.log(req.body);
        console.log('post hit');
        pods.create(req.body, function(err,post){
            //console.log(post.body);
            res.send('done');
        })
});



router.get('/', function(req,res){
    pods.find(function(err,pods){
        res.json(pods);
    });

});

router.put('/', function(req,res){
    var newPod = req.body;
    console.log(whateva);
    pods.update({_id : newPod.id}, {$set : {name: newPod.name, desc: newPod.desc}}, function(err,data){
        if (err) return handleError(err);
        res.send(data)
    })
});

router.delete('/:id', function(req,res){

    console.log(req.params.id);
    var id = req.params.id;
    pods.remove({_id : id}, function(err,removed){
        if (err) return handleError(err);
        res.send(removed);
    })
})





module.exports = router;