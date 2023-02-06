
const dotenv=require('dotenv');
dotenv.config();

const Sequelize=require('sequelize');

const sequelize=new Sequelize(process.env.Db_name,process.env.Db_user,process.env.Db_pass,{
    dialect:'mysql',
    host:process.env.Db_host,

});

module.exports=sequelize;


