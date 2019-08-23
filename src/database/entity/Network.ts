import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable } from 'typeorm';
import Visitors from "./Visitors";

@Entity()
class Network extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    str_cnpj: string;

    @Column()
    str_name: string;

    @ManyToMany(() => Visitors)
    @JoinTable()
    visitor: Visitors[];

}

export default Network;