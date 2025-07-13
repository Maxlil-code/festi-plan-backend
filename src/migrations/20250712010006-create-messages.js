'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Messages', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    conversationId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    senderId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    receiverId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    messageType: {
      type: Sequelize.ENUM('text', 'image', 'file'),
      allowNull: false,
      defaultValue: 'text'
    },
    readAt: {
      type: Sequelize.DATE
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

  // Add index for conversation queries
  await queryInterface.addIndex('Messages', ['conversationId']);
  await queryInterface.addIndex('Messages', ['senderId']);
  await queryInterface.addIndex('Messages', ['receiverId']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Messages');
}
