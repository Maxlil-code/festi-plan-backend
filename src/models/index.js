import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Import models
import UserModel from './user.js';
import EventModel from './event.js';
import VenueModel from './venue.js';
import BookingModel from './booking.js';
import QuoteModel from './quote.js';
import MessageModel from './message.js';
import NotificationModel from './notification.js';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
  }
});

// Initialize models
const User = UserModel(sequelize, Sequelize.DataTypes);
const Event = EventModel(sequelize, Sequelize.DataTypes);
const Venue = VenueModel(sequelize, Sequelize.DataTypes);
const Booking = BookingModel(sequelize, Sequelize.DataTypes);
const Quote = QuoteModel(sequelize, Sequelize.DataTypes);
const Message = MessageModel(sequelize, Sequelize.DataTypes);
const Notification = NotificationModel(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Event, { foreignKey: 'organizerId', as: 'organizedEvents' });
Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

User.hasMany(Venue, { foreignKey: 'providerId', as: 'venues' });
Venue.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

Event.hasMany(Booking, { foreignKey: 'eventId', as: 'bookings' });
Booking.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

Venue.hasMany(Booking, { foreignKey: 'venueId', as: 'bookings' });
Booking.belongsTo(Venue, { foreignKey: 'venueId', as: 'venue' });

Event.hasMany(Quote, { foreignKey: 'eventId', as: 'quotes' });
Quote.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

Venue.hasMany(Quote, { foreignKey: 'venueId', as: 'quotes' });
Quote.belongsTo(Venue, { foreignKey: 'venueId', as: 'venue' });

User.hasMany(Quote, { foreignKey: 'providerId', as: 'providedQuotes' });
Quote.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const db = {
  sequelize,
  Sequelize,
  User,
  Event,
  Venue,
  Booking,
  Quote,
  Message,
  Notification
};

export default db;
