import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Plan } from "./plan.entity";
import { Plans } from "./seeder.plan";
import { PlansStatus } from "src/plans.enum";



@Injectable()

export class PlanSeeder {
    constructor(private readonly dataSource: DataSource){}
    
    async run(){
        const repo = this.dataSource.getRepository(Plan);
        
        for(const data of Plans){
            const exist = await repo.findOne({where: {name: data.name}});
    
            if(!exist){
                await repo.save(repo.create({
                    name: data.name,
                    price: data.price,
                    type: data.type,
                    currency: data.currency,
                    features: data.features,
                    status: PlansStatus.ACTIVE
                }));
            }
        }
        console.log("✅ Los planes han sido cargados correctamente.");
    }
}







