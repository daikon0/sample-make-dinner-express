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
  dishFile: {
    type: Sequelize.BLOB,
    allowNull: true
  },
  dishUrl: {
    type: Sequelize.STRING,
    allowNull: true
  },
  dishGenre: {
    type: Sequelize.STRING,
    allowNull: false 
  },
  dishRole:{
    type: Sequelize.STRING,
    allowNull: false
  },
  createdBy: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
},{
  freezeTableName: true,
  timestamps: false,
  indexes: [
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = Dishes;