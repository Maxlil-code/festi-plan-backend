export async function up(queryInterface, Sequelize) {
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
    breakdown: {
      type: Sequelize.JSON,
      allowNull: false
    },
    terms: {
      type: Sequelize.JSON,
      allowNull: true
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    createdById: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Quotes');
}
