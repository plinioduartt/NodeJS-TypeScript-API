require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

import express = require("express");
import cors = require("cors");
import bodyParser = require("body-parser");
import routes = require("./routes");
import "reflect-metadata";
import { createConnection } from "typeorm";
import RunSeeds from "./database/seeds/RunSeeds";
import config from "../ormconfig";


const app = new express();
app.use(routes);

createConnection(config).then(async (conn) => {
    await conn.runMigrations();
    await RunSeeds.run();
    
    await app.use(cors());
    await app.use(bodyParser.json());
    await app.use(bodyParser.urlencoded({ extended: true }));
}).catch(error => console.log(error));

export default app;
