import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlansStatus } from "src/plans.enum";
import { Pay } from "src/payments/entities/payment.entity";



@Entity({
    name: "plans"
})

export class Plan {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string

    @Column()
    type: string

    @Column({type: "numeric", precision:10, scale: 2 , default: 0})
    price: number;

    @Column({type: "varchar", default: "USD"})
    currency: string

    @Column("simple-json", {nullable: true})
    features: string[];

    @Column({
        type: "enum",
        enum: PlansStatus,
        default: PlansStatus.ACTIVE
    })
    status: PlansStatus

    @OneToMany(()=> Pay, (pay)=> pay.plan)
    payments: Pay[]


}