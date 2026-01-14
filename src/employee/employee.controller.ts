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
import { EmployeeService } from "./employee.service";
import { CreateEmployeeResponse, EmployeeDto } from "./dto/employee.dto";
import { Ip } from "src/shared/decorators/ip.decorator";
import { RegisterEmployeeDto } from "./dto/register.dto";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { Scopes } from "src/access/decorator/scopes.decorator";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger/dist/decorators";
import { LocationGuard } from "src/access/guard/location.guard";
import {
  CheckInviteDto,
  CheckInviteResponseDto,
  CheckInviteResponseErrorDto,
} from "./dto/check-invite.dto";
import { CompanyGuard } from "src/access/guard/company.guard";
import {
  EmployeeUpdateDto,
  EmployeeUpdateResponseDto,
} from "./dto/employee-update.dto";
import {
  EmployeeBlockedDto,
  EmployeeBlockedResponseDto,
} from "./dto/blocked.dto";
import { NotFoundDto, UnAuthorizedDto } from "src/shared/dto/errors.dto";
import { AuthResponseDto } from "src/auth/dto/auth-response.dto";
import { CompanyEmployeesDto } from "./dto/company-employees.dto";

@ApiTags("Сотрудники")
@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Создание сотрудника для компании" })
  @ApiBody({ type: EmployeeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "created",
    type: CreateEmployeeResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Post("employee/invite")
  @UseGuards(AuthGuard, LoadUserGuard, ScopeGuard)
  @Scopes("employee:invite")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: EmployeeDto, @Req() req) {
    const companyId = req.user.company.id;
    return this.employeeService.inviteCreate(dto, companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Проверка на валидность токена авторизации" })
  @ApiBody({ type: CheckInviteDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: CheckInviteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
    type: CheckInviteResponseErrorDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Post("check-invite")
  @HttpCode(HttpStatus.OK)
  checkInvite(@Body() dto: CheckInviteDto) {
    return this.employeeService.checkInvite(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Регистрация сотрудника" })
  @ApiBody({ type: RegisterEmployeeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: AuthResponseDto,
  })
  @Post("employee/register")
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterEmployeeDto, @Ip() userIp) {
    return this.employeeService.register(dto, userIp);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Редактировать сотрудника" })
  @ApiBody({ type: EmployeeUpdateDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: EmployeeUpdateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
    type: NotFoundDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Patch("employee/:user_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("employee:update")
  @HttpCode(HttpStatus.OK)
  update(@Body() dto: EmployeeUpdateDto, @Param("user_id") userId: string) {
    return this.employeeService.update(dto, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Заблокировать сотрудника для локации" })
  @ApiBody({ type: EmployeeBlockedDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: EmployeeBlockedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
    type: NotFoundDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Post("employee/blocked/:user_id/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("employee:update")
  @HttpCode(HttpStatus.OK)
  block(
    @Body() dto: EmployeeBlockedDto,
    @Param("user_id") userId: string,
    @Param("location_id") locationId: string,
  ) {
    return this.employeeService.blocked(dto, userId, locationId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Получить список все сотрудников работающих в компании",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: CompanyEmployeesDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Get("employee")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("employees:read")
  @HttpCode(HttpStatus.OK)
  getAll(@Req() req) {
    const companyId = req.user.company.id;
    return this.employeeService.getEmployees(companyId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Удалить сотрудника из локации" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: EmployeeUpdateResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
    type: NotFoundDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Delete("employee/:user_id/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("employee:delete")
  @HttpCode(HttpStatus.OK)
  delete(
    @Param("user_id") userId: string,
    @Param("location_id") locationId: string,
  ) {
    return this.employeeService.delete(userId, locationId);
  }
}
