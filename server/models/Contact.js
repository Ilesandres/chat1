const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Contact = sequelize.define('Contact', {
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'blocked'),
        defaultValue: 'pending'
    }
});

Contact.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Contact.belongsTo(User, { as: 'friend', foreignKey: 'friendId' });

module.exports = Contact; 