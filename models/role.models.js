import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Role = sequelize.define('roles', {
    id: {
        type: DataTypes.UUID, // Use UUID for the primary key
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
        primaryKey: true,
        allowNull: false,
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    underscored: true, // Converts camelCase to snake_case for column names
});

export default Role;