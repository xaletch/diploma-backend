import { Module } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { BookingsController } from "./bookings.controller";
import { OrdersModule } from "src/orders/orders.module";

@Module({
  imports: [OrdersModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
