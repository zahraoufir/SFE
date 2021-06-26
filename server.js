const express = require("express");
const mongoose = require("mongoose");
const User = require('./models/User')
const morgan = require("morgan");
const session = require('express-session');
const bodyParser = require("body-parser");
const users = require('./routes/users');
const links = require('./routes/link');
const earning = require('./routes/earning');
const clicks = require('./routes/click');
const withdrawls = require('./routes/withdrawl');
const jwt = require('jsonwebtoken');
const jwt_decode =  require("jwt-decode");
const app=express();
const JWT_SECRET='storeinosecret';
var cors = require('cors');

mongoose.connect('mongodb://localhost:27017/sfe')
.then(()=>console.log('Connected to Mongodb'))
.catch(err=>console.error('Could not connect to Mongodb'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended :true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    next();
  });
  app.use(session({secret: 'secret'}));
 

  async function access(req, res, next) {
    var fullUrl =req.originalUrl;

    if((fullUrl=="/api/earning/cencel")||(fullUrl=="/api/register")||(fullUrl=="/api/earning/create")||(fullUrl.includes("/verefication-profile"))||(fullUrl.includes("/api/clicks/create"))||(fullUrl.includes("withdrawls/create"))||(fullUrl=="/api/login")||(fullUrl=="/api/forgot")||(fullUrl=="/api/verefication")||(fullUrl=="/api/reset/:token"))
    {
       next();
    }else{
      console.log("jj"+fullUrl);
    const key='storeinosecret';
    const token = req.headers["x-auth-token"];
   
    if(!token) return res.status(401).json({error:'Access denied '}); 
    try{
      const decoded = jwt.verify(token, key);
     
      const user = await User.findOne({id:decoded.user.id});
      if(user){
       
        req.user = decoded.user.id;
   
        next();
      }else{
       return res.json({error:'user not found '});
      }
    }catch(ex){
      return  res.status(401).json({error:'invalid token'});
    }
    }
    
}
app.use(access);
app.use('/api', users);
app.use('/api/links',access, links);
app.use('/api/earning',access, earning);
app.use('/api/clicks',access, clicks);
app.use('/api/withdrawals',access, withdrawls);

app.listen(4000, function () {
    console.log(" Server is listening at 3000");
  });