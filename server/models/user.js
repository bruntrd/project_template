var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    lastLogin: {type: Date, default: Date.now()}

});

//userSchema.pre('save', function(next){
//    console.log("Pre is starting");
//    var user = this;
//
//    if(!user.isModified('password')) return next;
//
//    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
//        if(err) return next(err);
//
//        console.log("Prehash");
//
//        bcrypt.hash(user.password, salt, function(err, hash){
//            if(err) return next(err);
//            console.log("Password Hashed");
//            user.password = hash;
//            next();
//        });
//    });
//});
//
//userSchema.methods.comparePassword = function(candidatePassword, cb){
//    console.log("Compare is starting");
//    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
//        if(err) return cb(err);
//        cb(null, isMatch);
//    });
//};

module.exports = mongoose.model('users', userSchema);