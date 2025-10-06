import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { EmployeeDto } from "./dto/employee.dto";
import { Ip } from "src/shared/decorators/ip.decorator";
import { RegisterEmployeeDto } from "./dto/register.dto";

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Authorization()
  @Post("admin/employee")
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
