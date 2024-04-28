require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './db/database.sqlite',
  },
  test: {
    dialect: 'sqlite',
    storage: './db/database.sqlite'
  },
  production: {
    dialect: 'sqlite',
    storage: './db/database.sqlite'
  }
};
