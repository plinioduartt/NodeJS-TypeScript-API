import { Request, Response } from "express";
import User from "../entity/User";
import Roles from "../entity/Roles";
import { getRepository } from "typeorm";
import bcrypt = require("bcryptjs");
import Network from "../entity/Network";



class UserController {

    static index = async (req: Request, res: Response) => {

        const users = await getRepository(User)
        .createQueryBuilder("users")
        .leftJoinAndSelect("users.network", "network")
        .getMany();

        return res.json(users);

    }



    static store = async (req: Request, res: Response) => {
        
        const hasUser = await User.find({ str_username: req.body.str_username });
        if (hasUser != null) return res.status(400).json({ message: "Usuário já cadastrado!" });

        UserController.handleUserNetworks(req, res).then( async (networks) => {
            
            const role = await Roles.findOneOrFail({ id: req.body.role });

            var userObj: any =  new User();
            userObj.str_name = req.body.str_name;
            userObj.str_username = req.body.str_username;
            userObj.network  = networks;
            userObj.role     = role.str_name;
            userObj.password = await bcrypt.hash(req.body.password, 10);
       
            if(!userObj.save()) return res.status(500).json({ message: "Erro ao cadastrar usuário" });

            return res.send(userObj);
        });
            
    }



    static show = async (req: Request, res: Response) => {

        try {
            var user = await User.findOneOrFail({ where: {id: +req.params.id}, relations: ['role', 'network'] });
        } catch (error) {
            return res.status(400).json({ message: "Usuário não encontrado"});
        }
        return res.send(user);

    }



    static update = async (req: Request, res: Response) => {

        try {
            var user = await User.findOneOrFail({ where: {id: +req.params.id}, relations: ['role'] });
        } catch (error) {
            return res.status(400).json({ message: "Usuário não encontrado"});
        }
     
        if (req.body.role != null) req.body.role = await Roles.findOne({ str_name: req.body.role });
        if (req.body.password != null) req.body.password = await bcrypt.hash(req.body.password, 10);

        try {
            user = await User.merge(user, req.body);
            user.save();
        } catch (err) {
            return res.status(500).send("On update user error", err);
        }

        return res.send(user);

    }



    static delete = async (req: Request, res: Response) => {

        try {
            var user = await User.findOneOrFail({ where: {id: +req.params.id}, relations: ['role'] });
        } catch (error) {
            return res.status(400).json({ message: "Usuário não encontrado"});
        }
        await User.remove(user);
       
        return res.status(200).json({ message: "Deletado!" });
    }


    static handleUserNetworks = async (req, res) => {

        return new Promise( async (resolve) => {

            var networksArray = [];
            const reqNetworks = req.body.network;

            // Se não tiver nenhum ID dentro da request, retorna um array vazio logo no início
            if (reqNetworks.length == 0) resolve([]); 

            await reqNetworks.forEach( async (item, index) => {

                try {

                    // Verifica se existe alguma rede com este ID
                    const network = await Network.findOneOrFail({ id: item });
                    networksArray.push(network);
                    // Sobrescrevendo o array de Networks
                    req.body.network = networksArray;
                    // Caso seja o último item do foreach, executar...
                    if (index == (reqNetworks.length - 1)) {
                        resolve(req.body.network);
                    }

                } catch (error) {

                    return res.status(400).json({ message: `Loja de id "${item}" não encontrada.` });

                }

            });

        });        
    } 

}

export default UserController;
