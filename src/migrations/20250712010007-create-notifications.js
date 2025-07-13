'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Notifications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('info', 'warning', 'success', 'error', 'quote', 'booking', 'message'),
      allowNull: false,
      defaultValue: 'info'
    },
    isRead: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    relatedEntityType: {
      type: Sequelize.STRING
    },
    relatedEntityId: {
      type: Sequelize.INTEGER
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

  // Add index for user queries
  await queryInterface.addIndex('Notifications', ['userId']);
  await queryInterface.addIndex('Notifications', ['isRead']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Notifications');
}
