import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Plan } from 'src/plans/plan.entity';
import {PlansEnum, SubStatus } from 'src/pay.enum';
import { Subscription } from 'src/suscriptions/entities/subscription.entity';



@Entity({
    name: "payments"
})
export class Pay {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    user: User;

 
    @ManyToOne(() => Plan, (plan)=> plan.payments)
    @JoinColumn({ name: "plan_id" })
    plan: Plan

    @Column()
    MpPaymentId: string;

    @Column({ default: false })
    isSubscription: boolean;

    @Column({default: false})
    paid: boolean

    @Column({
        type: 'enum',
        enum: PlansEnum,
        nullable: true
    })
    billingCycle: PlansEnum;

    @Column({
        type: "enum",
        enum: SubStatus,
        default: SubStatus.ACTIVE,
        })
    status: SubStatus;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ nullable: true })
    externalReference: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    amount: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    startsAt: Date;

    @Column({nullable: true})
    renewalDueAt: Date;

    @Column()
    endsAt: Date;

    @ManyToOne(() => Subscription, (subscription) => subscription.payments, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn()
    subscription: Subscription;
}
