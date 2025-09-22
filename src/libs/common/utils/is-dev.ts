import { ConfigService } from "@nestjs/config";
import * as dotenv from "dotenv";

dotenv.config();

export const isDev = (conf: ConfigService) =>
  conf.getOrThrow("NODE_ENV") === "dev";

export const IS_DEV_ENV = process.env.NODE_ENV === "dev";
