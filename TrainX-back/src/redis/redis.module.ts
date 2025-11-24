import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          username: configService.get('REDIS_USERNAME'),
          password: configService.get('REDIS_PASSWORD'),
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
        });

        client.on('error', (err) => console.error('❌ Redis Error:', err));
        client.on('connect', () => console.log('✅ Redis Connected'));

        await client.connect();
        return client;
      },
    },
  RedisService],
  exports: [RedisService],
})
export class RedisModule {}
