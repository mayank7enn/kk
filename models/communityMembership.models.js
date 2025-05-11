import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CommunityMembership = sequelize.define('community_memberships', {
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
    community_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
    },
    joined_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
})

export default CommunityMembership;