const Sequelize = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: config.production.storage, // Example for SQLite, adjust accordingly
  logging: console.log,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const Link = require("./link")(sequelize);
const Click = require("./click")(sequelize);

// Define a HasMany relationship with Click
Link.hasMany(Click, {
  foreignKey: "linkId",
  as: "clicks", // This alias is used when querying Links to include Clicks data
});

Click.belongsTo(Link, {
  foreignKey: "linkId",
  as: "link", // This alias is used when querying Clicks to include Link data
});

module.exports = {
  Link,
  Click,
};
