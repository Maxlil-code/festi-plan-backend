import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.User, {
        foreignKey: 'organizerId',
        as: 'organizer'
      });
      
      Event.hasMany(models.Quote, {
        foreignKey: 'eventId',
        as: 'quotes'
      });
    }
  }
  
  Event.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0]
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    guestCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 10000
      }
    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('draft', 'planning', 'confirmed', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft'
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Events',
    timestamps: true,
    hooks: {
      beforeUpdate: (event) => {
        // Only validate if status is being changed to something other than draft
        if (event.changed('status') && event.status !== 'draft') {
          const required = ['date', 'startTime', 'endTime', 'guestCount', 'budget'];
          const missing = required.filter(field => event[field] == null);
          
          if (missing.length > 0) {
            throw new Error(`The following fields are required to finalize the event: ${missing.join(', ')}`);
          }
        }
      }
    }
  });
  
  return Event;
};