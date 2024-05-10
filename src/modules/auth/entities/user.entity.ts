import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column('text', {
        unique: true,
    })
    username: string;
    
    @Column('text')
    password: string;
}