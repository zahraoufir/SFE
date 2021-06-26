const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const clickSchema =new Schema({ 
    userId: {
        type: Number,
        required: true,
    },
    linkId:
    {
        type:String,
        required:true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type:Date,
        default: Date.now
      }
},{timestamps : true});

const Click = mongoose.model('Click',clickSchema);
module.exports = Click;
