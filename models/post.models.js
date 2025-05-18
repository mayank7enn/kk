import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Post = sequelize.define('posts', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    image: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    author_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    community_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    activity_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    event_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

export default Post;