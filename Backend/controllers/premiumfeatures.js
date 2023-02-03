const jwt = require('jsonwebtoken');
const User=require('../Models/user')
const Expense=require('../Models/expense');
const Sequelize=require('sequelize');
const DownloadList=require('../Models/DownloadList');
const S3Services  = require('../services/s3services')
let Track_items_per_page=5;
let Track_page=1;


exports.getAllUserWithExpense=async(req,res)=>{
    User.findAll().then(async(users)=>{
      var UserAndExpense=[]
      var alldata={};
      for(let i=0;i<users.length;i++){
      await  Expense.findAll({where:{userId:users[i].id}}).then(expense=>{
        var totalexpense=0;
        for(let i=0;i<expense.length;i++){
          totalexpense=totalexpense+expense[i].expenseAmount
  
        }
          alldata={
            ...users[i].dataValues,
            
            totalexpense
          }
          console.log(alldata);
        })
        UserAndExpense.push(alldata)
        
  
      }
      
  
      res.json(UserAndExpense)
  
      
      
    })

}

exports.GetFromToExpenses=(req,res,next)=>{
    if(req.query.page!=undefined){
        Track_page=parseInt(req.query.page);

    }
    if(req.query.items!=undefined){
        Track_items_per_page=parseInt(req.query.items);
    }

    const {From}=req.body;
    const {To}=req.body;
    const {token}=req.body;
   // const DecyptJWT=Jwt.verify(token,process.env.);

    const DecyptJWT=jwt.verify(token,process.env.jwtkey);
   console.log(From+""+To+""+DecyptJWT);
    // let mm=`${From}`;
    // let kk=`${To}`;
   // console.log(mm+"---->"+kk);
    Expense.findAll({where:{userId:DecyptJWT}}).then(k=>{
        const Op=Sequelize.Op;
        Expense.findAndCountAll({where:{userId:DecyptJWT,createdAt:{[Op.between]:[From,To]}}}).then(TrackTotalItems=>{
           // console.log(TrackTotalItems);


            Expense.findAll({limit:Track_items_per_page,offset:((Track_page-1)* Track_items_per_page),where:{userId:DecyptJWT,createdAt:{[Op.between]:[From,To]}}}).then(response=>{
            console.log("this is the original response")
           // console.log(response)
            res.status(200).json({response,totalPages:Math.ceil(TrackTotalItems.count/Track_items_per_page)});
        })
    })
        

    })

    

}

exports.downloadExpenses = async (req,res,next)=>{
    const token=req.body.token;
    const From=req.body.From;
    const To=req.body.To
    
    console.log(From+"<--->"+To)
    console.log(token);

   
        const DecyptJWT=jwt.verify(token,process.env.jwtkey);
        const Op=Sequelize.Op;
          await Expense.findAll({where:{userId:DecyptJWT,createdAt:{[Op.between]:[From,To]}}})
          .then(async (TrackTotalItems)=>{
            await TrackTotalItems;
            console.log(TrackTotalItems)
            const stringExpenses = JSON.stringify(TrackTotalItems);
            //const userId = req.user.id;
            console.log(';this is stringify');
            console.log(stringExpenses);
            const filename = `expense${DecyptJWT}/${new Date}.txt`;//filename should be unique evry time we upload file
              S3Services.uploadFiletoS3(stringExpenses, filename)
              .then(async fileUrl=>{

                 console.log(fileUrl);
                
                  
                   await DownloadList.create({url:fileUrl,userId:DecyptJWT})
                    .then(urlresp=>{
                        console.log('urlresp');
                        console.log(urlresp);
                        res.status(200).json({fileUrl, success:true});
                    })
              })
            //res.json(filename);
          })
}

exports.downloadlistexpense=(req,res,next)=>{
    const {token}=req.body;
    const userid=jwt.verify(token,process.env.jwtkey);

    DownloadList.findAll({where:{userId:userid}})
    .then(response=>{
        console.log(response);
        res.json(response);
    })
    
}



