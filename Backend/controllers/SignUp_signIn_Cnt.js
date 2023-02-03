const User=require('../Models/user');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');

const uuid=require('uuid');
const forgetPassword=require('../Models/forgetpassword');
const { permittedCrossDomainPolicies } = require('helmet');

exports.UserSignUp=(req,res,next)=>{
    const {name,email,password,phonenumber}=req.body;
    User.findOne({where:{email:email}})
    .then(response=>{
        console.log('checkin whether the user is there are not')
        console.log(response);

        if(response==null){

     
   
            bcrypt.hash(password,10)
            .then(hash=>{
                User.create({
                    name:name,
                    email:email,
                    password:hash,
                   
                })
                .then(r=>{
                   
                   // console.log(r.user.dataValues.id);
                   console.log(r.id);
                   var token=jwt.sign({id:r.id},process.env.jwtkey);
                    res.status(200).json({r,token});

                })
                .catch(error=>{
                    if(error){
                    res.status(401).json("this is error in the thing")
                    }
                    // console.log(error)
                    // console.log(error.code)

                })
            })


        }
        else{
            res.json('error')
        }
    })

   
     

}

exports.login=(req,res,next)=>{
    const {email,password}=req.body;
    User.findOne({where:{email:email}})
    .then(user=>{
        console.log(user);
        if(user){
            bcrypt.compare(password,user.password).then(resp=>{
                if(resp){
                    var token=jwt.sign(user.id,process.env.jwtkey)
                    res.status(200).json({token,user})
                }
                else{
                    res.status(201).json('login failed')
                }
            })
        }
        else{
            res.status(202).json('user not found')
        }
    })
    .catch((err)=>{
        console.log(err)
        res.status(402).json('user not found')
    })
}

exports.checkemail=(req,res,next)=>{
    const {email}=req.body;
    console.log('forgett')
    console.log(email);
    User.findOne({where:{email:email}})
    .then(response=>{
        console.log(response);
        if(response===null){
            res.json('no')
        }
        else{
            const id=uuid.v4();
            forgetPassword.create({uuid:id,isactive:false,userId:response.id})
            .then(result=>{
                res.status(200).json(result);
                
            })


        }
    })
}

exports.changepassword=(req,res,next)=>{
    const {password,uuid}=req.body;
    forgetPassword.findOne({where:{uuid:uuid}})
    .then(response=>{
        if(response.isactive===false){
            bcrypt.hash(password,10).then(hash=>{
                User.update({password:hash},{where:{id:response.userId}})
                .then(us=>{
                    console.log('us');
                    forgetPassword.update({isactive:true},{where:{uuid:uuid}}).then(con=>{
                        console.log('con')
                        res.json(con);

                    })

                })
            })
            
        }

    })

}
