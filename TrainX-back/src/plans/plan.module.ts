import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { Plan } from './plan.entity';
import { PlanSeeder } from './plan.seeder';
import { User } from 'src/users/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Plan, User])],
  controllers: [PlanController],
  providers: [PlanService, PlanSeeder],
  exports: [PlanSeeder]
})
export class PlanModule {}