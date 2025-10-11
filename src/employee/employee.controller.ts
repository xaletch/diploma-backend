import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { EmployeeDto } from "./dto/employee.dto";
import { Ip } from "src/shared/decorators/ip.decorator";
import { RegisterEmployeeDto } from "./dto/register.dto";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { Scopes } from "src/access/decorator/scopes.decorator";

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post("admin/employee")
  @UseGuards(AuthGuard, LoadUserGuard, ScopeGuard)
  @Scopes("employee:invite")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: EmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Authorization()
  @Post("employee/register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterEmployeeDto, @Ip() userIp) {
    return this.employeeService.register(dto, userIp);
  }
}
