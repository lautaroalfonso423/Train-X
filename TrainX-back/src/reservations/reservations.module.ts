import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { SchedulesModule } from '../schedules/schedules.module';
import { SubscriptionsModule } from '../suscriptions/subscriptions.module';
import { User } from 'src/users/entities/user.entity';
import { Pay } from 'src/payments/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Schedule, Pay, User]),
    SchedulesModule, 
    SubscriptionsModule, 
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}