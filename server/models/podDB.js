var mongoose = require('mongoose');

var podSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    channelId: { type: String, required: true }
});

module.exports = mongoose.model('pods', podSchema);