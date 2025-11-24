import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity()
export class Activity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: false })
    requiresReservation: boolean;

    @Column({ type:"int" ,nullable: true })
    maxCapacity?: number | null;

    @Column()
    imageUrl: string;

    @OneToMany(() => Schedule, (schedule) => schedule.activity)
    schedules: Schedule[];
}