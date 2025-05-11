import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ActivityParticipant = sequelize.define('activity_participants', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    activity_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'declined'),
        defaultValue: 'pending',
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
});

export default ActivityParticipant;