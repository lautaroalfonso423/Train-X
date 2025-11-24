import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Subscription } from '../../suscriptions/entities/subscription.entity';
import { TrainerQualification } from './qualification.entity';

@Entity()
export class Trainer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    specialization: string;

    @Column({ nullable: true})
    formation?: string;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ type: "decimal", precision: 2, scale: 1, default: 0 })
    qualification: number

    @Column({ default: true })
    available: boolean;

    @OneToMany(()=> TrainerQualification, (e)=> e.trainer)
    qualifications: TrainerQualification[]
}
