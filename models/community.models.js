import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Community = sequelize.define('communities', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users', // Name of the users table
            key: 'id', // Key in the users table to reference
        },
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
    banner: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
});

export default Community;