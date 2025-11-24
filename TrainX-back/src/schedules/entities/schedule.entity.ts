import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Activity } from '../../activities/entities/activity.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    dayOfWeek: string; 

    @Column()
    startTime: string;

    @Column()
    endTime: string;

    @Column()
    trainer: string;

    @Column({default: 0})
    limit: number

    @ManyToOne(() => Activity, (activity) => activity.schedules, {onDelete: "CASCADE"})
    activity: Activity;

    @OneToMany(() => Reservation, (reservation) => reservation.schedule)
    reservations: Reservation[];
}