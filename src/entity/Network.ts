import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
class Network extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    str_cnpj: string;

    @Column()
    str_name: string;

}

export default Network;