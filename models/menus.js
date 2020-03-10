'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Dishes = loader.database.define('dishes', {
  dishId: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  dishName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  
})