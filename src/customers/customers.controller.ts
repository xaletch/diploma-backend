import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { SendCodeDto } from "./dto/send-code.dto";
import { VerifyCodeDto } from "./dto/verify.dto";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { CompanyGuard } from "src/access/guard/company.guard";
import { CustomerCompanyDto } from "./dto/customer-company.dto";
import { Scopes } from "src/access/decorator/scopes.decorator";
import { AuthGuard } from "src/auth/guard/auth.guard";

// отправить на микросервис
@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post("customer/auth/send-code")
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: SendCodeDto) {
    return this.customersService.sendCode(dto);
  }

  @Post("customer/auth/verify")
  @HttpCode(HttpStatus.OK)
  verify(@Body() dto: VerifyCodeDto, @Ip() customerIp) {
    return this.customersService.verifyCode(dto, customerIp);
  }

  @Post("customer/company")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("company-customer:create")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CustomerCompanyDto, @Req() req) {
    const companyId = req.user.companyId;
    return this.customersService.createForCompany(dto, companyId);
  }
}
