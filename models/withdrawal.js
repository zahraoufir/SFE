const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const withdrawalsSchema =new Schema({
    id_user :{
        type : Number,
        required : true
    },
    total: {
        type: Number,
        required: true,
        
    },
    earnings: {
        type: [mongoose.ObjectId],
        required: true,
    },
    date:
    {
        type:Date,
        required:true
    }
   
},{timestamps : true});

const Withdrawals = mongoose.model('Withdrawals',withdrawalsSchema);
module.exports = Withdrawals;