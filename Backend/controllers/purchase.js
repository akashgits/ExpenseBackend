const Razorpay = require('razorpay');
const Order = require('../models/order')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');

const User=require('../Models/user')
exports.premiumPurchase=(req,res)=>{

    const {token}=req.body;
    const userId=jwt.verify(token,process.env.jwtkey);
    console.log(userId+"--user");

    try{
        var rzrInstance=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })


        const amount=2000;
        rzrInstance.orders.create({amount,currency:'INR'},(err,order)=>{
            if(err){
                throw new Error(err)
            }
            Order.create({orderid:order.id,status:'PENDING',userId:userId})
            .then(()=>{
                return res.status(201).json({order,key_id:rzrInstance.key_id})
            })
            .catch(err=>{
                throw new Error(err)
            })
            
        });


    }
    catch(error){
        console.log(error);
        res.status(403).json({ message: 'Sometghing went wrong', error: error})

    }
}

exports.updateTransactionStatus = (req, res ) => {
    try {
        const { payment_id, order_id} = req.body;
        Order.findOne({where : {orderid : order_id}}).then(order => {
            Order.update({ paymentid: payment_id, status: 'SUCCESSFUL'},{where:{id:order.id}}).then(() => {
                User.update({ispremiumuser: true},{where:{id:order.userId}})
                .then(response=>{
                    return res.status(202).json({sucess: true, message: "Transaction Successful"});

                })
               
            }).catch((err)=> {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong',status:"UNSUCCESSFUL" })

    }
}

exports.getLatestUpdate=(req,res)=>{
    req.user.getOrders({limit: 1,
        order: [ [ 'createdAt', 'DESC' ]],
    })
   
    .then((data)=>{
        res.json(data)
    })
    
}
