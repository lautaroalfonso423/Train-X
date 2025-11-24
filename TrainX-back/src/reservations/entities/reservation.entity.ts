import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.reservations, {onDelete: "CASCADE"})
    user: User;

    @ManyToOne(() => Schedule, (schedule) => schedule.reservations, {onDelete: "CASCADE"})
    schedule: Schedule;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: 'active' })
    status: 'active' | 'cancelled';
}