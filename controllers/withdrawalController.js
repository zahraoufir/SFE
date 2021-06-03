const Withdraw = require('../models/withdrawal')
const Earning = require('../models/Earning')
const User = require('../models/User')

//const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

//const paypal = require('@paypal/checkout-server-sdk');
// 1a. Import the SDK package
//const paypal = require('checkoutNodeJssdk');

// 1b. Add your client ID and secret
//const PAYPAL_CLIENT = 'AWY-_pUpugiMjL5qfVPnPpIBc7_nLJCrCP7iSaH0x-gKGMuzGX06VCHvvS7J0Y3voDIyp9VcmG2Zyklx';
//const PAYPAL_SECRET = 'EKPHu8sxY-ZqXRhd3depuN7DVjdY6lGczejMbyfwS8RPWizmJO2dzPy_G54SUkSZbI8hiAvw2Xnhr7rF';

// 1c. Set up the SDK client
//const env = new paypal.core.SandboxEnvironment(PAYPAL_CLIENT, PAYPAL_SECRET);
//const client = new paypal.core.PayPalHttpClient(env);

const afficher = (req, res, next) => {
      const id = req.body.id;
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

    Earning.find({ 'userId': 1 , 'isPaidOut': false }, function (err, earning) {
        if (err) return handleError(err);

        const list = earning;
      
        let i;
        let array=[]

        for(i=0;i<list.length;i++){
            array.push(list[i]._id);
        }
           
            let newWithdraw = new Withdraw({
                id_user: 1,
                total: 23.99,
                earnings: array,
                date: today
            })
            newWithdraw.save()
                .then(newWithdraw => {
                   
        
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

const id = parseInt(req.user)
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
            
        console.log('sum')
        console.log(sum)
            res.json({
                total: sum
            })
        })
        .catch(error => {
            res.json({
                message: error
            })
        })

    
}

const earning = (req, res, next) => {
    let newEarning = new Earning({
        userId: 1,
        linkId: 2,
        originalPrice: 15.06,
        pourcentage: 10,
        price: 0.05,
        date: '2021-01-01',
        isPaidOut: false,
        isCenceled: false,
    })
    newEarning.save()
        .then(newEarning => {
            
        
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
 
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: ''+total+''
      },
      payee: {
        email_address: req.body.email
      }
    }]
  });

  let order;
  try {
    order = await client.execute(request);
    //-----------------------------------------------------INSERT WITHDRAW
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const id = req.body.id;
    today = yyyy +'-'+ mm + '-' + dd ;
   
    Earning.find({ 'userId': id , 'isPaidOut': false }, function (err, earning) {
        if (err) return handleError(err);
       
        const list = earning;
        
        let i;
        let array=[]

        for(i=0;i<list.length;i++){
            array.push(list[i]._id);
        }
           
            let newWithdraw = new Withdraw({
                id_user: id,
                total: total,
                earnings: array,
                date: today
            })
            newWithdraw.save()
                .then(newWithdraw => {
                    console.log("User Added Successfully!");
        
                })
                .catch(error => {
                    console.log("Insert ERROR!");

                })
   
    //-------------------------------------------UPDATE USER
    var newvalues = { $set: 
        {
            "paypal.email" : req.body.email
        } 
    };
    User.updateOne({ 'id': id }, newvalues, function(err, user)  {
        if (err) return handleError(err);
       
      
       console.log('user updated successfuly');
       
 
    }); 
//-------------------------------------------------------------UPDATE Earning


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
      
 
    }); 
}




//---------------------------------------------
});
  } catch (err) {

    // 4. Handle any errors from the call
    console.error(err);
    return res.send(500);
  }

  // 5. Return a successful response to the client with the order ID
  res.status(200).json({
    orderID: order.result.id,
    message: 'SUCCESSSSSSSSSS'
  });
 
}

  
 

  module.exports = {
    afficher,
    ajouter,
    get_total,
    earning,
    testPaypal

}