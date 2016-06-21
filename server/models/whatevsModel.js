var mongoose = require('mongoose');

var whatevsSchema = new mongoose.Schema({
    name: String,
    desc: String
});

module.exports = mongoose.model('whatevs', whatevsSchema);