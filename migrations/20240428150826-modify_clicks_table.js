"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the 'headerDetails' column
    await queryInterface.removeColumn("Clicks", "headerDetails");

    // Add new columns for IP geolocation details
    await queryInterface.addColumn("Clicks", "ip_address", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "continent", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "continentCode", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "country", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "countryCode", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "region", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "regionName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "city", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "lat", {
      type: Sequelize.DOUBLE,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "lon", {
      type: Sequelize.DOUBLE,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "timezone", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "isp", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "org", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "as", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "asname", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Clicks", "mobile", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Add removed column and remove added columns in reverse
    await queryInterface.addColumn("Clicks", "headerDetails", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    // Remove all the newly added columns
    await queryInterface.removeColumn("Clicks", "ip_address");
    await queryInterface.removeColumn("Clicks", "continent");
    await queryInterface.removeColumn("Clicks", "continentCode");
    await queryInterface.removeColumn("Clicks", "country");
    await queryInterface.removeColumn("Clicks", "countryCode");
    await queryInterface.removeColumn("Clicks", "region");
    await queryInterface.removeColumn("Clicks", "regionName");
    await queryInterface.removeColumn("Clicks", "city");
    await queryInterface.removeColumn("Clicks", "lat");
    await queryInterface.removeColumn("Clicks", "lon");
    await queryInterface.removeColumn("Clicks", "timezone");
    await queryInterface.removeColumn("Clicks", "isp");
    await queryInterface.removeColumn("Clicks", "org");
    await queryInterface.removeColumn("Clicks", "as");
    await queryInterface.removeColumn("Clicks", "asname");
    await queryInterface.removeColumn("Clicks", "mobile");
  },
};
