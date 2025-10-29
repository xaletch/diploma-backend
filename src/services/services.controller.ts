import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { ApiTags } from "@nestjs/swagger/dist/decorators";
import { ServiceCategoryDto } from "./dto/service-category.dto";
import { AddedUsersDto } from "./dto/added-users.dto";
import { AddedLocationsDto } from "./dto/added-locations.dto";

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

  @Put("service/users/:service_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service-users:update")
  @HttpCode(HttpStatus.OK)
  addedUsers(
    @Body() dto: AddedUsersDto,
    @Param("service_id") serviceId: string,
    @Req() req,
  ) {
    const companyId = req.user.companyId;
    return this.servicesService.addedUsers(dto, serviceId, companyId);
  }

  @Put("service/locations/:service_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service-locations:update")
  @HttpCode(HttpStatus.OK)
  addedLocations(
    @Body() dto: AddedLocationsDto,
    @Param("service_id") serviceId: string,
    @Req() req,
  ) {
    const companyId = req.user.companyId;
    return this.servicesService.addedLocations(dto, serviceId, companyId);
  }

  @Get("categories/service")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @HttpCode(HttpStatus.OK)
  getAllCategory(@Req() req) {
    const companyId = req.user.companyId;
    return this.servicesService.getAllCategory(companyId);
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
