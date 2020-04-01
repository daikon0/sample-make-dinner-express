'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/make_dinner',
  );

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
