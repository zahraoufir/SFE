const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const earningSchema =new Schema({
 
    userId:{
        type:Number,
        required:true
    },
    linkId:
    {
        type:String,
        required:true
    },
    originalPrice:
    {
        type:Number,
        required:true
    },
    pourcentage:
    {
        type:Number,
        required:true
    },
    price:
    { 
        type:Number,
        required:true
    },
  date:
  {
      type:Date,
      required:true
  },
 
 
  isPaidOut:
  {
      type:Boolean,
      required:true
  },
  
  isCenceled:
  {
      type:Boolean,
      required:true
  }

},{timestamps : true});

const Earning = mongoose.model('Earning',earningSchema);
module.exports = Earning;