import express = require("express");
import cors = require("cors");
import bodyParser = require("body-parser");
import routes = require("./routes");
import "reflect-metadata";
import { createConnection } from "typeorm";

import RunSeeds from "./seeds/RunSeeds";


const PORT = 3000;
const HOST = "0.0.0.0";
const app = express();

createConnection().then(async (conn) => {

    
    // Inicia as migrations e seeds no banco...
        await conn.runMigrations();
        //seeds
        await RunSeeds.run();
    //--

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(routes);

    app.listen(PORT, HOST, (req, res) => {
        console.log(`plinioduartt@api Online na porta: ${PORT}`);
    });

}).catch(error => console.log(error));
