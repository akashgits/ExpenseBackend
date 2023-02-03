
const dotenv=require('dotenv');
dotenv.config();

const Sequelize=require('sequelize');

const sequelize=new Sequelize(Db_name,Db_user,Db_pass,{
    dialect:'mysql',
    host:Db_host,

});

module.exports=sequelize;

