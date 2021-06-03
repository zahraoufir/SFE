const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const linkSchema =new Schema({
    userId: {
        type: String,
        required: true,
    },
    route: {
        type: String,
        required: true,
    },
    redirect: {
        type: String,
        required: true,
    },
},{timestamps : true});

const Link = mongoose.model('Link',linkSchema);
module.exports = Link;
