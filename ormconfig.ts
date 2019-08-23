require('dotenv').config({
   path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

console.log("DB NAME -->", process.env.DB_NAME);

module.exports = {
   "name": "default",
   "type": "mysql",
   "host": "localhost",
   "port": 3306,
   "username": "root",
   "password": "focal1320",
   "database": process.env.DB_NAME,
   "synchronize": true,
   "logging": false,
   "entities": [
      "src/database/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/database/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
};