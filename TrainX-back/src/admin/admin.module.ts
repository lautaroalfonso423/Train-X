import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { PaymentsModule } from '../payments/payments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pay } from 'src/payments/entities/payment.entity';

@Module({
  imports: [UsersModule, PaymentsModule, TypeOrmModule.forFeature([Pay])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
