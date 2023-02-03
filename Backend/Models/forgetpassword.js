const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const forgetPassword=sequelize.define('forgetpassword',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    uuid:{
        type:Sequelize.STRING,
        allowNull:false,

    },
    isactive:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    }


});

module.exports=forgetPassword;