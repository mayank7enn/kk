import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const EventParticipant = sequelize.define('event_participants',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    event_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
    },
    invited_by: {
        type: DataTypes.STRING,
    },
    responded_at: {
        type: DataTypes.DATE,
    },
})

export default EventParticipant;