import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Timestamp, getRepository } from "typeorm";

@Entity()
class Roles extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    str_name: string;

    @Column({ type: "varchar", length: 255 })
    str_desc: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    created_at: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    updated_at: string;
    
}

export default Roles;