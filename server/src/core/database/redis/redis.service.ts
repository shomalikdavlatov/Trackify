import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import IORedis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: IORedis;
    private ttl: number;

    constructor(private config: ConfigService) {}

    onModuleInit() {
        const host = this.config.get<string>('REDIS_HOST') || '127.0.0.1';
        const port = Number(this.config.get<number>('REDIS_PORT') || 6379);
        const password = this.config.get<string>('REDIS_PASSWORD') || undefined;

        this.ttl = parseInt(this.config.get<string>('VERIFICATION_TTL')!) || 600;
        this.client = new IORedis({ host, port, password });
    }

    async set(key: string, value: string, ttlSeconds?: number) {
        if (ttlSeconds) {
            return this.client.set(key, value, 'EX', ttlSeconds);
        }
        return this.client.set(key, value, 'EX', this.ttl);
    }

    async get(key: string) {
        return this.client.get(key);
    }

    async del(key: string) {
        return this.client.del(key);
    }

    async onModuleDestroy() {
        try {
            await this.client.quit();
        } catch (err) {
            
        }
    }
}
