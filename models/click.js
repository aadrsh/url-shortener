const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Click extends Model {}

  Click.init(
    {
      linkId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Links", // This model name should match the table name if not explicitly defined
          key: "id",
        },
      },
      clickedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Use NOW for current timestamp
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true, // Adjust allowNull based on whether IP address is mandatory
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: true, // Adjust allowNull based on whether platform is mandatory
      },
    },
    {
      sequelize,
      modelName: "Click",
      timestamps: false, // Ensure this is false if you are managing created timestamps manually
    }
  );

  return Click;
};
