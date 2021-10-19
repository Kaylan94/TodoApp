const mongoose = require('mongoose');

let TaskSchema = mongoose.Schema({
    owner:{
      type:String,
      required:true
    },
    task:{
        type:String,
        required:true
    },
    isCompleted:{
        type:Boolean,
        required:true
    },
    date_created:{
        type: Date,
        required:false,
        default: Date.now
    }
});

module.exports = mongoose.model('Tasks', TaskSchema);