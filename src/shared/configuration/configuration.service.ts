/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from "@nestjs/common";
import * as dotenv from "dotenv";

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger("ConfigurationService");

  private currentEnv: string = process.env.NODE_ENV || "dev";

  constructor() {
    try {
      const result = dotenv.config();
      if (result.error) {
        this.logger.warn("Error loading .env file, using default values");
      }
    } catch (error) {
      this.logger.warn("Error loading .env file, using default values");
    }
  }

  get port(): number {
    return Number(process.env.PORT) || 3000;
  }

  get isDevelopment(): boolean {
    return this.currentEnv === "dev";
  }

  get allowedOrigins(): string[] {
    return (process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  get JWT() {
    return {
      Key: process.env.JWT_ACCESS_SECRET || "DEMO_SECRET",
      AccessTokenTtl: parseInt(process.env.ACCESS_TOKEN_TTL || "3600", 10),
      RefreshTokenTtl: parseInt(process.env.REFRESH_TOKEN_TTL || "30", 10),
    };
  }
}
