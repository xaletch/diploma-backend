import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleDto } from "./dto/role.dto";
import { ApiExcludeEndpoint } from "@nestjs/swagger/dist/decorators";

@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiExcludeEndpoint(true)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: RoleDto) {
    return this.roleService.createPermission(dto);
  }
}
