import { BaseEntity, getRepository } from "typeorm";
import Roles from "../entity/Roles";

class RolesSeed extends BaseEntity {
    static async seed() {
        const roles = await getRepository(Roles)
        .createQueryBuilder("roles")
        .getMany();

        if (roles.length === 0) {
            var admin = new Roles();
            admin.str_desc = "Administrator role";
            admin.str_name = "Administrator";
            admin.save();

            var customer = new Roles();
            customer.str_desc = "Customer role";
            customer.str_name = "Customer";
            customer.save();
        }
    }
}

export default RolesSeed;