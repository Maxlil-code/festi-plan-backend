import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Quote extends Model {
    static associate(models) {
      // Associations are defined in models/index.js
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
      allowNull: false,
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
      allowNull: false,
      defaultValue: '[]'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    vat: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'accepted', 'rejected', 'negotiating'),
      allowNull: false,
      defaultValue: 'draft'
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Quote',
    tableName: 'Quotes',
    timestamps: true
  });
  
  return Quote;
};