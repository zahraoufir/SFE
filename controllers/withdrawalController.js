const Withdraw = require('../models/withdrawal')
const Earning = require('../models/Earning')
const User = require('../models/User')
const path=require('path')
var hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer')

//const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

const paypal = require('@paypal/checkout-server-sdk');
// 1a. Import the SDK package
//const paypal = require('checkoutNodeJssdk');

// 1b. Add your client ID and secret
const PAYPAL_CLIENT = 'ATTWlE47S-sXHiUuTqOSKBY3f7kZAPJPp597yfrshknFFo5GjC1MLdswKR4eetIGHKJtmrJDWdVDK0CK';
const PAYPAL_SECRET = 'EF7QFvXjghT1TJ33ZYkr9xdj7WaF-HdYgbaefD40D0mKJK_2IURwdcCVg-bNpieNym36AZsr9x1FXidb';

// 1c. Set up the SDK client
const env = new paypal.core.SandboxEnvironment(PAYPAL_CLIENT, PAYPAL_SECRET);
const client = new paypal.core.PayPalHttpClient(env);

const afficher = (req, res, next) => {
      const id = req.user;
    //  console.log(id);

    Withdraw.find({ 'id_user': id }, function (err, all) {
        if (err) return handleError(err);
        return res.json({
            withdrawals: all
        });
    });
}

const ajouter = (req, res, next) => {
    
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = yyyy +'-'+ mm + '-' + dd ;
    console.log(today);
    Earning.find({ 'userId': 5 , 'isPaidOut': false }, function (err, earning) {
        if (err) return handleError(err);

        const list = earning;
        console.log(list);
        let i;
        let array=[]

        for(i=0;i<list.length;i++){
            array.push(list[i]._id);
        }
           // console.log(array);
            let newWithdraw = new Withdraw({
                id_user: 1,
                total: 23.99,
                earnings: array,
                date: today
            })
            newWithdraw.save()
                .then(newWithdraw => {
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



}


const get_total = (req, res, next) => {

  //  const id = parseInt(req.user);
    const id = parseInt(req.body.id);
  //const id = 1
    console.log(id)
    Earning.aggregate([

        {
            $group: { _id: { userId: "$userId", isPaidOut: "$isPaidOut"  }, sum: { $sum: "$price" } }
        },
        {
            $match: {
                $and: [
                    { "_id.userId": { $eq: id } },
                    { "_id.isPaidOut": { $eq: false } }
                ]             
            }

        }
    ])
        .then(sum => {
            console.log(sum);

            res.json({
                total: sum
            })
        })
        .catch(error => {
            res.json({
                message: error
            })
        })

    console.log("okey");
}


const get_total_withdraw = (req, res, next) => {

    //  const id = parseInt(req.user);
      const id = parseInt(req.user);
  //  const id = 1
    //---------------------------TODAY
      console.log(id)
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var hh = today.getHours();
      var ii = today.getMinutes();
      var ss = today.getSeconds();
      today = yyyy +'-'+ mm + '-' + dd +' '+ hh + ':' + ii + ':' + ss;
      console.log(today);
    //-----------------------------last 7 day

      var last = new Date(today);
        last.setDate(last.getDate() - 7);

        console.log(last);



      Earning.aggregate([
  
          {
              $group: { _id: { userId: "$userId",date: "$date", isPaidOut: "$isPaidOut"  }, sum: { $sum: "$price" } }
          },
          {
              $match: {
                  $and: [
                      { "_id.userId": { $eq: id } },
                      { "_id.isPaidOut": { $eq: false } },
                      {"_id.date": {
                        $gte: new Date("2000-01-01"), 
                        $lt: new Date(last)
                    }}
                  ]             
              }
  
          }
      ])
          .then(sum => {
              console.log(sum);
  
              res.json({
                  total: sum
              })
          })
          .catch(error => {
              res.json({
                  message: error
              })
          })
  
      console.log("okey");
  }
  





const get_total_current = (req, res, next) => {

    //  const id = parseInt(req.user);
      const id = parseInt(req.user);
   // const id = 1
    //---------------------------TODAY
      console.log(id)
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var hh = today.getHours();
      var ii = today.getMinutes();
      var ss = today.getSeconds();
      today = yyyy +'-'+ mm + '-' + dd +' '+ hh + ':' + ii + ':' + ss;
      console.log("today---------------------------"+today);
    //-----------------------------last 7 day

      var last = new Date(today);
        last.setDate(last.getDate() - 7);

        console.log("last-------------------"+last);

        var thisday = new Date(today);
        thisday.setDate(thisday.getDate() + 1);

        console.log("NEW thisday-------------------"+new Date(thisday));



        Earning.aggregate([
  
            {
                $group: { _id: { userId: "$userId",date: "$date", isPaidOut: "$isPaidOut"  }, sum: { $sum: "$price" } }
            },
            {
                $match: {
                    $and: [
                        { "_id.userId": { $eq: id } },
                        { "_id.isPaidOut": { $eq: false } },
                        {"_id.date": {
                          $gte: new Date("2021-05-05"), 
                          $lt: thisday
                      }},
                    ]             
                }
    
            }
        ])
            .then(sum => {
                console.log(sum);
    
                res.json({
                    total: sum
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
    
  
      console.log("okey");
  }
  
  




const earning = (req, res, next) => {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var ii = today.getMinutes();
    var ss = today.getSeconds();
    today = yyyy +'-'+ mm + '-' + dd +' '+ hh + ':' + ii + ':' + ss;
    console.log(today);

    let newEarning = new Earning({
        userId: 1,
        linkId: 2,
        originalPrice: 60.9,
        pourcentage: 10,
        price: 6.09,
        date: today,
        isPaidOut: false,
        isCenceled: false,
    })
    newEarning.save()
        .then(newEarning => {
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


}

const  testPaypal = async (req, res, next) => {

const total = req.body.total;
 console.log(total);
 //const total = 0.09;
  // 3. Call PayPal to set up a transaction with payee
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: total
      },
      payee: {
        email_address: req.body.paypal
      }
    }]
  });

  let order;
  try {
    order = await client.execute(request);
    //-----------------------------------------------------INSERT WITHDRAW
    const id = req.user
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var ii = today.getMinutes();
    var ss = today.getSeconds();
    today = yyyy +'-'+ mm + '-' + dd +' '+ hh + ':' + ii + ':' + ss;
    console.log(today);
    Earning.find({ 'userId': id , 'isPaidOut': false }, function (err, earning) {
        if (err) return handleError(err);
        console.log(earning);
        const list = earning;
        console.log(list);
        let i;
        let array=[]

        for(i=0;i<list.length;i++){
            array.push(list[i]._id);
        }
           // console.log(array);
            let newWithdraw = new Withdraw({
                id_user: id,
                total: total,
                earnings: array,
                date: today
            })
            newWithdraw.save()
                .then(newWithdraw => {
                    console.log("Withdraw Added Successfully!");
        
                })
                .catch(error => {
                    console.log("Insert ERROR!");

                })
   
    //-------------------------------------------UPDATE USER
    var newvalues = { $set: 
        {
            "paypal.email" : req.body.paypal
        } 
    };
    User.updateOne({ 'id': id }, newvalues, function(err, user)  {
        if (err) return handleError(err);
       
      
       console.log('user updated successfuly');
       console.log(user);
 
    }); 
//-------------------------------------------------------------UPDATE Earning
console.log('update earning');
console.log(array);

var newvalues = { $set: 
    {
        "isPaidOut" : true
    } 
};
for(i=0 ; i<array.length ; i++)
{
  
    Earning.updateOne({ '_id': array[i] }, newvalues, function(err, earning)  {
        if (err) return handleError(err);
       
      
       console.log('earnings updated successfuly');
       console.log(earning);
 
    }); 
}




//---------------------------------------------
});
  } catch (err) {

    // 4. Handle any errors from the call
    console.error(err);
    return res.send(500);
  }

//----------------------------------------------sanding email














console.log('--------------------avant send------------------------')
User.findOne({ 'id':  req.user}, function (err, user) {


// Step 1
let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: 'hnianagadir@gmail.com', 
        pass: '0671518844'
    },
    tls : { rejectUnauthorized: false }
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
    to: user.email, // TODO: email receiver
    subject: 'Email',
    text: 'Storeino affiliate',
    attachments: [{
        filename: 'logo.jpg',
        path: './images/email.png',
        cid: 'email' //same cid value as in the html img src
}],
    template:'paypal',
    context: {
        first_name: user.first_name,
        last_name: user.last_name,
        total:total
       }
};


 // Step 3
 transporter.sendMail(mailOptions, function (err, data) {
   if(err){
       console.log(err)
       return res.json({
        error : err
       })
   }
   
   return res.json({
       message : 'Email has been sent, kindly activate your account'
    });

});

})
console.log('--------------------après send------------------------')
//-------------------------------------------------------------------------------




















  // 5. Return a successful response to the client with the order ID
  res.status(200).json({
    orderID: order.result.id,
    message: 'SUCCESSSSSSSSSS'
  });
 
}

const savePaypal = (req, res, next) => {
    const id = req.user;
    const email =req.body.paypal;
    console.log(id);
    console.log(email);

  var newvalues = { $set: 
    {
        "paypal.email" : email
    } 
};
User.updateOne({ 'id': id }, newvalues, function(err, user)  {
    if (err) return handleError(err);
   
  
   console.log('user updated successfuly');
   res.status(200).json({
    message: 'SUCCESSSSSSSSSS'
  });
}); 
}

 

  module.exports = {
    afficher,
    ajouter,
    get_total,
    get_total_current,
    get_total_withdraw,
    earning,
    testPaypal,
    savePaypal

}