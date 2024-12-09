const {DataTypes}= require('sequelize');
const sequelize=require('../config/database');

const User=sequelize.define('User',{
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            isEmail:true,
        },
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    }
},{
    timestamps:true,
    tableName: 'users'
});

module.exports=User;