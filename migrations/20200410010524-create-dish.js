'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('dishes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dishId: {
        type: Sequelize.UUID
      },
      dishName: {
        type: Sequelize.STRING
      },
      dishFile: {
        type: Sequelize.STRING
      },
      dishUrl: {
        type: Sequelize.STRING
      },
      dishGenre: {
        type: Sequelize.STRING
      },
      dishRole: {
        type: Sequelize.STRING
      },
      createdBy: {
        type: Sequelize.BIGINT
      },
      updatedAt: {
        type: Sequelize.DATE
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('dishes');
  }
};