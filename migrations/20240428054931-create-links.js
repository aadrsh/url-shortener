"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'Links' table
    await queryInterface.createTable("Links", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      originalUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shortenedUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      alias: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add a unique index to the 'shortenedUrl' column
    await queryInterface.addIndex("Links", ["shortenedUrl"], {
      unique: true,
      fields: ["shortenedUrl"],
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the unique index from the 'shortenedUrl' column
    await queryInterface.removeIndex("Links", "shortenedUrl");
    // Drop the 'Links' table
    await queryInterface.dropTable("Links");
  },
};
