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
            link: 'http://localhost:4000/api/clicks/create/'+iduser+'/'+tagname,
            date: Date.now(),
            linkId :" "+result[0]._id
            });
            
            newClick.save()
            .then(newClick => {
                const nbr=result[0].nbrClicks+1;
                Link.updateOne({_id:result[0]._id},{$set: { nbrClicks: nbr }}, (err)=>{
                    if (err) throw err;
                    console.log("1 document updated");
                });
                console.log("heloooowoiefjwejkfn"+result[0].redirect);
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
    
    const id = req.user
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

    const id = parseInt(req.user)
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
       else{
           console.log("total"+total);
         return res.json({
            message: total,
        });  
       }
        
    })
}

const countClick = (req, res, next) => {
    const id = req.user;
    Click.count({ userId: id }, (err, count) => {
       
        if (err) {
            return res.json({
                message: err
            })
        }
       
       console.log(count)
        return res.json({
            message: count
        });
    })
}
const countClickperLink = (req, res, next) => {
    const idlink = req.body.idlink
    Click.count({ linkid: idlink }, (err, count) => {
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
    countClick, create, chartData, getAll, urlformat,countClickperLink
}