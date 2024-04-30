// models/link.js
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Link extends Model {}
  Link.init(
    {
      originalUrl: DataTypes.STRING,
      shortenedUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      alias: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Link",
      paranoid: true, // This enables soft deletes, will use deletedAt.
      timestamps: true, // Explicitly stating to use timestamps.
      indexes: [
        {
          unique: true,
          fields: ["shortenedUrl"],
        },
      ],
    }
  );
  return Link;
};
