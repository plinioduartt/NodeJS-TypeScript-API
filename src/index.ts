import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { User } from "./entity/User";
import Network from './entity/Network';

import express = require("express");
import cors = require("cors");
import bodyParser = require("body-parser");

const PORT = 3000;
const HOST = "0.0.0.0";
const app = express();

createConnection().then(async (conn) => {

    await conn.runMigrations();
    app.use(cors());
    app.use(bodyParser());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post("/user", async (req, res) => {
        var networksArray = [];
        //array contendo os Ids das redes que o usuário trabalha
        const reqNetworks = req.body.networks;
        await reqNetworks.forEach( async (item, index) => {
            try {
                const network = await Network.findOneOrFail({ id: item });
                networksArray.push(network);
                if (index == (reqNetworks.length - 1)) {
                    const user = await User.create({
                        name: "Plinio Duarte",
                        last_name: "Junior",
                        network: networksArray
                    });
                    user.save();
                    return res.send(user);
                }
            } catch (error) {
                return res.status(400).json({ message: `Loja de id "${item}" não encontrada.` })
            }
        });
    });

    app.get("/user", async (req, res) => {
        const users = await getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.network", "network")
        .getMany();
        return res.send(users);
    });

    app.listen(PORT, HOST, (req, res) => {
        console.log(`Listening to port ${PORT}`);
    });

}).catch(error => console.log(error));
