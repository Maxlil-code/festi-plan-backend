import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Quote extends Model {
    static associate(models) {
      Quote.belongsTo(models.Event, {
        foreignKey: 'eventId',
        as: 'event'
      });
      Quote.belongsTo(models.Venue, {
        foreignKey: 'venueId',
        as: 'venue'
      });
      Quote.belongsTo(models.User, {
        foreignKey: 'providerId',
        as: 'provider'
      });
    }
  }
  
  Quote.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Venues',
        key: 'id'
      }
    },
    providerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    items: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    vat: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'accepted', 'rejected', 'expired', 'negotiating'),
      allowNull: false,
      defaultValue: 'draft'
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Quote',
    tableName: 'Quotes',
    timestamps: true
  });
  
  return Quote;
};