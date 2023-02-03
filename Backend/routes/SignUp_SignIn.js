const express=require('express');
const app=express.Router();
const SignUp_SignIN=require('../controllers/SignUp_signIn_Cnt');
const purchase=require('../controllers/purchase')
app.post('/User-signUp',SignUp_SignIN.UserSignUp);

app.post('/login',SignUp_SignIN.login);

app.post('/checkemail',SignUp_SignIN.checkemail);

app.post('/changepassword',SignUp_SignIN.changepassword);

app.post('/razorpay',purchase.premiumPurchase);

app.post('/updatetranscation',purchase.updateTransactionStatus);

module.exports=app;