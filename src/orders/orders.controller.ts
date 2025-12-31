import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { ApiTags } from "@nestjs/swagger";
import { OrderCreateDto } from "./dto/order-create.dto";

@ApiTags("Заказы")
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("order")
  // @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  // @Scopes("booking:create")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: OrderCreateDto) {
    return this.ordersService.create(dto);
  }
}
