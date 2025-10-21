import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeDto } from "./dto/employee.dto";
import { Ip } from "src/shared/decorators/ip.decorator";
import { RegisterEmployeeDto } from "./dto/register.dto";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { Scopes } from "src/access/decorator/scopes.decorator";
import { ApiTags } from "@nestjs/swagger";
import { LocationGuard } from "src/access/guard/location.guard";
import { CheckInviteDto } from "./dto/check-invite.dto";
import { CompanyGuard } from "src/access/guard/company.guard";
import { EmployeeUpdateDto } from "./dto/employee-update.dto";
import { EmployeeBlockedDto } from "./dto/blocked.dto";

@ApiTags("Сотрудники")
@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post("admin/employee")
  @UseGuards(AuthGuard, LoadUserGuard, ScopeGuard)
  @Scopes("employee:invite")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: EmployeeDto, @Req() req) {
    const companyId = req.user.company.id;
    return this.employeeService.create(dto, companyId);
  }

  @Post("check-invite")
  @HttpCode(HttpStatus.OK)
  checkInvite(@Body() dto: CheckInviteDto) {
    return this.employeeService.checkInvite(dto);
  }

  @Post("employee/register")
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterEmployeeDto, @Ip() userIp) {
    return this.employeeService.register(dto, userIp);
  }

  @Patch("employee/:user_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("employee:update")
  @HttpCode(HttpStatus.OK)
  update(@Body() dto: EmployeeUpdateDto, @Param("user_id") userId: string) {
    return this.employeeService.update(dto, userId);
  }

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
