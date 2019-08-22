import { Request, Response } from "express";
import User from "../entity/User";
import Roles from "../entity/Roles";
import { getRepository, getManager } from "typeorm";
import bcrypt = require("bcryptjs");
import Network from "../entity/Network";



class UserController {

    static index = async (req: Request, res: Response) => {

        const users = await getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.network", "network")
        .leftJoinAndSelect("user.role", "role")
        .getMany();

        return res.json(users);

    }



    static store = async (req: Request, res: Response) => {
        
        var data = req.body;
        const hasUser = await User.find({ str_username: data.str_username });
        if (hasUser.length > 0) return res.status(400).json({ message: "Usuário já cadastrado!" });

        UserController.handleUserNetworks(req, res).then( async (networks) => {
            
            const role = await Roles.findOneOrFail({ id: data.role });

            var userObj: any =  new User();
            userObj.str_name = data.str_name;
            userObj.str_username = data.str_username;
            userObj.network  = networks;
            userObj.role     = role;
            userObj.password = await bcrypt.hash(data.password, 10);
       
            if(!userObj.save()) return res.status(500).json({ message: "Erro ao cadastrar usuário" });

            return res.send(userObj);
        });
            
    }



    static show = async (req: Request, res: Response) => {

        try {
            var user = await User.findOneOrFail({ where: {id: +req.params.id}, relations: ['role', 'network'] });
            return res.send(user);
        } catch (error) {
            return res.status(400).json({ message: "Usuário não encontrado"});
        }

    }



    static update = async (req: Request, res: Response) => {

        var data = req.body;

        //Seleciona o usuário em questão
        var user = await getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.network", "network")
        .leftJoinAndSelect("user.role", "role")
        .where('user.id = :id', { id: req.params.id })
        .getOne();
        
        if (user == null) return res.status(400).json({ message: "Usuário não encontrado"});
        
        //Verificações básicas
        if (data.role != null) data.role = await Roles.findOne({ id: data.role });
        if (data.password != null) data.password = await bcrypt.hash(data.password, 10);

        //Verifica se tem novas redes e atualiza de acordo com as mesmas
        if (data.network != null) {
            
            await UserController.handleUserNetworks(req, res).then( async (networks: any) => {
                user.network = await networks;
            });     
              
        } 

        //Por fim, salva o usuário com as novas informações
        try {
            user = await User.merge(user, data);
            user.save();
        } catch (err) {
            return res.status(500).send("On update user error", err);
        }      

        return res.send(user);

    }



    static delete = async (req: Request, res: Response) => {

        var user = await User.findOne({ where: {id: +req.params.id}, relations: ['role'] });
        if (user == null) return res.status(400).json({ message: "Usuário não encontrado"});

        try {
            await User.remove(user);
            return res.status(200).json({ message: "Deletado!" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar usuário!", error: error});
        }
        
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
