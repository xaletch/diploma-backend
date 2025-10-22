import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { ServiceCategoryDto } from "./dto/service-category.dto";

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

  @Get("service/:service_id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getFirstService(@Param("service_id") serviceId: string, @Req() req) {
    const companyId = req.user.companyId;
    return this.servicesService.getFirst(serviceId, companyId);
  }

  @Post("service")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service:create")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: ServiceCreateDto, @Req() req) {
    const companyId = req.user.companyId;
    return this.servicesService.create(dto, companyId);
  }

  @Delete("service/:service_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service:delete")
  @HttpCode(HttpStatus.OK)
  delete(@Param("service_id") serviceId: string) {
    return this.servicesService.delete(serviceId);
  }

  @Post("service/category")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service-category:create")
  @HttpCode(HttpStatus.CREATED)
  createCategory(@Body() dto: ServiceCategoryDto, @Req() req) {
    const companyId = req.user.companyId;
    return this.servicesService.createCategory(dto, companyId);
  }

  @Delete("service/category/:category_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service-category:delete")
  @HttpCode(HttpStatus.OK)
  deleteCategory(@Param("category_id") categoryId: number) {
    return this.servicesService.deleteCategory(categoryId);
  }
}
