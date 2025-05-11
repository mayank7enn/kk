import sequelize from '../../config/db.js';
import User from '../user.models.js';
import Role from '../role.models.js';
import UserRole from '../userRoles.models.js';
import Community from '../community.models.js';
import CommunityMembership from '../communityMembership.models.js';
import Activity from '../activity.models.js';
import ActivityParticipant from '../activityParticipant.models.js';
import Event from '../event.models.js';
import EventParticipant from '../eventParticipant.models.js';
import Post from '../post.models.js';
import Media from '../media.models.js';
import ChatRoom from '../chatroom.models.js';
import ChatMember from '../chatMember.models.js';
import Message from '../message.models.js';
import OTP from '../otp.models.js';

// Define associations
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

Community.belongsTo(User, { foreignKey: 'created_by' });
User.hasMany(Community, { foreignKey: 'created_by' });

CommunityMembership.belongsTo(User, { foreignKey: 'user_id' });
CommunityMembership.belongsTo(Community, { foreignKey: 'community_id' });
User.hasMany(CommunityMembership, { foreignKey: 'user_id' });
Community.hasMany(CommunityMembership, { foreignKey: 'community_id' });

Activity.belongsTo(User, { foreignKey: 'creator_id' });
User.hasMany(Activity, { foreignKey: 'creator_id' });

ActivityParticipant.belongsTo(Activity, { foreignKey: 'activity_id' });
ActivityParticipant.belongsTo(User, { foreignKey: 'user_id' });
Activity.hasMany(ActivityParticipant, { foreignKey: 'activity_id' });
User.hasMany(ActivityParticipant, { foreignKey: 'user_id' });

Event.belongsTo(Community, { foreignKey: 'community_id' });
Event.belongsTo(User, { foreignKey: 'organizer_id' });
Community.hasMany(Event, { foreignKey: 'community_id' });
User.hasMany(Event, { foreignKey: 'organizer_id' });

EventParticipant.belongsTo(Event, { foreignKey: 'event_id' });
EventParticipant.belongsTo(User, { foreignKey: 'user_id' });
EventParticipant.belongsTo(User, { as: 'InvitedBy', foreignKey: 'invited_by' });
Event.hasMany(EventParticipant, { foreignKey: 'event_id' });
User.hasMany(EventParticipant, { foreignKey: 'user_id' });

Post.belongsTo(User, { foreignKey: 'author_id' });
Post.belongsTo(Community, { foreignKey: 'community_id' });
Post.belongsTo(Activity, { foreignKey: 'activity_id' });
Post.belongsTo(Event, { foreignKey: 'event_id' });
User.hasMany(Post, { foreignKey: 'author_id' });
Community.hasMany(Post, { foreignKey: 'community_id' });
Activity.hasMany(Post, { foreignKey: 'activity_id' });
Event.hasMany(Post, { foreignKey: 'event_id' });

Media.belongsTo(Post, { foreignKey: 'post_id' });
Post.hasMany(Media, { foreignKey: 'post_id' });

ChatRoom.belongsTo(User, { foreignKey: 'created_by' });
User.hasMany(ChatRoom, { foreignKey: 'created_by' });

ChatMember.belongsTo(ChatRoom, { foreignKey: 'chat_room_id' });
ChatMember.belongsTo(User, { foreignKey: 'user_id' });
ChatRoom.hasMany(ChatMember, { foreignKey: 'chat_room_id' });
User.hasMany(ChatMember, { foreignKey: 'user_id' });

Message.belongsTo(ChatRoom, { foreignKey: 'chat_room_id' });
Message.belongsTo(User, { foreignKey: 'sender_id' });
ChatRoom.hasMany(Message, { foreignKey: 'chat_room_id' });
User.hasMany(Message, { foreignKey: 'sender_id' });

OTP.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(OTP, { foreignKey: 'user_id' });

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter: true}); // Use 'alter' to update the database schema
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

export {
    sequelize,
    connectDB,
    User,
    Role,
    UserRole,
    Community,
    CommunityMembership,
    Activity,
    ActivityParticipant,
    Event,
    EventParticipant,
    Post,
    Media,
    ChatRoom,
    ChatMember,
    Message,
    OTP
};