const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Click extends Model {}
  Click.init(
    {
      linkId: DataTypes.INTEGER,
      headerDetails: DataTypes.JSON,
    },
    { sequelize, modelName: "Click" }
  );
  return Click;
};
