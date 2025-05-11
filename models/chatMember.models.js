import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ChatMember = sequelize.define('chat_members', {
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
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    joined_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
})

export default ChatMember;