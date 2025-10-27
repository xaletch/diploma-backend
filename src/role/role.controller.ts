import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleDto } from "./dto/role.dto";
import { ApiTags } from "@nestjs/swagger/dist/decorators";

@ApiTags("Роли")
@Controller("role")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: RoleDto) {
    return this.roleService.createPermission(dto);
  }
}
