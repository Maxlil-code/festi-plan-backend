export async function up(queryInterface, Sequelize) {
  // Drop the existing Quotes table and recreate it with the correct structure
  await queryInterface.dropTable('Quotes');
  
  await queryInterface.createTable('Quotes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    eventId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    venueId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Venues',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    providerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    items: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    subtotal: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    vat: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    total: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('draft', 'sent', 'accepted', 'rejected', 'expired', 'negotiating'),
      allowNull: false,
      defaultValue: 'draft'
    },
    validUntil: {
      type: Sequelize.DATE,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}

export async function down(queryInterface, Sequelize) {
  // Revert back to the previous structure
  await queryInterface.dropTable('Quotes');
  
  await queryInterface.createTable('Quotes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    eventId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    venueId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Venues',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    quoteNumber: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    totalCost: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING,
      defaultValue: 'USD'
    },
    validUntil: {
      type: Sequelize.DATE,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('draft', 'sent', 'accepted', 'rejected', 'expired', 'negotiating'),
      allowNull: false,
      defaultValue: 'draft'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
