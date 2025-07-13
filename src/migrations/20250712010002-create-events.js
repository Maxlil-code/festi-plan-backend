'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Events', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: Sequelize.TIME
    },
    endTime: {
      type: Sequelize.TIME
    },
    guestCount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    budget: {
      type: Sequelize.DECIMAL(10, 2)
    },
    status: {
      type: Sequelize.ENUM('draft', 'planning', 'confirmed', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'draft'
    },
    organizerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
  await queryInterface.dropTable('Events');
}
