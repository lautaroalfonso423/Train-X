import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pay } from "../../payments/entities/payment.entity";

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 10000.00 })
    amount: number;

    @Column({
        type: 'enum',
        enum: ['3_days', '5_days'],
        default: '3_days',
    })
    type: '3_days' | '5_days';

    @OneToOne(() => User, (user) => user.subscription, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @OneToMany(() => Pay, (payment) => payment.subscription)
    payments: Pay[];
}