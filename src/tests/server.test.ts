import request = require("supertest");
import server from "../server";
import Roles from "../database/entity/Roles";
import {  getRepository } from "typeorm";
import bcrypt = require("bcryptjs");
import { createConnection } from "typeorm";
import config from "../../ormconfig";
import User from "../database/entity/User";
import bodyParser = require('body-parser');
import cors = require('cors');
import chai = require('chai')
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

import request2 = require('request');

const token = '';
const version = "v1";

describe('Check connection', () => {
    it('Should confirm the connection', async () => {
        const connection = await createConnection(config);
        const res = await request(server).get('/');
        expect(res.text).toBe('OK');
    });
});


describe('Create roles', () => {
    it('Should create all the default roles', async () => {
        var admin = new Roles();
            admin.str_desc = "Administrator role";
            admin.str_name = "Administrator";
            await admin.save();

        var customer = new Roles();
            customer.str_desc = "Customer role";
            customer.str_name = "Customer";
            await customer.save();
            
        
        const roles = await getRepository(Roles).createQueryBuilder('roles').getMany();
        expect(roles.length).toBeGreaterThan(0);
    });
});


describe('Create default user', () => {
    it('Should create a default admin user', async () => {
        const role = await Roles.findOne({ str_name: "Administrator" });

        var user = new User();
            user.str_name = "Administrator";
            user.str_username = "admin";
            user.password = await bcrypt.hash("123456", 10);
            user.role = role;
            user.network = [];
        const res = await user.save();
        
        expect(res).toBeTruthy();
    });
});


describe('Authenticate with admin user', () => {
    it('Should authenticate with admin user', async () => {
        
        const credentials = { str_username: 'admin', password: '123456' };

        await server.use(cors());
        await server.use(bodyParser.json());
        await server.use(bodyParser.urlencoded({ extended: true }));

        const response = await request(server)
            .post('/auth/'+version)
            .set('Content-Type', "application/json")
            .send(credentials);

            expect(response).toHaveProperty('token');

            console.log(response.status);

        // this.token = await response.body.token;
        // expect(response).toHaveProperty('token');
    });
});


describe('Create a user without authenticate', () => {
    it('Should revoke to create a user', async () => {
        const role = await Roles.findOne({ str_name: "Customer" });

        const userOBJ = { 
            str_name: 'plinio',
            str_username: 'plinioduartt', 
            password: '123456', 
            role: role,
            network: []
        };
        
        const response = await request(server)
            .post('/users/'+version)
            .send(userOBJ);

        // this.token = await response.body.token;
        expect(response.status).toBe(401);
    });
});


describe('Remove all data from database', () => {
    it('Should remove all data from database', async () => {     
        const users = await getRepository(User).createQueryBuilder('user').getMany();
        const roles = await getRepository(Roles).createQueryBuilder('roles').getMany();
        
        await User.remove(users);
        const usersAfterDelete = await getRepository(User).createQueryBuilder('user').getMany();
        expect(usersAfterDelete.length).toBe(0);

        await Roles.remove(roles);
        const rolesAfterDelete = await getRepository(Roles).createQueryBuilder('roles').getMany();
        expect(rolesAfterDelete.length).toBe(0);
        
    });
});




    



    

    