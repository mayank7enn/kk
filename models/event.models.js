import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Event = sequelize.define('events', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    community_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organizer_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    start_at: {
        type: DataTypes.DATE,
    },
    end_at: {
        type: DataTypes.DATE,
    },
    location: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
})

export default Event;