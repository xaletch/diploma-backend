import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(private config: ConfigService) {
    this.redisClient = new Redis({
      host: this.config.get<string>("REDIS_HOST"),
      port: this.config.get<number>("REDIS_PORT"),
      username: this.config.get<string>("REDIS_USER"),
      password: this.config.get<string>("REDIS_PASSWORD"),
      db: this.config.get<number>("REDIS_DB"),
    });
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async setEx(key: string, seconds: number, value: string): Promise<void> {
    await this.redisClient.setex(key, seconds, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
