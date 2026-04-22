import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DirectoriesService } from "./directories.service";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { CompanyGuard } from "src/access/guard/company.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { Scopes } from "src/access/decorator/scopes.decorator";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger/dist/decorators";
import { UnAuthorizedDto } from "src/shared/dto/errors.dto";
import { DirectoryEmployee } from "./dto/employee.dto";
import { DirectoryLocation } from "./dto/location.dto";
import { DirectoryService } from "./dto/service.dto";
import { LocationGuard } from "src/access/guard/location.guard";

@ApiTags("Директории")
@Controller("directory")
export class DirectoriesController {
  constructor(private readonly directoriesService: DirectoriesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Список всех сотрудников работающих в компании" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Список сотрудников",
    type: DirectoryEmployee,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Get("employees")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("directory:employees")
  @HttpCode(HttpStatus.OK)
  getEmployees(@Req() req) {
    const companyId = req.user.company.id;
    return this.directoriesService.employees(companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Список всех сотрудников работающих в локации" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Список сотрудников работающих в локации",
    type: DirectoryEmployee,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Get("employees/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, LocationGuard, ScopeGuard)
  @Scopes("directory:location-employees")
  @HttpCode(HttpStatus.OK)
  getLocationEmployees(@Param("location_id") locationId: string) {
    return this.directoriesService.locationEmployees(locationId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Список всех локаций компании" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Список локаций",
    type: DirectoryLocation,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Get("locations")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("directory:locations")
  @HttpCode(HttpStatus.OK)
  getLocations(@Req() req) {
    const companyId = req.user.company.id;
    return this.directoriesService.locations(companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Список услуг компании" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Список услуг",
    type: DirectoryService,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Get("services")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("directory:services")
  @HttpCode(HttpStatus.OK)
  getServices(@Req() req) {
    const companyId = req.user.company.id;
    return this.directoriesService.services(companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Список услуг локации" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Список услуг локации",
    type: DirectoryService,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Get("services/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, LocationGuard, ScopeGuard)
  @Scopes("directory:location-services")
  @HttpCode(HttpStatus.OK)
  getLocationServices(@Param("location_id") locationId: string) {
    return this.directoriesService.locationServices(locationId);
  }
}
