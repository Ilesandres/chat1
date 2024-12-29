const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Contact = sequelize.define('Contact', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    friendId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'blocked'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true,
    tableName: 'contacts'
});

// Definir las asociaciones
Contact.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Contact.belongsTo(User, { as: 'friend', foreignKey: 'friendId' });

module.exports = Contact; 