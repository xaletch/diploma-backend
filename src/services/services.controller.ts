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
  @UseGuards(AuthGuard, CompanyGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: ServiceCreateDto,
    @Param("company_id") companyId: string,
  ) {
    return this.servicesService.create(dto, companyId);
  }
}
