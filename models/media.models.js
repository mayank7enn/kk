import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Media = sequelize.define('media', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    ref_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
    },
    url: {
        type: DataTypes.STRING,
    },
});

export default Media;