import { Controller } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Заказы")
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
}
