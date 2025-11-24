import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Trainer } from "./trainer.entity";


@Entity()

export class TrainerQualification {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.qualifications,  { onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => Trainer, (trainer) => trainer.qualifications, {onDelete: "CASCADE"})
    trainer: Trainer;

    @Column({type: "decimal", precision: 2, scale:1,  default: 0})
    rating: number;
}
