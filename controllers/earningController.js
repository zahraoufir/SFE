const Earning = require('../models/Earning');
const Link = require('../models/Link');

const create = (req, res, next) => {
    const originalprice = req.body.originalPrice;
    const pourcentage = req.body.pourcentage;
    const calculateprice =  pourcentage*originalprice;
    const linkId = req.body.linkId;
    const newEarning = new Earning({
        userId: req.body.userId,
        linkId: linkId,
        originalPrice: originalprice,
        pourcentage: pourcentage,
        price: calculateprice,
        date: Date.now(),
        isPaidOut: req.body.isPaidOut,
        isCenceled: req.body.isCenceled

    });
    newEarning.save()
        .then(newEarning => {
            res.json({
                message: 'Earning Added Successfully!'
            });
        })
        .catch(error => {
            res.json({
                message: error
            });
        });
   
    
}

const getAll = (req, res, next)=>{
    const token ='';
    const userId=req.user
      Earning.find({userId:userId}).exec((err, result) =>{
        if (err) throw err;
        if(result){
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

const cencel = (req, res, next)=>{
    const token ='';
    const idEarning=req.body.idEarning
      Earning.updateOne({_id:idEarning},{$set: { isCenceled: true }}, (err)=>{
        if(err) return res.status(200).json({
            error: true,
            code: 115,
            message: "Erro to update user!"
        })
    })
}

const pendingEarning = (req, res, next) => {
    const id = req.user
    Earning.aggregate([
        {
            "$group": {
                "_id": { userId: "$userId", isPaidOut: "$isPaidOut" ,isCenceled: "$isCenceled" },
                "total": { "$sum": "$price" }
            }
        }
        ,

        {
            $match: {
                "_id.userId": { $eq: id },
                "_id.isPaidOut": { $eq: false },
                "_id.isCenceled": { $eq: false },
            }
        }

    ], (err, total) => {
       
        if (err) {
            return res.json({
                message: err
            })
        }
       
        return res.json({
            message: total

        });
    })



}

const paidOut = (req, res, next) => {
    const id = parseInt(req.user)
    Earning.aggregate([
        {
            "$group": {
                "_id": { userId: "$userId", isPaidOut: "$isPaidOut" },

                "total": { "$sum": "$price" }
            }
        }
        ,

        {
            $match: {
                "_id.userId": { $eq: id },

                "_id.isPaidOut": { $eq: true },

            }
        }

    ], (err, total) => {
    
        if (err) {
            return res.json({
                message: err
            })
        }
       
        return res.json({
            message: total
        });
    })



}
const chartData2 = (req, res, next) => {
    const id = parseInt(req.user)
    
    Earning.aggregate([
        {
            $group: {
                _id: { userId: "$userId", date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } },
                total: { $sum: "$price" }

            },
        }
        ,
        
    {
        $match: {
            "_id.userId":{$eq:id},
             }
    },
    {
        $sort:
        {"_id.date":1}
    }
    ], (err, total) => {
       
        let currentDate = new Date().toLocaleDateString();
       
        if (err) {
            console.log(err)
            return res.json({
                message: err,
               

            })
        }
     
        return res.json({
            message: total,
        });
    })



}


module.exports = {
    pendingEarning, paidOut, create, chartData2,getAll,cencel
}


