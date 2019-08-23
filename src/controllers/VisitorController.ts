import { Request, Response } from "express";
import Visitors from "../database/entity/Visitors";
import { getRepository } from "typeorm";



class UserController {

    static index = async (req: Request, res: Response) => {

        const visitors = await getRepository(Visitors)
        .createQueryBuilder("visitors")
        .getMany();

        return res.send(visitors);

    }



    static store = async (req: Request, res: Response) => {
        
        const data = req.body;
        const visitor = await Visitors.create(data);
        
        try {
            await visitor.save();
            return res.status(201).send(visitor);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao cadastrar visitante!", error: error });
        }

    }



    static show = async (req: Request, res: Response) => {

        const visitor = await Visitors.findOne({ id: req.params.id });
        if (visitor == null) return res.status(400).json({ message: "Visitante não encontrado!" });

        return res.send(visitor);

    }



    static update = async (req: Request, res: Response) => {

        const data = req.body;
        var visitor = await Visitors.findOne({ id: req.params.id });
        if (visitor == null) res.status(400).json({ message: "Visitante não encontrado!" });
        
        try {
            visitor = await Visitors.merge(visitor, data);
            visitor.save();
            return res.send(visitor);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao atualizar visitante!" });
        }

    }


    static delete = async (req: Request, res: Response) => {

        var visitor = await Visitors.findOne({ id: +req.params.id });
        if (visitor == null) return res.status(400).json({ message: "Visitante não encontrado"});

        try {
            await Visitors.remove(visitor);
            return res.status(200).json({ message: "Deletado!" });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao deletar visitante!", error: error});
        }
        
    }


}

export default UserController;
