var express = require('express');
var router = express.Router();
var path = require('path')
//var mongodb = require('mongodb').MongoClient;
var whatevs = require('../models/whatevsModel');

router.post('/', function(req,res){

        whatevs.create(req.body, function(err,post){
            res.send('done');
        })
});



router.get('/', function(req,res){
    whatevs.find(function(err,whateva){
        res.json(whateva);
    });

});

router.put('/', function(req,res){
    var whateva = req.body;
    console.log(whateva);
    whatevs.update({_id : whateva.id}, {$set : {name: whateva.name, desc: whateva.desc}}, function(err,data){
        if (err) return handleError(err);
        res.send(data)
    }
    )

});

router.delete('/:id', function(req,res){

    console.log(req.params.id);
    var id = req.params.id;
    whatevs.remove({_id : id}, function(err,removed){
        if (err) return handleError(err);
        res.send(removed);
    })
})





module.exports = router;