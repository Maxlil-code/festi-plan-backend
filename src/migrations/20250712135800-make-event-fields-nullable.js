'use strict';

export async function up(queryInterface, Sequelize) {
  const nullable = { allowNull: true };
  await queryInterface.changeColumn('Events', 'date',       { type: Sequelize.DATEONLY, ...nullable });
  await queryInterface.changeColumn('Events', 'startTime',  { type: Sequelize.TIME,     ...nullable });
  await queryInterface.changeColumn('Events', 'endTime',    { type: Sequelize.TIME,     ...nullable });
  await queryInterface.changeColumn('Events', 'guestCount', { type: Sequelize.INTEGER,  ...nullable });
  await queryInterface.changeColumn('Events', 'budget',     { type: Sequelize.INTEGER,  ...nullable });
}

export async function down(queryInterface, Sequelize) {
  const notNull = { allowNull: false };
  await queryInterface.changeColumn('Events', 'date',       { type: Sequelize.DATEONLY, ...notNull });
  await queryInterface.changeColumn('Events', 'startTime',  { type: Sequelize.TIME,     ...notNull });
  await queryInterface.changeColumn('Events', 'endTime',    { type: Sequelize.TIME,     ...notNull });
  await queryInterface.changeColumn('Events', 'guestCount', { type: Sequelize.INTEGER,  ...notNull });
  await queryInterface.changeColumn('Events', 'budget',     { type: Sequelize.INTEGER,  ...notNull });
}
