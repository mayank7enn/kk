import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Message = sequelize.define('messages', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    chat_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sender_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
    },
    sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

export default Message;