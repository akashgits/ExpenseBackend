const express=require('express');
const app=express.Router();
const premiumfeaturesControoller=require('../controllers/premiumfeatures');

app.post('/leaderboard',premiumfeaturesControoller.getAllUserWithExpense);
app.post('/fromto',premiumfeaturesControoller.GetFromToExpenses);
app.post('/downloadexpense',premiumfeaturesControoller.downloadExpenses)
app.post('/downloadlist',premiumfeaturesControoller.downloadlistexpense)

module.exports=app;