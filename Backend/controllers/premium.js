const jwt = require('jsonwebtoken');
const User=require('../Models/user')
const Expense=require('../Models/expense');



let itemsperpage=3;
let page=1;


exports.Ispremuim=(req,res,next)=>{
    const {token}=req.body;
    console.log("is premium token")
    console.log(token)
    const userid=jwt.verify(token,process.env.jwtkey);
    console.log(userid)
    console.log(userid)

    User.findOne({where:{id:userid}})
    .then( response=>{
        console.log(response);
        console.log(response.id)
        if(response.premium==true){
            res.status(200).json(response.premium);
         
        }
        else{
            res.status(201).json(response.premium);

        }
    })
    .catch(err=>{
        res.status(400).json("error page")
    })
}

exports.addExpense=(req,res,next)=>{
    const {token,expenseAmount,description,category}=req.body;
    const userid=jwt.verify(token,process.env.jwtkey);
    console.log(userid.id+"--"+expenseAmount+"--"+category+"--"+description)
    Expense.create({
        expenseAmount:expenseAmount,
        description:description,
        category:category,
        userId:userid
    }).then(response=>{
        res.status(200).json(response)
    }).catch(err=>{
        res.status(401).json("somethimg went wrong")
    })

}

exports.getExpense=(req,res,next)=>{
    const {token}=req.body;
   

     const userId=jwt.verify(token,process.env.jwtkey);
     console.log('this is getExpense')
     console.log(userId);
     Expense.findAll({where:{userId:userId},order:[['createdAt','DESC']]})
     .then(response=>{
        res.status(200).json(response);
     })
     .catch(err=>{
        res.status(400).json('try again')
     })

    // console.log(userId);


}

exports.deleteexpense=(req,res,next)=>{
    const {id}=req.body;
    Expense.destroy({where:{id:id}})
    .then(response=>{
        console.log('delete ressponseee')
        console.log(response);
        res.status(200).json(response);


    })
    .catch(err=>{
        res.status(400).json('no element found')
    })
    
}

exports .getpremiumexpense=(req,res,next)=>{
    console.log(req.query.items);
    const {token}=req.body;
    if(req.query.items!=undefined){
        itemsperpage=parseInt(req.query.items);
    }
    if(req.query.page!=undefined){
        page=parseInt(req.query.page);
    }
    const userId=jwt.verify(token,process.env.jwtkey);

    Expense.findAndCountAll({where:{userId:userId}})
    .then(totalExpenses=>{
        totalItems=totalExpenses;

        // console.log(response);
        Expense.findAll({limit:itemsperpage,offset:((page-1)* itemsperpage),where:{userId:userId},order:[['createdAt','DESC']]})
        .then(respon=>{

            res.status(200).json({respon,totalItems:totalItems.count,
                  totalpages:Math.ceil(totalItems.count/itemsperpage,
                  )
                //totalpages:totalItems.count/items_per_page
            });
        })
     }) 



    // res.json(req.query.items);
}

