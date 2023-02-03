const express=require('express');
const app=express.Router();
const premium=require('../controllers/premium');

app.post('/ispremium',premium.Ispremuim);
app.post('/add-expense',premium.addExpense);
app.post('/getexpense',premium.getExpense);
app.post('/deleteexpense',premium.deleteexpense);
app.post('/getpremiumexpense',premium.getpremiumexpense);
module.exports=app;
