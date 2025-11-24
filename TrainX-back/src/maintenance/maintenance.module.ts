import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceGateway } from './maintenance.gateway';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceGateway],
})
export class MaintenanceModule {}
