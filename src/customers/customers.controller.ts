import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { SendCodeDto } from "./dto/send-code.dto";
import { VerifyCodeDto } from "./dto/verify.dto";

// отправить на микросервис
@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post("customer/auth/send-code")
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: SendCodeDto) {
    return await this.customersService.sendCode(dto);
  }

  @Post("customer/auth/verify")
  @HttpCode(HttpStatus.OK)
  async verify(@Body() dto: VerifyCodeDto, @Ip() customerIp) {
    return await this.customersService.verifyCode(dto, customerIp);
  }
}
