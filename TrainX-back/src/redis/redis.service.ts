import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {

  private client: RedisClientType;
  private subscriber: RedisClientType;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const username = this.configService.get<string>('REDIS_USERNAME');
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');

    this.client = createClient({
      username,
      password,
      socket: { host, port }
    });

    this.subscriber = this.client.duplicate();

    this.client.on('error', err => console.error('❌ Redis Client Error:', err));
    this.subscriber.on('error', err => console.error('❌ Redis Subscriber Error:', err));

    await this.client.connect();
    await this.subscriber.connect();

    console.log('✅ Redis connected successfully');
  }

  async onModuleDestroy() {
    await this.client.quit();
    await this.subscriber.quit();
  }

  // ---------- CACHE METHODS ----------
  async set(key: string, value: any, ttlSeconds?: number) {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, serialized, { EX: ttlSeconds });
    } else {
      await this.client.set(key, serialized);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return data as any;
    }
  }

  async del(key: string) {
    return this.client.del(key);
  }

  async exists(key: string) {
    return this.client.exists(key);
  }

  // ---------- PUB/SUB ----------
  async publish(channel: string, message: any) {
    const payload = typeof message === 'string' ? message : JSON.stringify(message);
    return this.client.publish(channel, payload);
  }

  async subscribe(channel: string, callback: (message: any) => void) {
    await this.subscriber.subscribe(channel, (message) => {
      try {
        callback(JSON.parse(message));
      } catch {
        callback(message);
      }
    });
  }
}
