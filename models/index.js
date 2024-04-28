const Sequelize = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.production.storage, // Example for SQLite, adjust accordingly
    logging: console.log
  });

  sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


const Link = require('./link')(sequelize);
const Click = require('./click')(sequelize);

// If there are any relationships (Associations)
// Link.hasMany(User);
// User.belongsTo(Link);


module.exports = {
  Link,
  Click
};

