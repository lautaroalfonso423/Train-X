import { Module } from '@nestjs/common';
import { MpController } from './mercado.controller';
import { MpService } from './mercado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pay } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import { Plan } from 'src/plans/plan.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';



@Module({
  imports: [TypeOrmModule.forFeature([Pay, User, Plan]),
  NotificationsModule],
  controllers: [MpController],
  providers: [MpService]
})
export class MercadoPagoModule {}