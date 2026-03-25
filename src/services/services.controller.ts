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
import { NotFoundDto, UnAuthorizedDto } from "src/shared/dto/errors.dto";
import { GlobalSuccessDto } from "src/shared/dto/global.dto";

@ApiTags("Услуги")
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

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

  @ApiBearerAuth()
  @ApiOperation({ summary: "Просмотр детальной информации об услуге" })
  @ApiResponse({
    type: undefined,
    status: HttpStatus.OK,
    isArray: true,
    description: "success",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Get("service/:service_id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getFirstService(@Param("service_id") serviceId: string, @Req() req) {
    const companyId = req.user.companyId;
    return this.servicesService.getFirst(serviceId, companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Добавление сотрудника к услуге" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: GlobalSuccessDto,
  })
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
  @Post("service/users/:service_id/:user_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service-users:update")
  @HttpCode(HttpStatus.OK)
  addedUsers(
    @Param("service_id") serviceId: string,
    @Param("user_id") userId: string,
    @Req() req,
  ) {
    const companyId = req.user.companyId;
    return this.servicesService.addUserToService(serviceId, userId, companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Удаление сотрудника из услуги" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: GlobalSuccessDto,
  })
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
  @Delete("service/users/:service_id/:user_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service-users:update")
  @HttpCode(HttpStatus.OK)
  removeUsers(
    @Param("service_id") serviceId: string,
    @Param("user_id") userId: string,
    @Req() req,
  ) {
    const companyId = req.user.companyId;
    return this.servicesService.removeUserFromService(
      serviceId,
      userId,
      companyId,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Добавление локации к услуге" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: GlobalSuccessDto,
  })
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
  @Post("service/locations/:service_id/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service-locations:update")
  @HttpCode(HttpStatus.OK)
  addedLocations(
    @Param("service_id") serviceId: string,
    @Param("location_id") locationId: string,
    @Req() req,
  ) {
    const companyId = req.user.companyId;
    return this.servicesService.addedLocationToService(
      serviceId,
      locationId,
      companyId,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Удаление локации из услуги" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: GlobalSuccessDto,
  })
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
  @Delete("service/locations/:service_id/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service-locations:update")
  @HttpCode(HttpStatus.OK)
  removeLocations(
    @Param("service_id") serviceId: string,
    @Param("location_id") locationId: string,
    @Req() req,
  ) {
    const companyId = req.user.companyId;
    return this.servicesService.removeLocation(
      serviceId,
      locationId,
      companyId,
    );
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
  @ApiOperation({ summary: "Редактирование категории" })
  @ApiBody({ type: ServiceCategoryDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: ServiceCategoriesDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Patch("service/category/:category_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("service-category:update")
  @HttpCode(HttpStatus.CREATED)
  editCategory(
    @Body() dto: ServiceCategoryDto,
    @Param("category_id") categoryId: number,
    @Req() req,
  ) {
    const companyId = req.user.companyId;
    return this.servicesService.updateCategory(dto, categoryId, companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Удаление категории" })
  @ApiResponse({
    status: HttpStatus.OK,
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
  deleteCategory(@Param("category_id") categoryId: number, @Req() req) {
    const companyId = req.user.companyId;
    return this.servicesService.deleteCategory(categoryId, companyId);
  }
}
