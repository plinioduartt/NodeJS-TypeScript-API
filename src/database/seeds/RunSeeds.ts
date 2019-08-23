import RolesSeed from "./RolesSeed";
import UserSeed from "./UserSeed";
import { BaseEntity } from "typeorm";

class RunSeeds extends BaseEntity{

    static run = async () => {
        setTimeout( async () => {
            await RolesSeed.seed();
        }, 3000);
        setTimeout( async () => {
            await UserSeed.seed();
            return "ok";
        },3000);
    }
    
}
export default RunSeeds;