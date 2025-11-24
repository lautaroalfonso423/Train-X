import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { Trainer } from './entities/trainer.entity';
import { TrainerSeeder } from './trainer.seeder';
import { User } from 'src/users/entities/user.entity';
import { TrainerQualification } from './entities/qualification.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Trainer, User, TrainerQualification])],
  controllers: [TrainersController],
  providers: [TrainersService, TrainerSeeder],
  exports: [TrainersService,  TrainerSeeder],
})
export class TrainersModule {}