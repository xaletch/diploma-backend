import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ServicesService } from "./services.service";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { CompanyGuard } from "src/access/guard/company.guard";
import {
  ServiceCreateDto,
  ServiceCreateResponseDto,
  ServicesDto,
} from "./dto/service.dto";
import { Scopes } from "src/access/decorator/scopes.decorator";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger/dist/decorators";
import {
  ServiceCategoriesDto,
  ServiceCategoryDto,
} from "./dto/service-category.dto";
import { AddedUsersDto } from "./dto/added-users.dto";
import { AddedLocationsDto } from "./dto/added-locations.dto";
import { NotFoundDto, UnAuthorizedDto } from "src/shared/dto/errors.dto";

@ApiTags("Услуги")
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Просмотр услуг" })
  @ApiResponse({
    type: ServicesDto,
    status: HttpStatus.OK,
    isArray: true,
    description: "success",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: "Создание услуги" })
  @ApiBody({ type: ServiceCreateDto })
  @ApiResponse({
    type: ServiceCreateResponseDto,
    status: HttpStatus.CREATED,
    description: "success",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Post("service")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service:create")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: ServiceCreateDto, @Req() req) {
    const companyId = req.user.companyId;
    return this.servicesService.create(dto, companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Редактирование услуги" })
  @ApiResponse({
    type: NotFoundDto,
    status: HttpStatus.NOT_FOUND,
    description: "not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Patch("service/:service_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service:update")
  @HttpCode(HttpStatus.OK)
  update(
    @Body() dto: ServiceCreateDto,
    @Param("service_id") serviceId: string,
    @Req() req,
  ) {
    const companyId = req.user.companyId;
    return this.servicesService.update(dto, serviceId, companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Удаление услуги" })
  @ApiResponse({
    type: NotFoundDto,
    status: HttpStatus.NOT_FOUND,
    description: "not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Delete("service/:service_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service:delete")
  @HttpCode(HttpStatus.OK)
  delete(@Param("service_id") serviceId: string) {
    return this.servicesService.delete(serviceId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Добавление сотрудника к услуге" })
  @ApiBody({ type: AddedUsersDto })
  @ApiResponse({
    type: NotFoundDto,
    status: HttpStatus.NOT_FOUND,
    description: "not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: "Добавление локации к услуге" })
  @ApiBody({ type: AddedLocationsDto })
  @ApiResponse({
    type: NotFoundDto,
    status: HttpStatus.NOT_FOUND,
    description: "not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: "Получить список категорий" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: ServiceCategoriesDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Get("categories/service")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @HttpCode(HttpStatus.OK)
  getAllCategory(@Req() req) {
    const companyId = req.user.companyId;
    return this.servicesService.getAllCategory(companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Создание категории" })
  @ApiBody({ type: ServiceCategoryDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "success",
    type: ServiceCategoriesDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Post("service/category")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service-category:create")
  @HttpCode(HttpStatus.CREATED)
  createCategory(@Body() dto: ServiceCategoryDto, @Req() req) {
    const companyId = req.user.companyId;
    return this.servicesService.createCategory(dto, companyId);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: "Удаление категории" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "success",
    type: ServiceCategoriesDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Delete("service/category/:category_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service-category:delete")
  @HttpCode(HttpStatus.OK)
  deleteCategory(@Param("category_id") categoryId: number) {
    return this.servicesService.deleteCategory(categoryId);
  }
}
