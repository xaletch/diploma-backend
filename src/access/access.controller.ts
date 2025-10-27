import { Controller } from "@nestjs/common";
import { AccessService } from "./access.service";
import { ApiTags } from "@nestjs/swagger/dist/decorators";

@ApiTags("Доступы")
@Controller("access")
export class AccessController {
  constructor(private readonly accessService: AccessService) {}
}
