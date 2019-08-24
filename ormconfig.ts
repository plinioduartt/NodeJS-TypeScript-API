require('dotenv').config({
   path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

import { ConnectionOptions } from "typeorm";


const config: ConnectionOptions = {
   "name": "default",
   "type": "postgres",
   "host": "192.168.99.100",
   "port": 5432,
   "username": "postgres",
   "password": "123456",
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

export default config;