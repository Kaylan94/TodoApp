const mongoose = require('mongoose');

let BlogSchema = mongoose.Schema({
    username:{
      type:String,
      required:true
    },
    password:{
        type:String,
        required:true
    },
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        required:true
    },
    date_created:{
        type: Date,
        required:false,
        default: Date.now
    }
});

module.exports = mongoose.model('Blogs', BlogSchema);