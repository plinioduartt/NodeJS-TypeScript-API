import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, BaseEntity, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import Network from './Network';
import Roles from './Roles';

@Entity()
class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type:"varchar", length: 255, nullable: false })
    str_name: string;

    @Column({ type:"varchar", length: 255, nullable: false })
    str_username: string;

    @Column({ type:"varchar", length: 255, nullable: false }) 
    password: string; 
    
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    created_at: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    updated_at: string;

    @ManyToOne(() => Roles)
    @JoinColumn()
    role: Roles;    

    @ManyToMany(() => Network)
    @JoinTable()
    network: Network[];

}

export default User;
