import { getRepository, BaseEntity } from "typeorm";
import User from "../entity/User";
import Roles from "../entity/Roles";
import bcrypt = require("bcryptjs");

class UserSeed extends BaseEntity {
    
    // Seed para criar um administrador sempre que startar o servidor em uma nova instância de banco
    static async seed() {
        const users = await getRepository(User)
        .createQueryBuilder("roles")
        .getMany();

        const role = await Roles.findOne({ str_name: "Administrator" });

        if (users.length == 0) {
            var user = new User();
            user.str_name = "Admin";
            user.str_username = "admin";
            user.network = [];
            user.password = await bcrypt.hash("123456", 10);
            user.role = role;

            user.save();
        }
    }
}

export default UserSeed;