const { response } = require('express');
const Click = require('../models/Click');
const Link = require('../models/Link')

const urlformat =(req, res,next)=>
{
var string = "http://localhost:8080/111/ramadan";

resultat=[]
res.send(resultat)

}

const create = (req, res, next) => {
   
    const iduser=req.params.userid
    const tagname=req.params.tagname
    Link.find({userId: iduser,route: tagname}).exec((err, result) =>{
        if (err) throw err;
        if(result){
           const newClick = new Click({
            userId: iduser,
            link: 'https://affiliate.storeino.com/'+iduser+'/'+tagname,
            date: Date.now()
            });
            newClick.save()
            .then(newClick => {
           res.redirect(result[0].redirect)
            })
            .catch(error => {
                console.log(error)
                res.json({
                    message: error
                });
            });
        }else{
            res.json({
                message:"no result"
            });  
        }
      });
}

    
const getAll = (req, res, next)=>{
    
    const id = 5
      Click.find({userId:id}).exec((err, result) =>{
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


const chartData = (req, res, next) => {

    const id = parseInt(req.body.id)
     Click.aggregate([
        {
            $group: {
                _id: { userId: "$userId", date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } },
                count: { $sum: 1 }

            },
        }, 
        
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

const countClick = (req, res, next) => {
    const id = parseInt(req.user)
    Click.count({ userId: id }, (err, count) => {
       
        if (err) {
            return res.json({
                message: err
            })
        }
       
        return res.json({
            message: count
        });
    })
}
module.exports = {
    countClick, create, chartData, getAll, urlformat
}