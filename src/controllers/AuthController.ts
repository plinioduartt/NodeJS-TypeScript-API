import { Request, Response } from "express";
import User from "../entity/User";
import Tokens from "../entity/Tokens";
import bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

class AuthController {

    static auth = async (req: Request, res: Response) => {
        const { str_username, password } = req.body;
        try {
            const user = await User.findOneOrFail({ where: {str_username: str_username}, relations: ['role'] });

            if (bcrypt.compareSync(password, user.password)) {
                const token = await jwt.sign({ role: user.role.str_name, id: user.id }, process.env.SECRET, { expiresIn: 60*60 });
                const tokenOBJ = await Tokens.create({ token: token });
                await tokenOBJ.save();
                return res.json({ token: token, expiresIn: 60*60 });
            } else {
                return res.status(400).json({ message: "Usuário ou senha inválidos." });
            }
        } catch (error) {
            return res.status(400).json({ message: "Usuário inválido!" });
        }
    }


    
    static logout = async (req: Request, res: Response) => {
        const token = await req.headers.authorization.split(" ")[1];
        if (req.headers.authorization == null) return res.status(401).json({ message: "Não autorizado!" });

        try {
            var tokenOBJ = await Tokens.findOneOrFail({ token: token });
            tokenOBJ.revoked = true;
            tokenOBJ = await Tokens.merge(tokenOBJ);
            await tokenOBJ.save();
            return res.json({ message:"Sessão encerrada." });
        } catch (error) {
            return res.status(500).json({ message: "Erro, token não encontrado.", error: error });            
        }
      
    }

}

export default AuthController;