import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ServicesService } from "./services.service";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { CompanyGuard } from "src/access/guard/company.guard";
import { ServiceCreateDto } from "./dto/service.dto";
import { Scopes } from "src/access/decorator/scopes.decorator";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

@ApiTags("Услуги")
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get("services")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getAllServices(@Req() req) {
    const companyId = req.user.companyId;
    return this.servicesService.getAll(companyId);
  }

  @Post("service")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service:create")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: ServiceCreateDto, @Req() req) {
    const companyId = req.user.companyId;
    return this.servicesService.create(dto, companyId);
  }
}
