import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, BaseEntity } from 'typeorm';
import Network from './Network';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type:"varchar", length: 255, nullable: false })
    name: string;

    @Column({ type:"varchar", length: 255, nullable: false })
    last_name: string;

    @ManyToMany(() => Network)
    @JoinTable()
    network: Network[];

}
