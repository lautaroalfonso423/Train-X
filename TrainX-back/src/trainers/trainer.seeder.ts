import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TrainersSeed } from "./seeder.trainer";
import { Trainer } from "./entities/trainer.entity";



@Injectable()

export class TrainerSeeder {

    constructor(private readonly dataSoerce: DataSource){}

    async onInitTrainer(){

        const repo = await this.dataSoerce.getRepository(Trainer)

        for(const data of TrainersSeed){
                const exist = await repo.findOne({
                    where: {name: data.name}
                })

            if(!exist){
                await repo.save(repo.create(data))
            }

        }
        console.log("✅ Todos los entrenadores han sido cargados")
    }

}