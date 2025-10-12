import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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

@ApiTags("Услуги")
@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get(":company_id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getAllServices(@Param("company_id") companyId: string) {
    return this.servicesService.getAll(companyId);
  }

  @Post(":company_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service:create")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: ServiceCreateDto,
    @Param("company_id") companyId: string,
  ) {
    return this.servicesService.create(dto, companyId);
  }
}
