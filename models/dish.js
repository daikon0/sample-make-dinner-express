'use strict';
module.exports = (sequelize, DataTypes) => {
  const dish = sequelize.define('dish', {
    dishId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    dishName: DataTypes.STRING,
    dishFile: DataTypes.STRING,
    dishUrl: DataTypes.STRING,
    dishGenre: DataTypes.STRING,
    dishRole: DataTypes.STRING,
    createdBy: DataTypes.BIGINT,
    updatedAt: DataTypes.DATE
  }, {});
  dish.associate = function(models) {
    // associations can be defined here
  };
  return dish;
};