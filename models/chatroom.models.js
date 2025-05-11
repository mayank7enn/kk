import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ChatRoom = sequelize.define('chat_room', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
    },
})

export default ChatRoom;