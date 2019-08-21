// import { Request, Response } from "express";
// import Visitors from "../entity/Visitors";
// import { getRepository } from "typeorm";

// class UserController {

//     static index = async (req: Request, res: Response) => {
//         const visitors = await getRepository(Visitors)
//         .createQueryBuilder("visitors")
//         .getMany();
//         return res.json(visitors);
//     }

//     static store = async (req: Request, res: Response) => {
//         const user = await Visitors.create(req.body);
//         if (!user.save()) return res.status(500).send("Erro ao cadastrar usuário");
//         return res.status(201).send(user);
//     }

// }

// export default UserController;
