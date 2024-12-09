const {DataTypes}=require('sequelize');
const sequelize=require('../config/database');
const User=require('./User');

const Message=sequelize.define('Message',{
    message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content:{
        type: DataTypes.TEXT,
        allowNull:false
    },
    sender_id:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:'user_id',
        },
    },
    receiver_id:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:'user_id',
        },
    }
},{
    timestamps:true,
    tableName: 'messages'
});

Message.belongsTo(User, {
    as: 'sender',
    foreignKey: 'sender_id',
    targetKey: 'user_id'
});

Message.belongsTo(User, {
    as: 'receiver',
    foreignKey: 'receiver_id',
    targetKey: 'user_id'
});

module.exports=Message;