const Link = require('../models/Link')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const session = require('express-session');
const nodemailer = require("nodemailer");
const JWT_SECRET='storeinosecret';
var sess;
const create = (req, res, next)=>{
    if(req.body.redirect.includes("storeino")){
    const newlink = new Link({
        userId:req.user,
        route: req.body.route,
        redirect: req.body.redirect,
        nbrClicks:0
    });
    newlink.save()
    .then(newlink => {
        res.json({
            message : 'link Added Successfully!'
        });
    })
    .catch(error =>{
        res.json({
            message : error
        });
    });
   }else{
    res.json({
        message : "the product should be of STOREINO"
    });
   }
}
const getAll = (req, res, next)=>{
    const token ='';
    const userId=parseInt(req.user) ;
      Link.find({userId:userId}).exec((err, result) =>{
        if (err) throw err;
        if(result){
            console.log(result);
        res.json({
           massage:"succesful",
            result
        });
        }else{
            res.json({
                message:"no result"
            });  
        }
      });
}
const deleteOne = (req, res, next)=>{
    var myquery = { _id: req.body.idLink };
    Link.deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
      });
}
const update = (req, res, next)=>{
    const idLink=req.body.idLink;
    const redirect =req.body.redirect;
            Link.updateOne({_id:idLink},{$set: { redirect: redirect }}, (err)=>{
                if (err) throw err;
                console.log("1 document updated");
            });
}
module.exports = {
    create,getAll,deleteOne,update
}