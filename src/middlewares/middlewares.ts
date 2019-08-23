import { BaseEntity } from "typeorm";
import { Request, Response } from "express";
import Tokens from "../database/entity/Tokens";
var jwt = require('jsonwebtoken');

class Middlewares extends BaseEntity {

    // Rota para verificar se o usuário que enviou a request está autenticado
    static async authMiddleware(req: Request, res: Response, next) {

        if (req.headers.authorization == null) return res.status(401).json({ message: "Não autorizado!" });
        
        const token = await req.headers.authorization.split(" ")[1];

        try {

            const tokenOBJ = await Tokens.findOneOrFail({ token: token });
            
            if (tokenOBJ.revoked) return res.status(401).json({ message: "Token inválido!" });

            jwt.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) return res.status(401).json({ message: "Não autorizado" });
                else next();
            });
            
        } catch (error) {
            
            return res.status(401).json({ message: "Token inválido!" });

        }
        
    }

    static async adminRole(req: Request, res: Response, next) {

        const token = await req.headers.authorization.split(" ")[1];
        if (req.headers.authorization == null) return res.status(401).json({ message: "Não autorizado!" });

        const decoded = await jwt.decode(token);
        if (decoded.role == "Administrator") next();
        else return res.status(401).json({ message: "Não autorizado!" })
        
    }

}

export default Middlewares;
