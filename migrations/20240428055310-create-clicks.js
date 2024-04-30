"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Clicks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      linkId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Links",
          key: "id",
        },
      },
      clickedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: true, // Depending on requirements, this can be set to false if IP is always expected
      },
      platform: {
        type: Sequelize.STRING,
        allowNull: true, // This can also be a non-nullable field, if platform information is always available
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Clicks");
  },
};
