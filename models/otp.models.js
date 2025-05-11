import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const OTP = sequelize.define('otps', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    purpose: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export default OTP;