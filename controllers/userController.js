const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const JWT_SECRET = 'storeinosecret';
const mailgun = require("mailgun-js");
const { authSchema } = require('../helpers/validation_schema')
const { profileSchema } = require('../helpers/validation_schema')

const path = require('path')
var hbs = require('nodemailer-express-handlebars');

const register = (req, res, next) => {
    bcryptjs.hash(req.body.password, 10, async function (err, hashedPass) {
        if (err) {
            res.json({
                error: err
            })
        }
        // const {first_name, last_name, email, password } = req.body ;
        const result = await authSchema.validateAsync(req.body)
        User.findOne({ 'email': result.email }).exec((err, user) => {
            if (user) {
                console.log("email already exist");
                return res.json({
                    error: 'User with this email already exists.'
                });
            }
            const token = jwt.sign({ result }, 'accountactivatekey123', { expiresIn: '40m' })
            //console.log(token)

            // Step 1
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 465,
                secure: true,
                auth: {
                    user: 'khadija.naitsi022@gmail.com',
                    pass: '0696397473'
                },
                tls: { rejectUnauthorized: false }
            });

            transporter.use('compile', hbs({
                viewEngine: {
                    extName: ".handlebars",
                    partialsDir: path.resolve(__dirname, "../views"),
                    defaultLayout: false
                },
                viewPath: path.resolve(__dirname, "../views"),
                extName: ".handlebars"
            }));

            // Step 2
            let mailOptions = {
                from: 'khadija.naitsi022@gmail.com', // TODO: email sender
                to: req.body.email, // TODO: email receiver
                subject: 'Email',
                text: 'hello khadija',
                attachments: [{
                    filename: 'logo.jpg',
                    path: './images/email.png',
                    cid: 'email' //same cid value as in the html img src
                }],
                template: 'index',
                context: {
                    first_name: result.first_name,
                    last_name: result.last_name,
                    token: token
                }
            };


            // Step 3
            transporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.log(err)
                    return res.json({
                        error: err
                    })
                }
                console.log("Check email");
                return res.json({
                    message: 'Email has been sent, kindly activate your account'
                });

            });
        })
    })
}
//activate account
const activateAccount = (req, res, next) => {
    const { token } = req.body;
    if (token) {
        jwt.verify(token, 'accountactivatekey123', function (err, decodedToken) {
            if (err) {
                return res.status(400).json({ error: 'Incorrect or Expired Link.' })
            }
            else {
                const { result } = decodedToken;
                console.log(result);
                bcryptjs.hash(result.password, 10, function (err, hashedPass) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }

                    User.findOne({ 'email': result.email }).exec((err, user) => {
                        if (user) {
                            console.log("email already exist");
                            return res.status(400).json({ error: "User with this email already exists." });
                        }

                        User.findOne({}).sort({ 'id': -1 }).exec((err, doc) => {

                            if (doc) {
                                var max = doc.id + 1;
                                console.log(max);


                            } else {
                                var max = 1;
                                console.log(max);

                            }
                            let newUser = new User({
                                id: max,
                                first_name: result.first_name,
                                last_name: result.last_name,
                                full_name: result.first_name + ' ' + result.last_name,
                                email: result.email,
                                password: hashedPass
                            })
                            newUser.save()
                                .then(newUser => {
                                    console.log("after");

                                    res.json({
                                        message: 'User Added Successfully!'
                                    })
                                })
                                .catch(error => {
                                    res.json({
                                        message: error
                                    })
                                })
                        });

                    })

                });
            }
        })
    } else {
        return res.json({ error: 'Something went wrong !!!' })
    }
}
const login = (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({ $or: [{ email: email }] }).then(user => {
        if (user) {
            bcryptjs.compare(password, user.password, function (err, result) {
                if (result) {
                    const secret = JWT_SECRET;
                    let token = jwt.sign({ user: user }, secret, { expiresIn: '1h' });
                    res.json({
                        message: 'login successful',
                        token
                    })
                } else {
                    res.json({
                        message: 'password deas not mached!'
                    })
                }
            })
        } else {
            res.json({ massage: 'no user found' });
        }
    })
}






const forgotpassword = async (req, res, next) => {
    const email = req.body.email;
    User.findOne({ $or: [{ email: email }] }).then(user => {
        if (user) {
            const secret = JWT_SECRET + user.password;
            let token = jwt.sign({ _id: user._id }, secret, { expiresIn: '1h' });
            const link = `http://localhost:8081/reset/${token}`;

            User.updateOne({ 'email': email }, { resetlink: token }, function (err, success) {
                if (err) {
                    return res.status(400).json({ error: 'reset password link error' });
                } else {
                    //step 1
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'hnianagadir@gmail.com',
                            pass: '0671518844'
                        },
                        tls: { rejectUnauthorized: false }
                    });

                    transporter.use('compile', hbs({
                        viewEngine: {
                            extName: ".handlebars",
                            partialsDir: path.resolve(__dirname, "../views"),
                            defaultLayout: false
                        },
                        viewPath: path.resolve(__dirname, "../views"),
                        extName: ".handlebars"
                    }));

                    // Step 2
                    let mailOptions = {
                        from: 'hnianagadir@gmail.com', // TODO: email sender
                        to: req.body.email, // TODO: email receiver
                        subject: 'Email',
                        attachments: [{
                            filename: 'logo.jpg',
                            path: './images/email.png',
                            cid: 'email' //same cid value as in the html img src
                        }],
                        template: 'forgot',
                        context: {
                            first_name: user.first_name,
                            last_name: user.last_name,
                            token: token
                        }
                    };

                    // Step 3
                    transporter.sendMail(mailOptions, (err, data) => {
                        if (err) {
                            res.json({
                                message: 'Error Sending Email !!'
                            })
                        }
                        else{
                        res.json({
                            message: 'Email sent !!!'
                        })
                        }
                    });

                }
            });

        } else {
            res.json({
                message: 'user not found'
            })
        }
    });
}



const resetpassword = async function (req, res, next) {

    const token = req.body.token;
    const password = req.body.password;
    console.log(password);
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log(hashedPassword);
    if (token) {
        User.findOne({ $or: [{ resetlink: token }] }).then(user => {
            if (user) {
                var email = user.email;
                User.updateOne({ _id: user._id }, { $set: { password: hashedPassword, resetlink: ' ' } }, (err) => {
                    if (err) return res.status(200).json({
                        error: true,
                        code: 115,
                        message: "Erro to update user!"
                    })
                })
                console.log('user ist');
            } else {
                console.log('user not found');
            }
        });
    } else {
        console.log('token nexist pas');
    }

}

const profileUser = (req, res, next) => {
    const id = req.user;
    console.log(id);

    User.findOne({ 'id': id }, function (err, user) {
        if (err) return handleError(err);
        console.log(user)
        return res.json({
            user: user
        });
    });
}
const updateProfile = async (req, res, next) => {
    try {
        console.log('test1');

        // const {first_name, last_name, email, country, city, address } = req.body ;
        /*  const id = parseInt(req.body.id)     
         const zip_code = parseInt(req.body.zip_code)
         const first_name = req.body.first_name     
         const last_name = req.body.last_name     
         const email = req.body.email     
         const country = req.body.country     
         const city = req.body.city     
         const address = req.body.address  
         console.log(id+" "+zip_code+""+first_name);
         */
        console.log("req.body");
        console.log(req.body);
        const result = await profileSchema.validateAsync(req.body)
        console.log(result);

        User.findOne({ 'id': req.user }, function (err, user) {
            console.log(user.email);
            if (result.email === user.email) {
                console.log('update simple');

                var newvalues = {
                    $set:
                    {
                        "first_name": result.first_name,
                        "last_name": result.last_name,
                        "full_name": result.first_name + ' ' + result.last_name,
                        "email": result.email,
                        "address.country": result.country,
                        "address.city": result.city,
                        "address.zip_code": result.zip_code,
                        "address.address": result.address
                    }
                };
                User.updateOne({ 'id': req.user }, newvalues, function (err, user) {
                    if (err) return handleError(err);

                    console.log(user);
                    console.log('test');
                    return res.json({
                        user: user,
                        message: 'Profile updated successfully !!!'
                    });
                });
            } else {
                User.findOne({ 'email': result.email }, function (err, user) {
                    if (!user) {

                        console.log('update with verefication');
                        const token = jwt.sign({ result }, 'accountactivatekey123', { expiresIn: '40m' })
                        console.log(token);

                        console.log(req.body);
                        console.log('--------------------avant send------------------------')
                        // Step 1
                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'hnianagadir@gmail.com',
                                pass: '0671518844'
                            },
                            tls: { rejectUnauthorized: false }
                        });

                        transporter.use('compile', hbs({
                            viewEngine: {
                                extName: ".handlebars",
                                partialsDir: path.resolve(__dirname, "../views"),
                                defaultLayout: false
                            },
                            viewPath: path.resolve(__dirname, "../views"),
                            extName: ".handlebars"
                        }));

                        // Step 2
                        let mailOptions = {
                            from: 'hnianagadir@gmail.com', // TODO: email sender
                            to: req.body.email, // TODO: email receiver
                            subject: 'Email',
                            text: 'Storeino affiliate',
                            attachments: [{
                                filename: 'logo.jpg',
                                path: './images/email.png',
                                cid: 'email' //same cid value as in the html img src
                            }],
                            template: 'profile',
                            context: {
                                first_name: result.first_name,
                                last_name: result.last_name,
                                token: token
                            }
                        };


                        // Step 3
                        transporter.sendMail(mailOptions, function (err, data) {
                            if (err) {
                                console.log(err)
                                return res.json({
                                    error: err
                                })
                            }

                            return res.json({
                                message: 'Email has been sent, kindly activate your account'
                            });

                        });
                        console.log('--------------------après send------------------------')
                    } else {
                        console.log('email already exist')
                        res.json({
                            error: 'Email already exist'
                        });
                    }
                });


            }
        });
    } catch (err) {
        next(err);
    }
}

const updatePassword = (req, response, next) => {
    const { id, old_password, new_password } = req.body;
    bcryptjs.hash(new_password, 10, function (err, hashedPass) {

        User.findOne({ 'id': req.user }, function (err, user) {
            let hash = user.password;
            bcryptjs.compare(old_password, hash, function (err, res) {
                // res === true
                if (res) {
                    var newvalues = {
                        $set:
                        {
                            "password": hashedPass
                        }
                    };
                    User.updateOne({ 'id': req.user }, newvalues, function (err, res) {
                        if (err) return handleError(err);
                        else if (res) {
                            console.log('Password updated successfully');
                          
                            response.json({
                                message: 'Password updated successfully !!!'
                            });
                        }

                    });
                } else {
                    console.log('old password incorrect !!!');
                    response.json({
                        error: 'old password incorrect !!!'
                    });
                    /*   res.json({
                    error : 'Old password incorrect !!!'
                 });  */

                }

            });



        });
    });
}
const getID = (req, res, next)=>{
    const id=req.user;
    console.log("iiiiiiiiiiiiiiid"+id);
    res.json({id : id});
}
const activateNewEmail = (req, res, next)=>{
    const {token} = req.body;
    console.log("token "+token);
    if(token){
       jwt.verify(token,'accountactivatekey123', function (err, decodedToken) {
        if(err){  
        return res.status(400).json({error : 'Incorrect or Expired Link.'})
        }
        else {
        const {result} = decodedToken;
console.log(result.id);


            var newvalues = { $set: 
                {
                    "first_name" : result.first_name, 
                    "last_name" : result.last_name,
                    "email": result.email, 
                    "address.country": result.country, 
                    "address.city": result.city, 
                    "address.zip_code": result.zip_code, 
                    "address.address" : result.address
                } 
            };
            User.updateOne({ 'id': result.id }, newvalues, function(err, user)  {
                if (err) return handleError(err);
            console.log(result.id);
            console.log(user);
            console.log('email updated successfully');
            return res.json({
                user : user
            });
            }); 


    }
})
 } else{
        return res.json({error : 'Something went wrong !!!'})
    }  
}


const getPaypal = (req, res, next) => {
    const id = parseInt(req.user);
    User.findOne({ 'id': id }, function (err, user) {
        if (err) return handleError(err);
        return res.json({
            user : user
        });
    });
}
module.exports = {
    register, login, forgotpassword,getID,getPaypal, resetpassword, activateAccount, updatePassword, updateProfile, profileUser, activateNewEmail
}