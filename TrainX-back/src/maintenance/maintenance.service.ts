import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MaintenanceService {
  private readonly MAINTENANCE_KEY = 'maintenance:status';

  constructor(private readonly redis: RedisService) {}

  async getStatus(): Promise<boolean> {
    const value = await this.redis.get(this.MAINTENANCE_KEY);
    return String(value).toLowerCase() === 'true';
  }
  
  
  async setStatus(active: boolean): Promise<boolean> {
    await this.redis.set(this.MAINTENANCE_KEY, active.toString());
    return active;
  }
}
