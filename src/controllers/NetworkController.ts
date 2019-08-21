import { Request, Response } from "express";
import Networks from "../entity/Network";
import { getRepository, getConnection } from "typeorm";




class NetworkController {

    
    static index = async (req: Request, res: Response) => {

        const networks = await getRepository(Networks)
        .createQueryBuilder("networks")
        .getMany();

        return res.json(networks);

    }



    static show = async (req: Request, res: Response) => {

        try {
            var network = await Networks.findOneOrFail({ id: +req.params.id });
        } catch (error) {
            return res.status(400).json({ message: "Rede não encontrada"});
        }
        return res.send(network);

    }

    static store = async (req: Request, res: Response) => {

        const hasNetwork = await Networks.findOne({ str_cnpj: req.body.str_cnpj });
        if (hasNetwork != null) return res.status(400).json({ message: "Rede já cadastrada!"});

        var network = await Networks.create(req.body);

        if (!network.save()) return res.status(500).send("Erro ao cadastrar network");
        
        return res.status(201).send(network);

    }



    //  Este método não adiciona e nem remove usuários da(s) rede(s), apenas edita as descrições&informações da(s) rede(s)
    // Para adicionar ou remover usuários de alguma rede, utilize os métodos networkAddUser() e networkRmUser() respectivamente
    static update = async (req: Request, res: Response) => {

        try {
            var network = await Networks.findOneOrFail({ id: +req.params.id });
        } catch (error) {
            return res.status(400).json({ message: "Rede não encontrada"});
        }
     
        try {
            network = await Networks.merge(network, req.body);
            network.save();
        } catch (err) {
            return res.status(500).send("On update network error", err);
        }

        return res.send(network);

    }



    static delete = async (req: Request, res: Response) => {

        try {
            var network = await Networks.findOneOrFail({ id: +req.params.id });
        } catch (error) {
            return res.status(400).json({ message: "Rede não encontrada"});
        }
        await Networks.remove(network);
       
        return res.status(200).json({ message: "Rede deletada!" });
        
    }


}

export default NetworkController;