import request = require("supertest");
import server from "../server";
import User from "../database/entity/User";
import Roles from "../database/entity/Roles";
import RunSeeds from '../database/seeds/RunSeeds';
import { getManager, getRepository, createQueryBuilder } from "typeorm";
import bcrypt = require("bcryptjs");
import { createConnection } from "typeorm";
const version = "v1";

const options: any = {
    name: "default",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "focal1320",
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [
       "src/database/entity/**/*.ts"
    ],
    migrations: [
       "src/migration/**/*.ts"
    ],
    subscribers: [
       "src/subscriber/**/*.ts"
    ],
    cli: {
       entitiesDir: "src/database/entity",
       migrationsDir: "src/migration",
       subscribersDir: "src/subscriber"
    }
};
const connection = createConnection(options).then( async (conn) => {
    return await conn;
});

describe('Create roles', () => {
    it('Should create all the default roles', async () => {
        const conn = await connection;
        var admin = new Roles();
            admin.str_desc = "Administrator role";
            admin.str_name = "Administrator";
            await admin.save();

        var customer = new Roles();
            customer.str_desc = "Customer role";
            customer.str_name = "Customer";
            await customer.save();
        
        const roles = await getRepository(Roles).createQueryBuilder('roles').getMany();
        expect(roles.length).toBe(2);
    });
});

describe('Create user', () => {
    it('Should create a user', async () => {
        const conn = await connection;
        const res = await request(server).get('/');
        // console.log(res.text);
        // const user = await new User();
        //     user.str_name = "Plinio",
        //     user.str_username = "plinioduartt",
        //     user.password = "123456",
        //     user.network = []
        expect(res.text).toBe('TESTE');
    });
});

describe('Revert all migrations', () => {
    it('Should revert all migrations', async () => {
        
    });
});

// describe('Run seeds', () => {
//     it('Should create all the default data', async () => {
//         const entityManager = await getManager();
//         const userRepository = await getRepository(Roles); // you can also get it via getConnection().getRepository() or getManager().getRepository()
//         const role = await userRepository.findOne({ str_name: "Administrator" });

//         var user = new User();
//             user.str_name = await "Admin";
//             user.str_username = await "admin";
//             user.network = await [];
//             user.password = await bcrypt.hash("123456", 10);
//             user.role = await role;
//         expect(user.str_name).toBe('admin');
//     });
// });


    



    

    