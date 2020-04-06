'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const User = loader.database.define('users', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    allowNull: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
  }
}, {
  freezeTableName: true,
  timestamps: false,
  allowNull: true,
  autoIncrement: true
});

module.exports = User;