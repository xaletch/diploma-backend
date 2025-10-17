import { Module } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CustomersController } from "./customers.controller";
import { RedisModule } from "src/redis/redis.module";

@Module({
  imports: [RedisModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
